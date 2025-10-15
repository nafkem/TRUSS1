import { type InputHTMLAttributes } from "react";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  register: any;
  errors: any;
}

const TextInput = ({
  name,
  label,
  register,
  errors,
  ...rest
}: TextInputProps) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block font-semibold mb-1">
        {label}
      </label>
      <input
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

export default TextInput;
