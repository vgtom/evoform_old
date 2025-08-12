import { HttpError } from "wasp/server";
import { CreateWorkspace } from "wasp/server/operations";
import z from "zod";

const createWorkspaceInputSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1),
});
type CreateWorkspaceInput = z.infer<typeof createWorkspaceInputSchema>;
type CreateWorkspaceOutput = {
  success: boolean;
  message: string;
};

const createWorkspace: CreateWorkspace<
  CreateWorkspaceInput,
  CreateWorkspaceOutput
> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(400, "Not authonticated");
  }

  const newWorkspace = await context.entities.Workspace.create({
    data: { name: args.name, slug: args.slug },
  });
  if (!newWorkspace) throw new HttpError(403, "Invalid input");
  return { success: true, message: "Workspace created successfully" };
};

export default createWorkspace;
