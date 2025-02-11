import UserIcon from "../../Icons/UserIcon";
import CakeIcon from "../../Icons/CakeIcon";
import Icon from "../../Icons";
import WorkIcon from "../../Icons/WorkIcon";
import GithubIcon from "../../Icons/GithubIcon";
import LinkedInIcon from "../../Icons/LinkedInIcon";
import resume from "../../../assets/resume/resume.pdf";

export default function Bio() {
  const onOpenResume = () => {
    window.open(resume);
  };

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
          <p className="">Software Engineer</p>
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
        <div className="text-justify">
          I am a web developer with a solid foundation in both front-end and
          back-end technologies. I specialize in{" "}
          <b>React.js, Next.js, Tailwind CSS</b> for building dynamic UIs and
          have experience with <b>NestJS, Laravel, MySQL, and MSSQL</b> for
          backend development, including <b>RESTful API</b> design.
        </div>
        <div className="text-justify hidden md:block lg:block">
          Beyond web development, I have hands-on experience with blockchain,
          having built a private student grade management system projects using{" "}
          <b>Solidity, Geth, and Ethers.js</b>. I also work with{" "}
          <b>Docker, Git, and Firebase</b> for authentication and real-time data
          management.
        </div>
        <div className="text-justify hidden md:block lg:block">
          I am a passionate learner, always eager to explore new technologies
          and adapt to industry demands. My GitHub showcases various personal
          projects applying self-taught knowledge—feel free to explore them! 🚀
        </div>
        <button
          onClick={onOpenResume}
          className=" lg:hidden absolute bg-tertiary-color py-2 px-5 rounded-lg bottom-8 left-1/2 translate-x-[-50%]"
        >
          My resume
        </button>
      </div>
    </div>
  );
}
