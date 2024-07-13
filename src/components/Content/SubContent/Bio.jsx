import UserIcon from "../../Icons/UserIcon";
import CakeIcon from "../../Icons/CakeIcon";
import Icon from "../../Icons";
import WorkIcon from "../../Icons/WorkIcon";
import GithubIcon from "../../Icons/GithubIcon";
import LinkedInIcon from "../../Icons/LinkedInIcon";

export default function Bio() {
  return <div className="h-full flex">
    <div className="w-[30%] space-y-5">
      <div className="flex items-center space-x-2">
        <Icon iconType={UserIcon}/>
        <p className="">Phan Tan Duy</p>
      </div>
      <div className="flex items-center space-x-2">
        <Icon iconType={CakeIcon}/>
        <p className="">14/03/2002</p>
      </div>
      <div className="flex items-center space-x-2">
        <Icon iconType={WorkIcon}/>
        <p className="">Student</p>
      </div>
      <div className="flex items-center space-x-2">
        <Icon iconType={GithubIcon}/>
        <a href="https://github.com/ptduy14">Github</a>
      </div>
      <div className="flex items-center space-x-2">
        <Icon iconType={LinkedInIcon}/>
        <a href="https://www.linkedin.com/in/tan-duy-phan-6087a1311/">LinkedIn</a>
      </div>
    </div>
    <div className="w-[70%] border-l-4 border-[#83796b] pl-5">
      <p className="text-justify">I'm a fourth-year student pursuing an Information Technology Engineering degree 🎓 at Can Tho University of Technology 🏛. I'm a passionate learner, always willing to learn and work across various technologies and fields 💡. I love exploring new technologies and continually improving myself to be better than yesterday ✨. My GitHub page contains several personal projects that I have completed based on the fundamental knowledge I have self-taught during my time at university. If you find them useful, you can download and refer to them for free 👨🏻‍💻. </p>
    </div>
  </div>;
}