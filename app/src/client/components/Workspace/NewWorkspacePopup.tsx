import { FC, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import SearchInput from "../../../components/SearchInput";
import { Input } from "../../../components/ui/input";

type NewWorkspacePopupProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const NewWorkspacePopup: FC<NewWorkspacePopupProps> = ({ open, setOpen }) => {
  const [name, setName] = useState("adsf");
  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <form>
        <DialogContent className="  bg-gradient-to-br from-green-50  ">
          <DialogHeader className="text-center items-center pb-10">
            <DialogTitle>New workspace name</DialogTitle>
          </DialogHeader>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
          
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default NewWorkspacePopup;
