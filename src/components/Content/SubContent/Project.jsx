import projects from "./data.js";

export default function Project() {
  return (
    <div className="overflow-y-scroll h-full w-full space-y-6">
      {projects.map((project, index) => (
        <div
          key={index}
          className="py-2.5 px-5 border-solid border-[#404f79] border-2 rounded-xl"
        >
          <a href={project.github} className="space-y-2">
            <h4 className="text-lg font-bold">{project.name}</h4>
            <p>{project.description}</p>
            <p>Technologies: {project.technologies.split(", ").map((technology, index) => (<span key={index} className="inline-block ml-[0.1875rem] py-[0.1875rem] px-2.5 bg-tertiary-color text-sm rounded-xl">{technology}</span>))}</p>
          </a>
        </div>
      ))}
    </div>
  );
}
