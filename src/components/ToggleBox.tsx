interface ToggleBoxProps {
  onRegister: () => void;
  onLogin: () => void;
}

export default function ToggleBox({ onRegister, onLogin }: ToggleBoxProps) {
  return (
    <div className="toggle-box absolute w-full h-full">
      <div className="toggle-panel toggle-left absolute w-1/2 h-full text-white flex flex-col justify-center items-center z-[2] left-0">
        <h1 className="text-4xl font-bold">Hello, Welcome</h1>
        <p className="my-5 mb-10 text-[14.5px]">Don't have an account?</p>
        <button 
          className="btn register-btn w-40 h-12 bg-transparent border-2 border-white shadow-none rounded-lg cursor-pointer text-lg text-white font-semibold hover:bg-white hover:text-[#7494ec] transition-all" 
          onClick={onRegister}
        >
          Register
        </button>
      </div>
      <div className="toggle-panel toggle-right absolute w-1/2 h-full text-white flex flex-col justify-center items-center z-[2] -right-1/2">
        <h1 className="text-4xl font-bold">Welcome Back!</h1>
        <p className="my-5 mb-10 text-[14.5px]">Already have an account?</p>
        <button 
          className="btn login-btn w-40 h-12 bg-transparent border-2 border-white shadow-none rounded-lg cursor-pointer text-lg text-white font-semibold hover:bg-white hover:text-[#7494ec] transition-all" 
          onClick={onLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
}
