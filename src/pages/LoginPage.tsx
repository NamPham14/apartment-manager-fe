import LoginForm from '../components/LoginForm';

export default function LoginPage() {
  return (
    <div className="form-box login absolute right-0 w-1/2 h-full bg-white flex items-center text-[#333] text-center p-10 z-[1]">
      <LoginForm />
    </div>
  );
}
