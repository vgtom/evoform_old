import { Settings2 } from "lucide-react";
import React, { FC, useEffect, useState } from "react";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { useFormBuilderStore } from "../../store";
import { Field } from "wasp/entities";

const FormSettings: FC<{edittingFormId: string }> = ({edittingFormId}) => {
  const { storedForm, updateStoredForm } = useFormBuilderStore();

  const [formValues, setFormValues] = useState<{
    formTitle: string;
    formDescription: string;
  }>({
    formTitle: "",
    formDescription: "",
  });

  useEffect(() => {
    if (!storedForm) return;
    if (storedForm.id !== edittingFormId) return;

    const handler = setTimeout(() => {
      updateStoredForm({
        ...storedForm,
        title: formValues.formTitle,
        description: formValues.formDescription,
      });
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [formValues, storedForm, updateStoredForm, edittingFormId]);

  useEffect(() => {
    if (!storedForm) return;
    if (storedForm.id !== edittingFormId) return;

    setFormValues((prev) => ({
      ...prev,
      formTitle: prev.formTitle || storedForm.title || "",
      formDescription: prev.formDescription || storedForm.description || "",
    }));
  }, [storedForm, edittingFormId]);
  return (
    <>
      <h1 className="flex gap-2 text-lg items-center font-semibold">
        <Settings2 />Form Settings
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
    </>
  );
};

export default FormSettings;
