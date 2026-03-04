import RegisterForm from '../components/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="form-box register absolute right-0 w-1/2 h-full bg-white flex items-center text-[#333] text-center p-10 z-[1] invisible">
      <RegisterForm />
    </div>
  );
}
