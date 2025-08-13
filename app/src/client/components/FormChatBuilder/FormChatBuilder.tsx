import {
  ArrowLeft,
  BadgeQuestionMark,
  Divide,
  DotSquare,
  EllipsisVerticalIcon,
  StepBack,
} from "lucide-react";
import React, { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFormBySlug, useQuery } from "wasp/client/operations";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Field } from "wasp/entities";
import { cn } from "../../../lib/utils";
import { useFormBuilderStore } from "../../store";
import FormAndFieldSettings from "./FormAndFieldSettings";
import ChatPreview from "./ChatPreview";

const FormBuilder: FC<{ formSlug?: string }> = ({ formSlug }) => {
  const [selectedField, setSelectedField] = useState<Field>();

  const { data } = useQuery(getFormBySlug, {
    slug: formSlug || "",
    includeAnalytics: false,
    includeDraft: false,
  });

  const navigate = useNavigate();

  const {
    storedEdittingFormId,
    storedForm,
    updateStoredForm,
    updateEdittingFormId,
  } = useFormBuilderStore();

  

  useEffect(() => {
    if (!data) return;
    if (storedEdittingFormId === data.form.id) return; // form data stored in persisting state is most updated
    updateStoredForm(null);
    updateStoredForm(data.form);
  }, [data]);

  // if (!data) return "Not found";

  // const { form, canEdit, canView } = data;

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className="grid grid-rows-[50px_1fr]">
      <nav className="bg-white h-[50px] shadow-1 flex items-center px-10 justify-between">
        <button onClick={handleBackClick}>
          <ArrowLeft />
        </button>
        <div className="flex items-center gap-2">
          <p className="font-semibold text-lg">{storedForm?.title}</p>
          <Badge variant={"outline"}>{storedForm?.status}</Badge>
        </div>
        <div>
          <Button>Publish</Button>
        </div>
      </nav>

      <div className="flex gap-4 mx-5">
        <div className="CHAT h-[calc(100vh-100px)] overflow-auto mt-[25px] grow w-[32%]  ">
          <div className="h-full min-h-[500px] ">
            <h1 className="flex gap-2 text-lg items-center font-semibold">
              <BadgeQuestionMark /> Questions
            </h1>
            <div className="grid gap-2 mt-10">
              {storedForm?.fields?.map((field) => (
                <div
                  onClick={() => setSelectedField(field)}
                  className={cn(
                    "shadow border  flex items-center gap-3 rounded-md overflow-hidden hover:border-green-800 group transition-all cursor-pointer select-none",
                    selectedField?.id === field.id
                      ? "border-green-700 bg-gradient-to-br from-green-100 to-white"
                      : ""
                  )}
                >
                  <div
                    className={cn(
                      "min-w-2 h-full bg-black text-white flex items-center group-hover:bg-green-700 cursor-grab",
                      selectedField?.id === field.id ? "bg-green-900" : ""
                    )}
                  >
                    <EllipsisVerticalIcon />
                  </div>
                  <p className="font-bold text-3xl text-gray-600">
                    {field.order}
                  </p>
                  <div className="p-2">
                    <p>{field.title}</p>
                    <Badge variant={"outline"}>{field.type}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="CHAT h-[calc(100vh-100px)] overflow-auto mt-[25px] rounded-3xl grow  w-[30%] border border-green-900">
          <ChatPreview />
        </div>

        <div className="CHAT h-[calc(100vh-100px)] overflow-auto mt-[25px]  grow w-[32%]">
          <div className="h-full min-h-[500px] ">
            <FormAndFieldSettings clickedField={selectedField} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormBuilder;
