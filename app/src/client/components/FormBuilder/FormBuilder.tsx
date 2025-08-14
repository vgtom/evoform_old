import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFormBySlug, useQuery } from "wasp/client/operations";
import { Field, File } from "wasp/entities";
import { useFormBuilderStore } from "../../store";
import FormAndFieldSettings from "./FormAndFieldSettings";
import Preview from "./Preview";
import BuilderNavbar from "./BuilderNavbar";
import BuilderQuestionFields from "./BuilderQuestionFields";

const FormBuilder: FC<{ formSlug?: string }> = ({ formSlug }) => {
  const [selectedField, setSelectedField] = useState<Field & { coverImage?: File | null }>();

  const [edittingFormId, setEdittingFormId] = useState("")

  const { data } = useQuery(getFormBySlug, {
    slug: formSlug || "",
    includeAnalytics: false,
    includeDraft: false,
  });

  const navigate = useNavigate();

  const {
    storedForm,
    updateStoredForm,
  } = useFormBuilderStore();

  useEffect(() => {
    if (!data) return;
    setEdittingFormId(data.form.id)
    if (storedForm?.id === data.form.id) return; // form data stored in persisting state is most updated
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
      <BuilderNavbar />

      <div className="flex gap-4 ">
        <div className="CHAT h-[calc(100vh-50px)] overflow-auto p-[25px]  w-[20%] bg-white min-w-[300px]  ">
          <BuilderQuestionFields
            selectedField={selectedField}
            setSelectedField={setSelectedField}
          />
        </div>

        <div className="CHAT h-[calc(100vh-100px)] overflow-auto mt-[25px] rounded-xl grow  w-[30%] border border-green-900 shrink">
          <Preview clickedField={selectedField} />
        </div>

        <div className="CHAT h-[calc(100vh-100px)] overflow-auto p-[25px]   w-[20%] bg-white min-w-[300px]">
          <div className="h-full min-h-[500px] ">
            <FormAndFieldSettings edittingFormId={edittingFormId} clickedField={selectedField} setClickedField={setSelectedField} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormBuilder;
