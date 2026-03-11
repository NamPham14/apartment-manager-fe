import { Mail, Lock } from "lucide-react";
import SocialAuth from "../SocialAuth";
import Input from "../ui/input/Input";
import { useForm } from "react-hook-form";
import { loginSchema, type LoginFormData } from "../../schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoginMutation } from "../../store/api/baseApi";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAuth } from "../../store/authSlice";
import toast from "react-hot-toast";


export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const [login ,{isLoading}] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async(formData: LoginFormData) =>{
    try{
      const result = await login(formData).unwrap();

      dispatch(setAuth({
        accessToken: result.data.accessToken,
        refreshToken: result.data.refreshToken,
      })
    );
    navigate("/");

    toast.success(result.message || "Login successful")
    
    }catch(error) {
     console.log(error);
     toast.error("Invalid credentials or account not activated")
    }
  };

  return (
    <form className="w-full" onSubmit={handleSubmit(onSubmit)} noValidate>
      <h1 className="text-4xl my-[-10px] font-bold text-[#333]">Login</h1>
      
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
        autoComplete="current-password"
        icon={<Lock size={20} />}
        error={errors.password?.message}
        required
      />

      <div className="forgot-link my-[-15px] mb-[15px] text-right">
        <a href="#" className="text-[14.5px] text-[#333] no-underline hover:underline">
          Forgot password?
        </a>
      </div>

      <button
        disabled={isLoading}
        type="submit"
        className="btn w-full h-12 bg-[#7494ec] rounded-lg border-none cursor-pointer text-lg text-white font-semibold mt-[10px] shadow-[0_0_10px_rgba(0,0,0,0.1)] hover:bg-[#5d7dcf] transition-all active:scale-[0.98]"
      >
         {isLoading ? "Signing in..." : "Login"}
      </button>
      
      <p className="text-[14.5px] my-[15px] text-[#333]">or login with social platforms</p>
      <SocialAuth />
    </form>
  );
}