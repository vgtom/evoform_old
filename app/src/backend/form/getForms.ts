import { z } from "zod";
import { Form } from "wasp/entities";
import { FormStatus, FormType } from "@prisma/client";
import { GetForms } from "wasp/server/operations";
// Define input schema with Zod
const GetFormsInputSchema = z.object({
  page: z.number().int().min(1, "Page must be at least 1"),
  limit: z
    .number()
    .int()
    .min(1, "Limit must be at least 1")
    .max(100, "Limit cannot exceed 100"),
  search: z.string().optional(), // Search term for title or description
  formType: z.enum(Object.values(FormType) as [string, ...string[]]).optional(), // Filter by form type
  status: z.enum(Object.values(FormStatus) as [string, ...string[]]).optional(), // Filter by form status
  workspaceId: z.string().optional(), // Filter by workspace ID
});

// Define input and output types
type GetFormsInput = z.infer<typeof GetFormsInputSchema>;

export interface GetFormsOutput extends Record<string, any> {
  items: Form[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  limit: number;
}

// Define the query
const getForms: GetForms<GetFormsInput, GetFormsOutput> = async (
  args,
  context
) => {
  // Validate input with Zod
  const { page, limit, search, formType, status, workspaceId } =
    GetFormsInputSchema.parse(args);
  const {
    user,
    entities: { Form, Workspace },
  } = context;
  const skip = (page - 1) * limit;

  // Ensure user is authenticated
  if (!user) {
    throw new Error("User must be authenticated to fetch forms");
  }

  // Build the where clause dynamically
  const where: any = {
    OR: [
      { creatorId: user.id },
      {
        workspace: {
          members: { some: { userId: user.id } },
        },
      },
    ],
  };

  // Workspace filter
  if (workspaceId) {
    const workspace = await Workspace.findFirst({
      where: {
        id: workspaceId,
        members: { some: { userId: user.id } },
      },
    });
    if (!workspace) {
      throw new Error("User does not have access to the specified workspace");
    }
    where.workspaceId = workspaceId;
  }

  // Search filter: case-insensitive search on title or description
  if (search) {
    const searchTerm = search.trim();
    where.AND = where.AND || [];
    where.AND.push({
      OR: [
        { title: { contains: searchTerm, mode: "insensitive" } },
        { description: { contains: searchTerm, mode: "insensitive" } },
      ],
    });
  }

  // Form type filter
  if (formType) {
    where.type = formType;
  }

  // Status filter
  if (status) {
    where.status = status;
  }

  // Fetch forms and total count in parallel
  const [forms, totalItems] = await Promise.all([
    Form.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" }, // Sort by creation date, newest first

    }),
    Form.count({ where }),
  ]);

  return {
    items: forms,
    totalItems,
    currentPage: page,
    totalPages: Math.ceil(totalItems / limit),
    limit,
  };
};

export default getForms
