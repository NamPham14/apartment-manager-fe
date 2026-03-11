/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import SocialAuth from "../SocialAuth";
import { registerSchema, type RegisterFormData } from "../../schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegisterMutation } from "../../store/api/baseApi";
import toast from "react-hot-toast";
import Input from "../ui/input/Input";
import { Mail, Lock, User } from "lucide-react";


export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema)
  });
  
  const [registerApi, { isLoading }] = useRegisterMutation();

  const onSubmit = async (formData: RegisterFormData) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...registerData } = formData;

    try {
      const result = await registerApi(registerData).unwrap();
      toast.success(result.message || "Registration successful");
      // Cần một cơ chế để switch sang tab login thay vì chỉ navigate
      // Nhưng hiện tại cứ navigate cho đúng logic flow
      window.location.reload(); // Hoặc logic để reset form/switch tab
    }
    catch (error: any) {
      console.log(error);
      toast.error(error.data?.message || "Registration failed!");
    }
  }

  return (
    <form className="w-full" onSubmit={handleSubmit(onSubmit)} noValidate>
      <h1 className="text-4xl my-[-10px] font-bold text-[#333]">Register</h1>

      <Input
        {...register("username")}
        type="text"
        placeholder="Username"
        autoComplete="username"
        icon={<User size={20} />}
        error={errors.username?.message}
        required
      />

      <Input
        {...register("email")}
        type="email"
        placeholder="Email"
        autoComplete="email"
        icon={<Mail size={20} />}
        error={errors.email?.message}
        required
      />

      <Input
        {...register("password")}
        type="password"
        placeholder="Password"
        autoComplete="new-password"
        icon={<Lock size={20} />}
        error={errors.password?.message}
        required
      />

      <Input
        {...register("confirmPassword")}
        type="password"
        placeholder="Confirm Password"
        autoComplete="new-password"
        icon={<Lock size={20} />}
        error={errors.confirmPassword?.message}
        required
      />

      <button
        disabled={isLoading}
        type="submit"
        className="btn w-full h-12 bg-[#7494ec] rounded-lg border-none cursor-pointer text-lg text-white font-semibold mt-[10px] shadow-[0_0_10px_rgba(0,0,0,0.1)] hover:bg-[#5d7dcf] transition-all active:scale-[0.98]"
      >
        {isLoading ? 'Creating Account...' : "Register"}
      </button>
      <p className="text-[14.5px] my-[15px] text-[#333]">or register with social platforms</p>
      <SocialAuth />
    </form>
  )
}