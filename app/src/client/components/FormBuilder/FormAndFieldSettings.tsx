import { Settings2 } from "lucide-react";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { useFormBuilderStore } from "../../store";
import { Textarea } from "../../../components/ui/textarea";
import { Field } from "wasp/entities";
import FormSettings from "./FormSettings";
import { FC } from "react";
import FieldSettings from "./FieldSettings";

type FormAndFieldSettingsProps = {
  edittingFormId: string;
  clickedField?: Field;
  setClickedField: React.Dispatch<React.SetStateAction<Field | undefined>>;
};

const FormAndFieldSettings: FC<FormAndFieldSettingsProps> = ({
  edittingFormId,
  clickedField,
  setClickedField
}) => {
  return (
    <div>
      <div className="h-full min-h-[500px] ">
        {!clickedField ? (
          <FormSettings edittingFormId={edittingFormId} />
        ) : (
          <FieldSettings clickedField={clickedField} edittingFormId={edittingFormId} setClickedField={setClickedField} />
        )}
      </div>
    </div>
  );
};

export default FormAndFieldSettings;
