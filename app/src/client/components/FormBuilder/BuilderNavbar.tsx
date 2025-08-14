import React from "react";
import Breadcrumbs from "../../../components/Breadcrumbs";
import { Badge } from "../../../components/ui/badge";
import { useFormBuilderStore } from "../../store";
import { Button } from "../../../components/ui/button";
import { updateForm, useAction } from "wasp/client/operations";
import { UpdateFormInput } from "../../../backend/form/updateForm";

const BuilderNavbar = () => {
  const { storedForm } = useFormBuilderStore();
  const updateFormFn = useAction(updateForm)
  const handleSaveClick = () => {
    if (!storedForm) return
    updateFormFn({form: storedForm} as UpdateFormInput)
  }
  return (
    <nav className="bg-white h-[50px] shadow-1 flex items-center px-10 justify-between">
      <div>
        <Breadcrumbs
          items={[
            { name: "Forms", link: "/forms" },
            { name: storedForm?.title || "", link: location.pathname },
          ]}
        />
      </div>

      <div className="flex items-center gap-2">
        <p className="font-semibold text-lg">{storedForm?.title}</p>
        <Badge variant={"outline"}>{storedForm?.status}</Badge>
      </div>
      <div className="flex gap-2">
        <Button variant={"outline"}> Reset</Button>
        <Button variant={"outline"} onClick={handleSaveClick}> Save</Button>
        <Button>Publish</Button>
      </div>
    </nav>
  );
};

export default BuilderNavbar;
