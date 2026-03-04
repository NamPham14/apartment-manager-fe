import { useState } from 'react';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import ToggleBox from '../components/ToggleBox';

export default function AuthPage() {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="bg-gradient-to-r from-[#e2e2ee] to-[#c9d6ff] min-h-screen flex justify-center items-center font-['Cousine',_monospace]">
      <div className={`container relative w-[888px] h-[620px] bg-white rounded-[30px] shadow-[0_0_30px_rgba(0,0,0,0.2)] m-5 overflow-hidden ${isActive ? 'active' : ''}`}>
        <LoginPage />
        <RegisterPage />
        <ToggleBox 
          onRegister={() => setIsActive(true)} 
          onLogin={() => setIsActive(false)} 
        />
      </div>
    </div>
  );
}
