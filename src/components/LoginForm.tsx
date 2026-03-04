import SocialAuth from "./SocialAuth";


export default function LoginForm() {
  return (
   <form action="" className="w-full">
      <h1 className="text-4xl my-[-10px] font-bold">Login</h1>
      <div className="input-box relative my-[30px]">
        <input 
          type="text" 
          placeholder="Username" 
          required 
          className="w-full py-[13px] pr-[50px] pl-5 bg-[#eee] rounded-lg border-none outline-none text-base text-[#333] font-medium placeholder:text-[#888] placeholder:font-normal"
        />
        <i className='bx bxs-user absolute right-5 top-1/2 -translate-y-1/2 text-xl text-[#888]'></i>
      </div>
      <div className="input-box relative my-[30px]">
        <input 
          type="password" 
          placeholder="Password" 
          required 
          className="w-full py-[13px] pr-[50px] pl-5 bg-[#eee] rounded-lg border-none outline-none text-base text-[#333] font-medium placeholder:text-[#888] placeholder:font-normal"
        />
        <i className='bx bxs-lock-alt absolute right-5 top-1/2 -translate-y-1/2 text-xl text-[#888]'></i>
      </div>
      <div className="forgot-link my-[-15px] mb-[15px]">
        <a href="" className="text-[14.5px] text-[#333] no-underline">Forgot password?</a>
      </div>
      <button 
        type="submit" 
        className="btn w-full h-12 bg-[#7494ec] rounded-lg border-none cursor-pointer text-lg text-white font-semibold mt-[10px] shadow-[0_0_10px_rgba(0,0,0,0.1)] hover:bg-[#5d7dcf] transition-colors"
      >
        Login
      </button>
      <p className="text-[14.5px] my-[15px]">or login with social platforms</p>
      <SocialAuth/>
    </form>
  )
}
