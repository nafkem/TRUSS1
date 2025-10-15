import { type TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  label: string;
  register: any;
  errors: any;
}

const TextareaInput = ({
  name,
  label,
  register,
  errors,
  ...rest
}: TextareaProps) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block font-semibold mb-1">
        {label}
      </label>
      <textarea
        id={name}
        {...register(name)}
        {...rest}
        className="w-full border border-gray-300 rounded p-2"
      />
      {errors[name] && (
        <p className="text-red-500 text-sm">{(errors[name] as any).message}</p>
      )}
    </div>
  );
};

export default TextareaInput;
