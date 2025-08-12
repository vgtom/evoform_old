import { FC, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import SearchInput from "../../../components/SearchInput";
import { getPublicTemplates, useQuery } from "wasp/client/operations";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";

type NewFormPopupProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const NewFormPopup: FC<NewFormPopupProps> = ({ open, setOpen }) => {
  const [searchText, setSearchText] = useState("");
  const { data: templates } = useQuery(getPublicTemplates, {
    page: 1,
    limit: 10,
    search: searchText,
  });
  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <DialogContent className=" sm:h-[calc(100vh-2rem)] bg-gradient-to-br from-green-50 grid grid-rows-[max-content_1fr]">
        <DialogHeader className="text-center items-center pb-10">
          <DialogTitle>Quick start with templates</DialogTitle>
          <SearchInput
            debounceAction={(text) => setSearchText(text)}
            className="max-w-full w-[400px] shrink"
          />
        </DialogHeader>
        <div className="grid gap-5 overflow-auto items-start content-start p-1">
          <div className=" bg-white border-green-800 border p-2 rounded-md relative h-20 flex justify-center items-center hover:bg-gradient-to-br from-green-100 to-green-50 cursor-pointer transition-all">
            <p className="text-xl">Create blank form</p>
           
          </div>
          {templates?.items.map((template) => (
            <div
              key={template.id}
              className=" bg-white border-green-800 border p-2 rounded-md relative"
            >
              <p className="text-xl">{template.name}</p>
              <p>{template.createdAt.toDateString()}</p>
              <p>{template.rating}</p>
              <p className="text-xs">{template.description}</p>
              <div className="flex gap-1 justify-between items-baseline mt-5">
                <div className="flex gap-1 text-white ">
                  <Badge className="bg-green-600">{template.useCount} Users</Badge>
                  <Badge className="bg-green-600">{template.type}</Badge>
                  <Badge className="bg-green-600">
                    {template.isPremium ? "Premium" : "Free"}
                  </Badge>
                </div>
                <Button variant={'outline'} className="">Create</Button>
              </div>
            </div>
          ))}
        </div>
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewFormPopup;
