import SocialAuth from "./SocialAuth";

export default function RegisterForm() {
  return (
    <form action="" className="w-full">
      <h1 className="text-4xl my-[-10px] font-bold">Register</h1>
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
          type="email" 
          placeholder="Email" 
          required 
          className="w-full py-[13px] pr-[50px] pl-5 bg-[#eee] rounded-lg border-none outline-none text-base text-[#333] font-medium placeholder:text-[#888] placeholder:font-normal"
        />
        <i className='bx bxs-envelope absolute right-5 top-1/2 -translate-y-1/2 text-xl text-[#888]'></i>
      </div>
      {/* <div className="input-box relative my-[30px]">
        <input 
          type="phone" 
          placeholder="Phone" 
          required 
          className="w-full py-[13px] pr-[50px] pl-5 bg-[#eee] rounded-lg border-none outline-none text-base text-[#333] font-medium placeholder:text-[#888] placeholder:font-normal"
        />
        <i className='bx bxs-phone absolute right-5 top-1/2 -translate-y-1/2 text-xl text-[#888]'></i>
      </div> */}
      <div className="input-box relative my-[30px]">
        <input 
          type="password" 
          placeholder="Password" 
          required 
          className="w-full py-[13px] pr-[50px] pl-5 bg-[#eee] rounded-lg border-none outline-none text-base text-[#333] font-medium placeholder:text-[#888] placeholder:font-normal"
        />
        <i className='bx bxs-lock-alt absolute right-5 top-1/2 -translate-y-1/2 text-xl text-[#888]'></i>
      </div>
      <div className="input-box relative my-[30px]">
        <input 
          type="password" 
          placeholder="Confirm Password" 
          required 
          className="w-full py-[13px] pr-[50px] pl-5 bg-[#eee] rounded-lg border-none outline-none text-base text-[#333] font-medium placeholder:text-[#888] placeholder:font-normal"
        />
        <i className='bx bxs-lock-alt absolute right-5 top-1/2 -translate-y-1/2 text-xl text-[#888]'></i>
      </div>
      <button 
        type="submit" 
        className="btn w-full h-12 bg-[#7494ec] rounded-lg border-none cursor-pointer text-lg text-white font-semibold mt-[10px] shadow-[0_0_10px_rgba(0,0,0,0.1)] hover:bg-[#5d7dcf] transition-colors"
      >
        Register
      </button>
      <p className="text-[14.5px] my-[15px]">or register with social platforms</p>
      <SocialAuth/>
    </form>
  )
}
