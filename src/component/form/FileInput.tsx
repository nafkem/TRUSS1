import { type InputHTMLAttributes } from "react";

interface FileInputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  register: any;
  errors: any;
  //   onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; // Add proper typing
}
const FileInput = ({
  name,
  label,
  register,
  errors,
  ...rest
}: FileInputProps) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block font-semibold mb-1">
        {label}
      </label>
      <input
        type="file"
        id={name}
        {...register(name)}
        accept="image/*"
        multiple   // <-- this is key
        {...rest}
        className="w-full"
      />
      {errors[name] && (
        <p className="text-red-500 text-sm">{(errors[name] as any).message}</p>
      )}
    </div>
  );
};

export default FileInput;
