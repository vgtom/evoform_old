import { PrismaClient } from "wasp/server";

export async function dbSeed(prisma: PrismaClient) {
  // Create a workspace for the templates
  const workspace = await prisma.workspace.create({
    data: { 
      name: "Public Templates", 
      slug: crypto.randomUUID(),
      description: "Collection of public form templates",
    },
  });

  const adminUser = await prisma.user.findFirst({ where: { isAdmin: true } });

  if (!adminUser) {
    console.error("Admin user not found for seeding template data");
    return;
  }

  // Create multiple public templates
  await prisma.template.create({
    data: {
      creatorId: adminUser.id,
      isPublic: true,
      structure: {
        theme: { primaryColor: "#4B5EAA", font: "Inter" },
        settings: { showProgressBar: true, allowMultipleSubmissions: false },
      },
      type: "SURVEY",
      name: "Customer Feedback Survey",
      description: "Gather detailed customer feedback about your products or services.",
      category: "Customer Experience",
      tags: ["survey", "feedback", "customer satisfaction"],
      workspaceId: workspace.id,
      forms: {
        create: [
          {
            creatorId: adminUser.id,
            slug: crypto.randomUUID(),
            title: "Customer Experience Survey",
            fields: {
              create: [
                {
                  order: 1,
                  title: "How would you rate our product?",
                  type: "RATING",
                  required: true,
                  properties: { maxRating: 5, shape: "stars" },
                },
                {
                  order: 2,
                  title: "What do you like most about our product?",
                  type: "LONG_TEXT",
                  required: false,
                },
                {
                  order: 3,
                  title: "How likely are you to recommend us?",
                  type: "OPINION_SCALE",
                  required: true,
                  properties: { min: 0, max: 10, labels: { 0: "Not likely", 10: "Very likely" } },
                },
                {
                  order: 4,
                  title: "Which product features do you use most?",
                  type: "CHECKBOXES",
                  required: true,
                  options: {
                    create: [
                      { order: 1, label: "Core Features" },
                      { order: 2, label: "Analytics" },
                      { order: 3, label: "Customization" },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  });

  await prisma.template.create({
    data: {
      creatorId: adminUser.id,
      isPublic: true,
      structure: {
        theme: { primaryColor: "#2E7D32", font: "Roboto" },
        settings: { showProgressBar: false, allowMultipleSubmissions: true },
      },
      type: "QUIZ",
      name: "General Knowledge Quiz",
      description: "Test your audience's general knowledge with engaging questions.",
      category: "Education",
      tags: ["quiz", "knowledge", "trivia"],
      workspaceId: workspace.id,
      forms: {
        create: [
          {
            creatorId: adminUser.id,
            slug: crypto.randomUUID(),
            title: "Trivia Challenge",
            quizSettings: { showResults: true, passScore: 70 },
            fields: {
              create: [
                {
                  order: 1,
                  title: "What is the capital of France?",
                  type: "QUIZ",
                  required: true,
                  options: {
                    create: [
                      { order: 1, label: "Paris", isCorrect: true },
                      { order: 2, label: "London", isCorrect: false },
                      { order: 3, label: "Berlin", isCorrect: false },
                    ],
                  },
                  points: 10,
                  explanation: "Paris is the capital city of France.",
                },
                {
                  order: 2,
                  title: "Which planet is known as the Red Planet?",
                  type: "QUIZ",
                  required: true,
                  options: {
                    create: [
                      { order: 1, label: "Mars", isCorrect: true },
                      { order: 2, label: "Jupiter", isCorrect: false },
                      { order: 3, label: "Venus", isCorrect: false },
                    ],
                  },
                  points: 10,
                  explanation: "Mars is called the Red Planet due to its reddish appearance.",
                },
              ],
            },
          },
        ],
      },
    },
  });

  await prisma.template.create({
    data: {
      creatorId: adminUser.id,
      isPublic: true,
      structure: {
        theme: { primaryColor: "#D81B60", font: "Lato" },
        settings: { showProgressBar: true, allowMultipleSubmissions: true },
      },
      type: "POLL",
      name: "Event Feedback Poll",
      description: "Collect quick feedback from event attendees.",
      category: "Events",
      tags: ["poll", "event", "feedback"],
      workspaceId: workspace.id,
      forms: {
        create: [
          {
            creatorId: adminUser.id,
            slug: crypto.randomUUID(),
            title: "Event Satisfaction Poll",
            pollSettings: { showResults: true, multipleResponses: false },
            fields: {
              create: [
                {
                  order: 1,
                  title: "How would you rate the event overall?",
                  type: "RATING",
                  required: true,
                  properties: { maxRating: 5, shape: "hearts" },
                },
                {
                  order: 2,
                  title: "What was your favorite part of the event?",
                  type: "POLL_CHOICE",
                  required: true,
                  options: {
                    create: [
                      { order: 1, label: "Keynote Speech" },
                      { order: 2, label: "Networking Sessions" },
                      { order: 3, label: "Workshops" },
                    ],
                  },
                },
                {
                  order: 3,
                  title: "Would you attend again?",
                  type: "TRUE_FALSE",
                  required: true,
                },
              ],
            },
          },
        ],
      },
    },
  });

  await prisma.template.create({
    data: {
      creatorId: adminUser.id,
      isPublic: true,
      structure: {
        theme: { primaryColor: "#0288D1", font: "Open Sans" },
        settings: { showProgressBar: false, allowMultipleSubmissions: false },
      },
      type: "REGISTRATION",
      name: "Event Registration Form",
      description: "Register attendees for your upcoming event.",
      category: "Events",
      tags: ["registration", "event", "signup"],
      workspaceId: workspace.id,
      forms: {
        create: [
          {
            creatorId: adminUser.id,
            slug: crypto.randomUUID(),
            title: "Event Registration",
            fields: {
              create: [
                {
                  order: 1,
                  title: "Full Name",
                  type: "SHORT_TEXT",
                  required: true,
                },
                {
                  order: 2,
                  title: "Email Address",
                  type: "EMAIL",
                  required: true,
                },
                {
                  order: 3,
                  title: "Phone Number",
                  type: "PHONE",
                  required: false,
                },
                {
                  order: 4,
                  title: "Dietary Restrictions",
                  type: "CHECKBOXES",
                  required: false,
                  options: {
                    create: [
                      { order: 1, label: "Vegetarian" },
                      { order: 2, label: "Vegan" },
                      { order: 3, label: "Gluten-Free" },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  });

  await prisma.template.create({
    data: {
      creatorId: adminUser.id,
      isPublic: true,
      structure: {
        theme: { primaryColor: "#F57C00", font: "Montserrat" },
        settings: { showProgressBar: true, allowMultipleSubmissions: false },
      },
      type: "CONTACT",
      name: "Contact Us Form",
      description: "Simple contact form for customer inquiries.",
      category: "Customer Support",
      tags: ["contact", "support", "inquiry"],
      workspaceId: workspace.id,
      forms: {
        create: [
          {
            creatorId: adminUser.id,
            slug: crypto.randomUUID(),
            title: "Contact Us",
            fields: {
              create: [
                {
                  order: 1,
                  title: "Your Name",
                  type: "SHORT_TEXT",
                  required: true,
                },
                {
                  order: 2,
                  title: "Email Address",
                  type: "EMAIL",
                  required: true,
                },
                {
                  order: 3,
                  title: "Subject",
                  type: "SHORT_TEXT",
                  required: true,
                },
                {
                  order: 4,
                  title: "Your Message",
                  type: "LONG_TEXT",
                  required: true,
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log("✅ Seed data with multiple public templates created!");
}