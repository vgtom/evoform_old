import { BadgeQuestionMark, EllipsisVerticalIcon } from "lucide-react";
import React, { FC } from "react";
import { useFormBuilderStore } from "../../store";
import { cn } from "../../../lib/utils";
import { Badge } from "../../../components/ui/badge";
import { Field, File } from "wasp/entities";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "../../../components/ui/button";

type BuilderQuestionFieldsProps = {
  selectedField: (Field & { coverImage?: File | null }) | undefined;
  setSelectedField: React.Dispatch<
    React.SetStateAction<(Field & { coverImage?: File | null }) | undefined>
  >;
};

interface SortableFieldProps {
  field: Field & { coverImage?: File | null };
  setSelectedField: React.Dispatch<
    React.SetStateAction<(Field & { coverImage?: File | null }) | undefined>
  >;
  selectedField: (Field & { coverImage?: File | null }) | undefined;
}

const SortableField: FC<SortableFieldProps> = ({
  field,
  setSelectedField,
  selectedField,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      onClick={() => setSelectedField(field)}
      className={cn(
        "bg-white shadow border flex items-center gap-3 rounded-md overflow-hidden hover:border-green-800 group  cursor-pointer select-none",
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
        {...listeners}
      >
        <EllipsisVerticalIcon />
      </div>
      <p className="font-bold text-3xl text-gray-600">{field.order}</p>
      <div className="p-2">
        <p>{field.title}</p>
        <Badge variant={"outline"}>{field.type}</Badge>
      </div>
    </div>
  );
};

const BuilderQuestionFields: FC<BuilderQuestionFieldsProps> = ({
  selectedField,
  setSelectedField,
}) => {
  const { storedForm, updateStoredForm } = useFormBuilderStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id && storedForm?.fields) {
      const oldIndex = storedForm.fields.findIndex(
        (field) => field.id === active.id
      );
      const newIndex = storedForm.fields.findIndex(
        (field) => field.id === over?.id
      );

      const newFields = arrayMove(storedForm.fields, oldIndex, newIndex).map(
        (field, index) => ({
          ...field,
          order: index + 1,
        })
      );

      updateStoredForm({
        ...storedForm,
        fields: newFields,
      });

      // Update selectedField if it was moved
      if (selectedField && selectedField.id === active.id) {
        setSelectedField(newFields[newIndex]);
      }
    }
  };

  const handleNewQuestionClick = () => {
    if (!storedForm) return;
    const newFieldData : Field= {
      ...storedForm.fields[storedForm.fields.length - 1],
      id: crypto.randomUUID(),
      title: "New question",
      description: "Description",
      type: 'SHORT_TEXT',
      order: storedForm.fields.length + 1,
    };
    updateStoredForm({
      ...storedForm,
      fields: [...storedForm.fields, newFieldData],
    });
    setSelectedField(newFieldData);
  };

  return (
    <div className="h-full min-h-[500px] ">
      <h1 className="flex gap-2 text-lg items-center font-semibold">
        <BadgeQuestionMark /> Questions
      </h1>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={storedForm?.fields?.map((field) => field.id) || []}
          strategy={verticalListSortingStrategy}
        >
          <div className="grid gap-2 mt-10 pb-10">
            {storedForm?.fields?.map((field) => (
              <SortableField
                key={field.id}
                field={field}
                setSelectedField={setSelectedField}
                selectedField={selectedField}
              />
            ))}
            <div>
              <Button
                className="w-full border-border shadow"
                variant={"outline"}
                onClick={handleNewQuestionClick}
              >
                + New question
              </Button>
            </div>
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default BuilderQuestionFields;
