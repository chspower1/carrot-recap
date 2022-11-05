import { UseFormRegisterReturn } from "react-hook-form";

interface TextAreaProps {
  label?: string;
  name?: string;
  register: UseFormRegisterReturn;
  errorMessage?: string;
  [key: string]: any;
}

export default function TextArea({ label, name, register, errorMessage, ...rest }: TextAreaProps) {
  return (
    <div className="relative">
      {label ? (
        <label htmlFor={name} className="mb-1 block text-sm font-medium text-gray-700">
          {label}
        </label>
      ) : null}
      <textarea
        id={name}
        className="mt-1 shadow-sm w-full focus:ring-orange-500 rounded-md border-gray-300 focus:border-orange-500 "
        rows={4}
        {...register}
        {...rest}
      />
      <span className="absolute text-sm -bottom-3 right-0 text-red-400">{errorMessage}</span>
    </div>
  );
}
