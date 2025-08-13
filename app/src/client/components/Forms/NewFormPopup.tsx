import { FC, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import SearchInput from "../../../components/SearchInput";
import { getPublicTemplates, makeFormWithTemplateId, useQuery } from "wasp/client/operations";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { cn } from "../../../lib/utils";
import { BookMarkedIcon, Check, Stars } from "lucide-react";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

type NewFormPopupProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const NewFormPopup: FC<NewFormPopupProps> = ({ open, setOpen }) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const { data: templates } = useQuery(getPublicTemplates, {
    page: 1,
    limit: 10,
  });

  const navigate = useNavigate()

  const handleMakeFormWithTemplateClick = async (templateId: string) => {
    const newForm = await makeFormWithTemplateId({templateId: templateId })
    if (!newForm) toast.error("Error while creating form!")
    toast("Created form successfully!")
    navigate(`/forms/${newForm.slug}`)
  }


  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <DialogContent className=" sm:h-[calc(100vh-2rem)] bg-gradient-to-br from-green-50 grid grid-rows-[max-content_1fr]">
        <DialogHeader className="text-center items-center pb-10">
          <DialogTitle className="flex items-center gap-2"><Stars size={15} />Quick start with AI </DialogTitle>
        </DialogHeader>
        <div className="grid gap-5 overflow-auto items-start content-start p-1 grid-rows-2">
          <div className="h-full grid">
            <Textarea
              className="h-full max-h-[200px]"
              placeholder="Make AI form. Type how should your form be..."
            />
            <Button className="m-auto mt-5">
              {" "}
              <Stars /> Generate form
            </Button>
          </div>
          <div>
            <DialogHeader className="text-center items-center pb-10">
              <DialogTitle>Quick start with template</DialogTitle>
            </DialogHeader>
            {templates?.items.map((template) => (
              <div
                onClick={() => setSelectedTemplateId(template.id)}
                key={template.id}
                className={cn(
                  "relative bg-white border-green-800 border p-2 rounded-md cursor-pointer flex justify-between items-center",
                  selectedTemplateId === template.id
                    ? "border-4 bg-gradient-to-br from-green-100 to-green-50"
                    : ""
                )}
              >
                <p className="text-xl font-semibold text-green-800">
                  {template.name}
                </p>
                {selectedTemplateId === template.id && (
                  <Button onClick={() => handleMakeFormWithTemplateClick(template.id)}>Make form</Button>
                )}
              </div>
            ))}
          </div>
        </div>
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewFormPopup;
