import ArrowUpRightIcon from "../Icons/ArrowUpRightIcon";

export default function Footer() {
  return (
    <footer className="inline-block pt-14">
      <a className="flex items-center gap-x-1.5 opacity-40 hover:opacity-80 duration-100 ease-in-out" href="https://github.com/ptduy14/portfolio">
        Designed & Built by @ptduy14
       <ArrowUpRightIcon />
      </a>
    </footer>
  );
}
