import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { UseFormRegisterReturn } from "react-hook-form";

type Option = {
  value: string;
  label: string;
  groupLabel?: string;
};

type CustomSelectProps = {
  options: Option[];
  placeholder?: string;
  className?: string;
  register?: UseFormRegisterReturn;
  value?: string; // Add value prop to make Select controlled
};

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  placeholder = "Select an option",
  className = "w-[180px]",
  register,
  value,
}) => {
  const groupedOptions = options.reduce((acc, option) => {
    const group = option.groupLabel || "Default";
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(option);
    return acc;
  }, {} as Record<string, Option[]>);

  const handleValueChange = (selectedValue: string) => {
    if (register?.onChange) {
      // Create a synthetic event for react-hook-form
      const syntheticEvent = {
        target: { value: selectedValue, name: register.name },
        type: "change",
      };
      register.onChange(syntheticEvent);
    }
  };

  return (
    <Select
      onValueChange={handleValueChange}
      value={value || undefined}
      name={register?.name}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(groupedOptions).map(([groupLabel, groupOptions]) => (
          <SelectGroup key={groupLabel}>
            {groupLabel !== "Default" && <SelectLabel>{groupLabel}</SelectLabel>}
            {groupOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CustomSelect;