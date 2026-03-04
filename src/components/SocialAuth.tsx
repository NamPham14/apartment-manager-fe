import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { IoIosLink } from "react-icons/io";

export default function SocialAuth() {
  return (
    <div className="social-icon flex justify-center">
            <button className="inline-flex p-[10px] border-2 border-[#ccc] rounded-lg text-2xl text-[#333] no-underline mx-2 hover:bg-[#eee] transition-colors">
               <FcGoogle className="text-4xl" />
            </button>
            <button className="inline-flex p-[10px] border-2 border-[#ccc] rounded-lg text-2xl text-[#333] no-underline mx-2 hover:bg-[#eee] transition-colors">
              <FaFacebook className="text-blue-600 text-4xl" />
            </button>
            <button  className="inline-flex p-[10px] border-2 border-[#ccc] rounded-lg text-2xl text-[#333] no-underline mx-2 hover:bg-[#eee] transition-colors">
              <IoIosLink className="text-blue-600 text-4xl" />
            </button>
          </div>
  )
}
