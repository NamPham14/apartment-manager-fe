import { useState } from 'react';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import "../App.css"; 

export default function AuthPage() {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="bg-gradient-to-r from-[#e2e2ee] to-[#c9d6ff] min-h-screen flex justify-center items-center font-['Open_Sans',_sans-serif]">
    
      <div className={`auth-page-wrapper ${isActive ? 'auth-active' : ''}`}>
        
        {/* Khối Form Login */}
        <div className="auth-form-box auth-login">
          <LoginForm />
        </div>

        {/* Khối Form Register */}
        <div className="auth-form-box auth-register">
          <RegisterForm />
        </div>

        {/* Khối Toggle trượt */}
        <div className="auth-toggle-box">
          <div className="auth-toggle-panel auth-left">
            <h1 className="text-4xl font-bold">Hello, Welcome</h1>
            <p className="my-5 mb-10 text-[14.5px]">Don't have an account?</p>
            <button 
              className="btn w-40 h-12 bg-transparent border-2 border-white rounded-lg cursor-pointer text-lg text-white font-semibold hover:bg-white hover:text-[#7494ec] transition-all" 
              onClick={() => setIsActive(true)}
            >
              Register
            </button>
          </div>
          <div className="auth-toggle-panel auth-right">
            <h1 className="text-4xl font-bold">Welcome Back!</h1>
            <p className="my-5 mb-10 text-[14.5px]">Already have an account?</p>
            <button 
              className="btn w-40 h-12 bg-transparent border-2 border-white rounded-lg cursor-pointer text-lg text-white font-semibold hover:bg-white hover:text-[#7494ec] transition-all" 
              onClick={() => setIsActive(false)}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}