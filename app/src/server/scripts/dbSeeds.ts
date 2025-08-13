import { PrismaClient } from "wasp/server";
import { FieldType, FormType } from "@prisma/client";
import crypto from "crypto";
import { FormSettings, FormTheme, TemplateStructure } from "../../backend/types/JsonTypes";
import { InputJsonValue, JsonObject } from "@prisma/client/runtime/library";

export async function dbSeed(prisma: PrismaClient) {
  // Create a workspace for public templates
  const workspace = await prisma.workspace.create({
    data: {
      name: "Public Templates",
      slug: crypto.randomUUID(),
      description: "Collection of public form templates",
    },
  });

  // Find an admin user
  const adminUser = await prisma.user.findFirst({ where: { isAdmin: true } });

  if (!adminUser) {
    console.error("Admin user not found for seeding template data");
    return;
  }

  // Define the template structure
  const templateStructure: TemplateStructure = {
    type: FormType.REGISTRATION,
    theme: {
      primaryColor: "#4A90E2",
      mode: "light",
      fontFamily: "Roboto, sans-serif",
      fontSize: 16,
      borderRadius: 4,
    } as FormTheme,
    settings: {
      showProgressBar: true,
      allowSaveAndResume: false,
      submitButtonText: "Register",
      successMessage: "Thank you for registering!",
      errorMessage: "There was an error submitting your registration.",
    } as FormSettings,
    quizSettings: undefined, // Not applicable for REGISTRATION form
    pollSettings: undefined, // Not applicable for REGISTRATION form
    fields: [
      {
        order: 1,
        title: "Full Name",
        type: FieldType.SHORT_TEXT,
        required: true,
        properties: {
          placeholder: "Enter your full name",
          minLength: 2,
          maxLength: 100,
        },
      },
      {
        order: 2,
        title: "Email Address",
        type: FieldType.EMAIL,
        required: true,
        properties: {
          placeholder: "Enter your email",
          pattern: "^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$",
          message: "Please enter a valid email address.",
        },
      },
      {
        order: 3,
        title: "Contact Number",
        type: FieldType.PHONE,
        required: false,
        properties: {
          placeholder: "Enter your phone number",
          pattern: "^\\+?[1-9]\\d{1,14}$",
          message: "Please enter a valid phone number.",
        },
      },
      {
        order: 4,
        title: "Event Sessions",
        type: FieldType.CHECKBOXES,
        required: true,
        options: [
          { order: 1, label: "Morning Workshop" },
          { order: 2, label: "Afternoon Seminar" },
          { order: 3, label: "Evening Networking" },
        ],
      },
      {
        order: 5,
        title: "Meal Preference",
        type: FieldType.MULTIPLE_CHOICE,
        required: true,
        options: [
          { order: 1, label: "Vegetarian" },
          { order: 2, label: "Non-Vegetarian" },
          { order: 3, label: "Vegan" },
        ],
      },
      {
        order: 6,
        title: "Additional Comments",
        type: FieldType.LONG_TEXT,
        required: false,
        properties: {
          placeholder: "Any special requirements or notes?",
          maxLength: 500,
        },
      },
      {
        order: 7,
        title: "Terms and Conditions",
        type: FieldType.CHECKBOXES,
        required: true,
        options: [
          { order: 1, label: "I agree to the event terms and conditions" },
        ],
      },
    ],
  };

  // Create the template with fields in the structure
  await prisma.template.create({
    data: {
      creatorId: adminUser.id,
      isPublic: true,
      structure: templateStructure as JsonObject,
      type: FormType.REGISTRATION,
      name: "Event Registration Form",
      description: "A template for collecting attendee details for events.",
      category: "Event Registration",
      tags: ["event", "registration", "form"],
      workspaceId: workspace.id,
    },
  });

  console.log("✅ Event Registration template seeded!");
}