import { HttpError } from "wasp/server";
import { UpdateForm } from "wasp/server/operations";
import z from "zod";

// Input schema for updating a form
const updateFormInputSchema = z.object({
  form: z.object({
    id: z.string().min(1, "Form ID is required"),
    title: z.string().min(1, "Title is required"),
    description: z.string().optional().nullable(),
    slug: z.string().min(1, "Slug is required"),
    type: z.enum(["FORM", "QUIZ", "POLL", "SURVEY", "REGISTRATION", "ORDER", "CONTACT"]).optional(),
    status: z.enum(["DRAFT", "PUBLISHED", "PAUSED", "ARCHIVED"]).optional(),
    theme: z.any().optional().nullable(),
    logo: z.string().optional().nullable(),
    favicon: z.string().optional().nullable(),
    settings: z.any().optional().nullable(),
    quizSettings: z.any().optional().nullable(),
    pollSettings: z.any().optional().nullable(),
    metaTitle: z.string().optional().nullable(),
    metaDescription: z.string().optional().nullable(),
    ogImage: z.string().optional().nullable(),
    isPublished: z.boolean().optional(),
    publishedAt: z.string().datetime().optional().nullable(),
    password: z.string().optional().nullable(),
    accessType: z.enum(["PUBLIC", "PRIVATE", "PASSWORD_PROTECTED", "DOMAIN_RESTRICTED"]).optional(),
    allowedDomains: z.array(z.string()).optional(),
    responseLimit: z.number().optional().nullable(),
    expiresAt: z.string().datetime().optional().nullable(),
    workspaceId: z.string().optional().nullable(),
    fields: z
      .array(
        z.object({
          id: z.string().optional(),
          title: z.string().min(1, "Field title is required"),
          description: z.string().optional().nullable(),
          type: z.enum([
            "SHORT_TEXT",
            "LONG_TEXT",
            "EMAIL",
            "PHONE",
            "URL",
            "NUMBER",
            "MULTIPLE_CHOICE",
            "DROPDOWN",
            "CHECKBOXES",
            "RATING",
            "OPINION_SCALE",
            "RANKING",
            "DATE",
            "TIME",
            "DATETIME",
            "FILE_UPLOAD",
            "IMAGE_UPLOAD",
            "SIGNATURE",
            "PAYMENT",
            "LEGAL",
            "TRUE_FALSE",
            "FILL_IN_BLANK",
            "QUIZ",
            "POLL_CHOICE",
            "SECTION_BREAK",
            "THANK_YOU",
            "REDIRECT",
          ]),
          coverImageId: z.string().optional().nullable(),
          required: z.boolean().optional(),
          order: z.number().int(),
          properties: z.any().optional().nullable(),
          correctAnswer: z.string().optional().nullable(),
          points: z.number().optional().nullable(),
          explanation: z.string().optional().nullable(),
          logic: z.any().optional().nullable(),
          options: z
            .array(
              z.object({
                id: z.string().optional(),
                order: z.number().int(),
                label: z.string().min(1, "Option label is required"),
                isCorrect: z.boolean().optional().nullable(),
              })
            )
            .optional()
            .nullable(),
        })
      )
      .optional(),
  }),
});

// Define input and output types
export type UpdateFormInput = z.infer<typeof updateFormInputSchema>;
type UpdateFormOutput = {
  success: boolean;
  message: string;
  form?: any;
};

// Define the updateForm action
const updateForm: UpdateForm<UpdateFormInput, UpdateFormOutput> = async (args, context) => {
  // Validate input
  const parsedInput = updateFormInputSchema.safeParse(args);
  if (!parsedInput.success) {
    throw new HttpError(400,  parsedInput.error.errors.join(","));
  }

  // Ensure user is authenticated
  if (!context.user) {
    throw new HttpError(401, "Not authenticated");
  }

  const { form } = parsedInput.data;


  // Verify the form exists and the user is the creator or has appropriate permissions
  const existingForm = await context.entities.Form.findUnique({
    where: { id: form.id },
    include: { creator: true, workspace: true },
  });

  if (!existingForm) {
    throw new HttpError(404, "Form not found");
  }

  if (existingForm.creatorId !== context.user.id) {
    throw new HttpError(403, "You are not authorized to edit this form");
  }

  try {
    // Prepare form data for update
    const formData: any = {
      title: form.title,
      description: form.description,
      slug: form.slug,
      type: form.type,
      status: form.status,
      theme: form.theme,
      logo: form.logo,
      favicon: form.favicon,
      settings: form.settings,
      quizSettings: form.quizSettings,
      pollSettings: form.pollSettings,
      metaTitle: form.metaTitle,
      metaDescription: form.metaDescription,
      ogImage: form.ogImage,
      isPublished: form.isPublished,
      publishedAt: form.publishedAt ? new Date(form.publishedAt) : undefined,
      password: form.password,
      accessType: form.accessType,
      allowedDomains: form.allowedDomains,
      responseLimit: form.responseLimit,
      expiresAt: form.expiresAt ? new Date(form.expiresAt) : undefined,
      workspaceId: form.workspaceId,
    };

    // Handle fields and options with nested writes
    const fieldsData = form.fields?.map((field) => {
      const fieldData = {
        title: field.title,
        description: field.description,
        type: field.type,
        coverImageId: field.coverImageId,
        required: field.required ?? false,
        order: field.order,
        properties: field.properties,
        correctAnswer: field.correctAnswer,
        points: field.points,
        explanation: field.explanation,
        logic: field.logic,
        options: field.options
          ? {
              upsert: field.options.map((option) => ({
                where: { id: option.id || "" },
                create: {
                  order: option.order,
                  label: option.label,
                  isCorrect: option.isCorrect,
                },
                update: {
                  order: option.order,
                  label: option.label,
                  isCorrect: option.isCorrect,
                },
              })),
            }
          : undefined,
      };

      return {
        where: { id: field.id || "" },
        create: {
          ...fieldData,
          options: field.options
            ? {
                create: field.options.map((option) => ({
                  order: option.order,
                  label: option.label,
                  isCorrect: option.isCorrect,
                })),
              }
            : undefined,
        },
        update: fieldData,
      };
    });

    // Update the form with nested fields and options
    const updatedForm = await context.entities.Form.update({
      where: { id: form.id },
      data: {
        ...formData,
        fields: fieldsData
          ? {
              upsert: fieldsData,
            }
          : undefined,
      },
      include: {
        fields: {
          include: {
            options: true,
            coverImage: true,
          },
        },
        workspace: true,
        creator: true,
        _count: {
          select: { responses: true, fields: true },
        },
      },
    });

    return {
      success: true,
      message: "Form updated successfully",
      form: updatedForm,
    };
  } catch (error) {
    console.error("Error updating form:", error);
    throw new HttpError(500, "Failed to update form");
  }
};

export default updateForm;