import { useForm } from "react-hook-form";
import Input from "./../components/Input";
export default function Register() {
  const { register } = useForm();
  return (
    <div className="p-3">
      <Input label="email" name="email" kind="text" />
      <Input label="name" name="name" kind="text" />
      <Input label="password" name="password" kind="text" />
      <Input label="checkPassword" name="checkPassword" kind="text" />
    </div>
  );
}
