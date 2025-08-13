import { z } from "zod";
import { Form, Workspace, Field, Option } from "wasp/entities";
import { FormStatus, AccessType } from "@prisma/client";
import type { Prisma } from "@prisma/client";
import { GetFormBySlug } from "wasp/server/operations";

// Define input schema with Zod
const GetFormBySlugInputSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  password: z.string().optional(), // For password-protected forms
  includeAnalytics: z.boolean().optional().default(false), // Whether to include analytics data
  includeDraft: z.boolean().optional().default(false), // Whether to allow draft forms (for editors)
});

// Define input and output types
type GetFormBySlugInput = z.infer<typeof GetFormBySlugInputSchema>;

// Define the enhanced form type with relations - make it more flexible
type FormWithRelations = Form & {
  fields: (Field & {
    options?: Option[] | null;
  })[];
  workspace?: {
    id: string;
    name: string;
    slug: string; 
  } | null;
  creator: {
    id: string;
    email: string | null;
    username: string | null;
  };
  _count?: {
    responses: number;
    fields: number;
  };
  analytics?: any[]; // FormAnalytic[] if included
  [key: string]: any; // Allow additional properties from Prisma
};

export interface GetFormBySlugOutput extends Record<string, any> {
  form: FormWithRelations;
  canEdit: boolean; // Whether current user can edit this form
  canView: boolean; // Whether current user can view responses
}

// Define the query
const getFormBySlug: GetFormBySlug<
  GetFormBySlugInput,
  GetFormBySlugOutput
> = async (args, context) => {
  try {
    // Validate input with Zod
    const { slug, password, includeAnalytics, includeDraft } =
      GetFormBySlugInputSchema.parse(args);

    const {
      user,
      entities: { Form, Workspace },
    } = context;

    // Build the where clause
    const where: Prisma.FormWhereInput = {
      slug,
    };

    // If not including drafts, only show published forms (unless user is owner/editor)
    if (!includeDraft) {
      where.OR = [
        { status: FormStatus.PUBLISHED },
        // Allow creators and workspace members to see drafts
        ...(user
          ? [
              { creatorId: user.id },
              {
                workspace: {
                  members: { some: { userId: user.id } },
                },
              },
            ]
          : []),
      ];
    }

    // Build include clause
    const include: Prisma.FormInclude = {
      fields: {
        include: {
          options: {
            orderBy: { order: "asc" },
          },
        },
        orderBy: { order: "asc" },
      },
      workspace: {
        select: { id: true, name: true, slug: true },
      },
      creator: {
        select: { id: true, email: true, username: true },
      },
      _count: {
        select: { responses: true, fields: true },
      },
    };

    // Include analytics if requested and user has access
    if (includeAnalytics && user) {
      include.analytics = {
        orderBy: { date: "desc" },
        take: 30, // Last 30 days
      };
    }

    // Fetch the form
    const form = await Form.findFirst({
      where,
      include,
    });

    if (!form) {
      throw new Error("Form not found");
    }

    // Check access permissions
    const isCreator = user?.id === form.creatorId;
    const isWorkspaceMember =
      user &&
      form.workspace &&
      (await Workspace.findFirst({
        where: {
          id: form.workspaceId!,
          members: { some: { userId: user.id } },
        },
      }));

    const canEdit = isCreator || !!isWorkspaceMember;
    const canView = canEdit; // Same permissions for now

    // Check if form is accessible to public
    if (!canEdit) {
      // Check if form is published
      if (form.status !== FormStatus.PUBLISHED) {
        throw new Error("Form is not published");
      }

      // Check if form has expired
      if (form.expiresAt && new Date() > form.expiresAt) {
        throw new Error("Form has expired");
      }

      // Check response limit
      if (form.responseLimit && form._count.responses >= form.responseLimit) {
        throw new Error("Form has reached its response limit");
      }

      // Check access type restrictions
      switch (form.accessType) {
        case AccessType.PRIVATE:
          throw new Error("Form is private");

        case AccessType.PASSWORD_PROTECTED:
          if (!password || form.password !== password) {
            throw new Error("Invalid password");
          }
          break;

        case AccessType.DOMAIN_RESTRICTED:
          if (user?.email) {
            const emailDomain = user.email.split("@")[1];
            if (!form.allowedDomains.includes(emailDomain)) {
              throw new Error("Your email domain is not allowed");
            }
          } else {
            throw new Error("Email verification required for this form");
          }
          break;

        case AccessType.PUBLIC:
        default:
          // Public access - no restrictions
          break;
      }
    }

    // Sanitize sensitive data for non-editors
    if (!canEdit) {
      // Create a sanitized version by copying and overriding sensitive fields
      const sanitizedForm = {
        ...form,
        password: null, // Hide password from public users
        settings: null, // Hide internal settings
        analytics: undefined, // Remove analytics if not included or no access
        
      } as FormWithRelations;

      return {
        form: sanitizedForm,
        canEdit: false,
        canView: false,
      };
    }

    // Return full form data for editors
    return {
      form: form as FormWithRelations,
      canEdit,
      canView,
    };
  } catch (error) {
    console.error("Error fetching form by slug:", error);

    // Re-throw Zod validation errors
    if (error instanceof z.ZodError) {
      throw error;
    }

    // Re-throw known errors
    if (error instanceof Error) {
      throw error;
    }

    // Generic error fallback
    throw new Error("Failed to fetch form");
  }
};

export default getFormBySlug