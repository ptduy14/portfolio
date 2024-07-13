import Navbar from "./Navbar";
import Bio from "./SubContent/Bio";

export default function Content() {
  return (
    <div className="mt-12">
      <Navbar />
      <div className="p-5 h-[22.563rem] bg-secondary-color">
        <Bio />
      </div>
    </div>
  );
}
