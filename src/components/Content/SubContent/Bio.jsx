import UserIcon from "../../Icons/UserIcon";
import CakeIcon from "../../Icons/CakeIcon";
import Icon from "../../Icons";
import WorkIcon from "../../Icons/WorkIcon";
import GithubIcon from "../../Icons/GithubIcon";
import LinkedInIcon from "../../Icons/LinkedInIcon";

export default function Bio() {
  return (
    <div className="h-full flex">
      <div className="w-[30%] space-y-5 hidden lg:block">
        <div className="flex items-center space-x-2">
          <Icon iconType={UserIcon} />
          <p className="">Phan Tan Duy</p>
        </div>
        <div className="flex items-center space-x-2">
          <Icon iconType={CakeIcon} />
          <p className="">14/03/2002</p>
        </div>
        <div className="flex items-center space-x-2">
          <Icon iconType={WorkIcon} />
          <p className="">Student</p>
        </div>
        <div className="flex items-center space-x-2">
          <Icon iconType={GithubIcon} />
          <a href="https://github.com/ptduy14">Github</a>
        </div>
        <div className="flex items-center space-x-2">
          <Icon iconType={LinkedInIcon} />
          <a href="https://www.linkedin.com/in/tan-duy-phan-6087a1311/">
            LinkedIn
          </a>
        </div>
      </div>
      <div className="relative w-full lg:w-[70%] lg:border-l-4 border-[#83796b] lg:pl-5 block lg:block space-y-2">
        <p className="text-justify">
          I'm a fourth-year student pursuing an Information Technology
          Engineering degree 🎓 at Can Tho University of Technology 🏛. I'm a
          passionate learner, always willing to learn and work across various
          technologies and fields 💡. I love exploring new technologies and
          continually improving myself to be better than yesterday ✨.{" "}
        </p>
        <p className="text-justify hidden md:block lg:block">
            My GitHub page contains several personal projects that I have
            completed based on the fundamental knowledge I have self-taught
            during my time at university. If you find them useful, you can
            download and refer to them for free 👨🏻‍💻.{" "}
          </p>

          <button className=" lg:hidden absolute bg-tertiary-color py-2 px-5 rounded-lg bottom-8 left-1/2 translate-x-[-50%]">
          More Info
        </button>
      </div>
    </div>
  );
}
