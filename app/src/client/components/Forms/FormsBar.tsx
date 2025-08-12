import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { useQuery } from "wasp/client/operations";
import { getWorkspaces } from "wasp/client/operations";
import { Button } from "../../../components/ui/button";
import { Plus } from "lucide-react";
import NewFormPopup from "./NewFormPopup";
import NewWorkspacePopup from "../Workspace/NewWorkspacePopup";
import SearchInput from "../../../components/SearchInput";

const FormsBar = () => {
  const { data: workspaces } = useQuery(getWorkspaces);
  const [newFormPopupOpen, setNewFormPopupOpen] = useState(false);
  const [newWorkspacePopupOpen, setNewWorkspacePopupOpen] = useState(false);
  return (
    <>
      <div className="flex justify-between">
        <div className="LEFT">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Workspace" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Workspaces</SelectLabel>
                {workspaces?.map((workspace) => (
                  <SelectItem value={workspace.id}>{workspace.name}</SelectItem>
                ))}
              </SelectGroup>
              <Button
                className="w-full rounded-none !bg-white text-black hover:bg-accent"
                onClick={() => setNewWorkspacePopupOpen(true)}
              >
                + New workspace
              </Button>
            </SelectContent>
          </Select>
        </div>
        <div className="RIGHT flex gap-2">
          <SearchInput className="rounded-md" />
          <Button onClick={() => setNewFormPopupOpen(true)}>
            <Plus /> New Form
          </Button>
        </div>
      </div>

      <NewFormPopup open={newFormPopupOpen} setOpen={setNewFormPopupOpen} />
      <NewWorkspacePopup
        open={newWorkspacePopupOpen}
        setOpen={setNewWorkspacePopupOpen}
      />
    </>
  );
};

export default FormsBar;
