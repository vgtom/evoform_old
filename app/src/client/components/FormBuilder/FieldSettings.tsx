import { Settings2 } from "lucide-react";
import React, { FC, useEffect, useState } from "react";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { Field, Form } from "wasp/entities";
import { useForm } from "react-hook-form";
import { useFormBuilderStore } from "../../store";
import CustomSelect from "../../../components/CustomSelect";
import { FieldType } from "@prisma/client";
import { object } from "zod";
import {
  FileWithValidType,
  uploadFileWithProgress,
} from "../../../file-upload/fileUploading";
import { ALLOWED_FILE_TYPES } from "../../../file-upload/validation";
import { getDownloadFileSignedURL } from "wasp/client/operations";
import { File } from "wasp/entities";
import PlaceholderImage from '../../static/placeholder.png'

type FieldSettingsProps = {
  edittingFormId: string;
  clickedField: Field;
  setClickedField: React.Dispatch<React.SetStateAction<Field | undefined>>;
};

const FieldSettings: FC<FieldSettingsProps> = ({
  clickedField,
  edittingFormId,
  setClickedField,
}) => {
  const [coverImageUploadProgress, setCoverImageUploadProgress] = useState(0);
  const [coverImageUrl, setCoverImageUrl] = useState<string>();
  const {
    register,
    reset,
    formState: { errors, isValid },
    watch,
    setValue,
  } = useForm<Field & { coverImage: File }>({
    defaultValues: clickedField,
    mode: "all",
  });

  const { storedForm, updateStoredForm } = useFormBuilderStore();

  // Watch the 'type' field to pass its value to CustomSelect
  const typeValue = watch("type");

  useEffect(() => {
    reset(clickedField);
  }, [clickedField.id, reset]);

  useEffect(() => {
    if (!storedForm || storedForm.id !== edittingFormId || !isValid) return;

    const handler = setTimeout(() => {
      const formValues = watch();
      const updatedFields = storedForm.fields.map((field) =>
        field.id === clickedField.id ? { ...field, ...formValues } : field
      );
      updateStoredForm({
        ...storedForm,
        fields: updatedFields,
      });
      
      // Find the updated field from the store instead of using the old clickedField reference
      const updatedClickedField = updatedFields.find(field => field.id === clickedField.id);
      if (updatedClickedField) {
        setClickedField(updatedClickedField);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [
    // watch('title'),
    // watch('description'),
    JSON.stringify(watch()),
    // watch('coverImage.id'),
    updateStoredForm,
    edittingFormId,
    clickedField.id,
    setClickedField,
    isValid,
  ]);

  useEffect(() => {
    const coverImageKey = watch("coverImage")?.key;
    if (!coverImageKey) {
      setCoverImageUrl("");
      return
    }
    getDownloadFileSignedURL({ key: coverImageKey }).then((res) => {
      setCoverImageUrl(res);
    });
  }, [watch("coverImage.id")]);

  
  useEffect(() => {
    if (!coverImageUrl) console.log("Nooo Cover image ")
    console.log(coverImageUrl)
  }, [coverImageUrl])
  
  useEffect(() => {
    console.log("This field changed ")
    console.log(storedForm?.fields.find(i => i.id === clickedField.id))
  }, [storedForm?.fields.find(i => i.id === clickedField.id)])

  const handleChangeCoverImage: React.ChangeEventHandler<
    HTMLInputElement
  > = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const { createdFile, createdFileUrl } = await uploadFileWithProgress({
      file: file as FileWithValidType,
      setUploadProgressPercent(percentage) {
        setCoverImageUploadProgress(percentage);
      },
      takeFileUrl: true
    });
    
    // if (createdFileUrl) setCoverImageUrl(createdFileUrl)
    setValue("coverImageId", createdFile.id);
    setValue("coverImage", createdFile);
  };


  return (
    <div>
      <h1 className="flex gap-2 text-lg items-center font-semibold">
        <Settings2 /> Field Settings
      </h1>
      <div className="grid gap-2 mt-10">
        <fieldset>
          <Label htmlFor="title">Title</Label>
          <Input
            {...register("title", {
              required: "Field title is required",
            })}
            id="title"
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
        </fieldset>
        <fieldset>
          <Label htmlFor="type">Type</Label>
          <CustomSelect
            className="w-full"
            options={Object.keys(FieldType).map((i) => ({
              label: i.replace("_", " "),
              value: i,
            }))}
            placeholder="Select a field type"
            register={register("type", { required: "Field type is required" })}
            value={typeValue}
          />
          {errors.type && (
            <p className="text-red-500 text-sm">{errors.type.message}</p>
          )}
        </fieldset>
        <fieldset>
          <Label htmlFor="image">Image</Label>
          <Input
            accept={ALLOWED_FILE_TYPES.join(",")}
            type="file"
            onChange={handleChangeCoverImage}
          />
          {/* {coverImageUploadProgress} */}
          <img className="h-[100px] w-full object-cover mt-4 rounded-md" src={coverImageUrl || PlaceholderImage} alt="" />
          {errors.coverImageId && (
            <p className="text-red-500 text-sm">
              {errors.coverImageId.message}
            </p>
          )}
        </fieldset>
      </div>
    </div>
  );
};

export default FieldSettings;