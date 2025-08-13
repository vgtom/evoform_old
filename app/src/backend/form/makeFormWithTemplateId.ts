import { MakeFormWithTemplateId } from "wasp/server/operations";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { Form, Template, User, Workspace } from "wasp/entities";
import { FieldType, Prisma } from "@prisma/client";
import { TemplateStructure } from "../types/JsonTypes";
import { JsonObject } from "@prisma/client/runtime/library";

// Define input schema with Zod
const MakeFormInputSchema = z.object({
  templateId: z.string().min(1, "Template ID is required"),
});

// Define input and output types
type MakeFormInput = z.infer<typeof MakeFormInputSchema>;

interface FormFieldInput {
  title: string;
  description?: string;
  type: FieldType;
  required?: boolean;
  order: number;
  properties?: Prisma.JsonValue;
  correctAnswer?: string;
  points?: number;
  explanation?: string;
  logic?: Prisma.JsonValue;
  options?: Array<{
    order: number;
    label: string;
    isCorrect?: boolean;
  }>;
}

interface MakeFormOutput extends Record<string, any>  {

  fields: Array<{
    id: string;
    title: string;
    description?: string;
    type: string;
    required: boolean;
    order: number;
    properties?: Prisma.JsonValue;
    correctAnswer?: string;
    points?: number;
    explanation?: string;
    logic?: Prisma.JsonValue;
    options: Array<{
      id: string;
      order: number;
      label: string;
      isCorrect?: boolean;
      createdAt: Date;
      updatedAt: Date;
    }>;
    createdAt: Date;
    updatedAt: Date;
  }>;
}

// Define the action
export const makeFormWithTemplateId: MakeFormWithTemplateId<
  MakeFormInput,
  Form & MakeFormOutput
> = async (args, context) => {
  // Validate input with Zod
  const { templateId } = MakeFormInputSchema.parse(args);
  const {
    user,
    entities: { Form, Template, Workspace },
  } = context;

  // Ensure user is authenticated
  if (!user) {
    throw new Error("User must be authenticated to create a form");
  }

  // Validate template exists and is accessible
  const template = await Template.findUnique({
    where: { id: templateId },
    include: { workspace: true },
  });

  if (!template) {
    throw new Error("Template not found");
  }

  // Check if template is public or user has access
  if (!template.isPublic && template.creatorId !== user.id) {
    if (!template.workspaceId) {
      throw new Error("You do not have access to this template");
    }
    const workspaceMember = await Workspace.findFirst({
      where: {
        id: template.workspaceId,
        members: { some: { userId: user.id } },
      },
    });
    if (!workspaceMember) {
      throw new Error(
        "You are not a member of the workspace owning this template"
      );
    }
  }

  // Generate a unique slug
  const baseSlug =
    template.name.toLowerCase().replace(/\s+/g, "-") +
    "-" +
    uuidv4().slice(0, 8);
  let slug = baseSlug;
  let counter = 1;
  while (await Form.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  // Prepare form data
  const formData: Prisma.FormCreateInput = {
    title: template.name,
    description: template.description,
    slug,
    type: template.type ,
    status: "DRAFT",
    creator: { connect: { id: user.id } },
    workspace: template.workspaceId
      ? { connect: { id: template.workspaceId } }
      : undefined,
    template: { connect: { id: templateId } },
    theme: (template.structure as TemplateStructure)?.theme as JsonObject ?? null ,
    settings: (template.structure as TemplateStructure)?.settings as JsonObject ?? null,
    quizSettings: (template.structure as TemplateStructure)?.quizSettings as JsonObject ?? null,
    pollSettings: (template.structure as TemplateStructure)?.pollSettings as JsonObject ?? null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Create the new form with fields and options
  const newForm = await Form.create({
    data: {
      ...formData,
      fields: {
        create: ((template.structure as TemplateStructure)?.fields)?.map(
          (field) => ({

            title: field.title,
            description: field.description,
            type: field.type as FieldType,
            required: field.required ?? false,
            order: field.order,
            properties: field.properties as Prisma.JsonObject ?? null,
            correctAnswer: field.correctAnswer ?? null,
            points: field.points ?? null,
            explanation: field.explanation ?? null,
            logic: field.logic as unknown  as Prisma.JsonObject ?? null,
            options: {
              create: field.options?.map((option, optIndex) => ({
                order: optIndex + 1,
                label: option.label,
                isCorrect: option.isCorrect ?? null,
                createdAt: new Date(),
                updatedAt: new Date(),
              })),
            },
            createdAt: new Date(),
            updatedAt: new Date(),
          })
        ),
      },
    },
    include: { fields: { include: { options: true } } },
  });

  // Increment template usage count
  await Template.update({
    where: { id: templateId },
    data: { useCount: { increment: 1 } },
  });

  return newForm as Form & MakeFormOutput;
};
