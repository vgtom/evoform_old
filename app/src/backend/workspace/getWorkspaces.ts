import { Workspace } from "wasp/entities";
import { HttpError } from "wasp/server";
import { GetWorkspaces } from "wasp/server/operations";

const getWorkspaces: GetWorkspaces<null, Workspace[]> = async (
  _args,
  context
) => {
  if (!context.user) {
    throw new HttpError(401, "Not authenticated");
  }

  let workspaces = await context.entities.Workspace.findMany({
    where: {
      members: {
        some: { userId: context.user.id },
      },
    },
    include: { members: true },
  });

  const myWorkspace = workspaces.find((ws) => ws.name === "My workspace");

  if (!myWorkspace) {
    const newWorkspace = await context.entities.Workspace.create({
      data: {
        name: "My workspace",
        members: {
          create: {
            userId: context.user.id,
            role: "OWNER",
          },
        },
        slug: `${"workspace-" + crypto.randomUUID() + "-slug"}`,
      },
      include: { members: true },
    });

    workspaces.push(newWorkspace);
  }

  return workspaces;
};

export default getWorkspaces;
