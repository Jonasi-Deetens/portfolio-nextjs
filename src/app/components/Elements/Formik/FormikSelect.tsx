import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { useField, useFormikContext } from "formik";
import { ChevronDownIcon } from "lucide-react";
import { FC } from "react";

interface SelectOption {
  label: string;
  value: string | number;
}

interface FormikSelectProps {
  name: string;
  options: SelectOption[];
  label?: string;
}

export const FormikSelect: FC<FormikSelectProps> = ({
  name,
  options,
  label,
}) => {
  const { setFieldValue } = useFormikContext<unknown>();
  const [field, meta] = useField(name);
  const selected = options.find((opt) => opt.value == field.value);
  return (
    <div className="space-y-1">
      {label && <label className="block font-semibold mb-1">{label}</label>}

      <Listbox
        value={selected?.value ?? options[0]?.value ?? ""}
        onChange={(val) => setFieldValue(name, val)}
      >
        <div className="relative">
          <ListboxButton
            as="button"
            className="w-full bg-white/10 dark:bg-white/10 text-white border border-white/20 px-4 py-2 rounded-md text-left flex justify-between items-center"
          >
            <span>{selected?.label || "Select..."}</span>
            <ChevronDownIcon className="w-4 h-4 opacity-60" />
          </ListboxButton>

          <ListboxOptions className="absolute mt-1 z-50 w-full bg-black/90 text-white border border-white/20 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {options.map((opt) => (
              <ListboxOption
                key={opt.value}
                value={opt.value}
                className={() =>
                  `px-4 py-2 cursor-pointer flex justify-between items-center hover:bg-gray-500 ${selected?.value === opt.value && "bg-gray-500"}`
                }
              >
                <>
                  <span>{opt.label}</span>
                </>
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      </Listbox>

      {meta.touched && meta.error && (
        <div className="text-red-400 text-sm">{meta.error}</div>
      )}
    </div>
  );
};
