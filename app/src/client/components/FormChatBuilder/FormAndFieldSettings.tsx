import { BadgeQuestionMark, Settings2 } from "lucide-react";
import React, { FC, useEffect, useState } from "react";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { useFormBuilderStore } from "../../store";
import { Textarea } from "../../../components/ui/textarea";
import { Field } from "wasp/entities";

const FormAndFieldSettings: FC<{ clickedField?: Field }> = () => {
  const { storedForm, updateStoredForm } = useFormBuilderStore();

  const [formValues, setFormValues] = useState<{
    formTitle: string;
    formDescription: string;
  }>({
    formTitle:  "",
    formDescription:  "",
  });

//   useEffect(() => {
//     if (!storedForm) return;

//     const handler = setTimeout(() => {
//       updateStoredForm({
//         ...storedForm,
//         title: formValues.formTitle,
//         description: formValues.formDescription,
//       });
//     }, 500);

//     return () => {
//       clearTimeout(handler);
//     };
//   }, [formValues, storedForm, updateStoredForm]);

  useEffect(() => {
    if (!storedForm) return;

    setFormValues((prev) => ({
      ...prev,
      formTitle: prev.formTitle || storedForm.title || "",
      formDescription: prev.formDescription || storedForm.description || "",
    }));
  }, [storedForm]);

  return (
    <div>
      <div className="h-full min-h-[500px] ">
        <h1 className="flex gap-2 text-lg items-center font-semibold">
          <Settings2 /> Settings
        </h1>
        <div className="grid gap-2 mt-10">
          <Label>Form title</Label>
          <Input
            value={formValues?.formTitle}
            onChange={(e) =>
              setFormValues((prev) => ({ ...prev, formTitle: e.target.value }))
            }
          />
          <Label>Form description</Label>
          <Textarea
            value={formValues?.formDescription}
            onChange={(e) =>
              setFormValues((prev) => ({
                ...prev,
                formDescription: e.target.value,
              }))
            }
          />
        </div>
      </div>
    </div>
  );
};

export default FormAndFieldSettings;
