import { useState } from "react";
import isEmty from "../../../utils/isEmty";
import EmailIcon from "../../Icons/EmailIcon";
import Icon from "../../Icons";
import PhoneIcon from "../../Icons/PhoneIcon";
import GithubIcon from "../../Icons/GithubIcon";

export default function Contact() {
  const [input, setInput] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [error, setError] = useState({
    name: false,
    email: false,
    message: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.name === "" || input.email === "" || input.message === "") {
      setError({
        name: isEmty(input.name),
        email: isEmty(input.email),
        message: isEmty(input.message),
      });

      return;
    }

    setInput({ name: "", email: "", message: "" });
  };

  return (
    <div className="flex">
      <div className="w-1/2">
        <form onSubmit={handleSubmit} className="space-y-1">
          <div>
            <input
              type="text"
              placeholder="Your name"
              className={`w-3/4 p-3 border-solid border-transparent border-2 outline-none text-sm bg-[#121622] ${
                error.email && "border-[#9d0808] border-[0.0625rem]"
              }`}
              value={input.name}
              onChange={(e) =>
                setInput((prev) => ({ ...prev, name: e.target.value.trim() }))
              }
            />
            <br />
            <span className="text-text-color-error text-sm inline-block h-3.5">
              {error.name && "This feild cannot empty"}
            </span>
          </div>
          <div>
            <input
              type="text"
              placeholder="Your Email"
              className={`w-3/4 p-3 border-solid border-transparent border-2 outline-none text-sm bg-[#121622] ${
                error.email && "border-[#9d0808] border-[0.0625rem]"
              }`}
              value={input.email}
              onChange={(e) =>
                setInput((prev) => ({ ...prev, email: e.target.value.trim() }))
              }
            />
            <br />
            <span className="text-text-color-error text-sm inline-block h-3.5">
              {error.email && "This feild cannot empty"}
            </span>
          </div>
          <div>
            <textarea
              className={`resize-none text-sm bg-[#121622] p-2.5 outline-none ${
                error.message || "mb-2"
              }`}
              cols="49"
              rows="4"
              placeholder="Your message"
              value={input.message}
              onChange={(e) =>
                setInput((prev) => ({
                  ...prev,
                  message: e.target.value.trim(),
                }))
              }
            ></textarea>
            <span className="text-text-color-error text-sm inline-block h-3.5">
              {error.message && "This feild cannot empty"}
            </span>
          </div>
          <button
            type="submit"
            className="bg-tertiary-color px-12 py-2 rounded-md hover:bg-[#2d3f6a] hover:text-[#d6d3cd] transition-all duration-700"
          >
            Send
          </button>
        </form>
      </div>
      <div className="w-1/2 pl-10 space-y-3">
      <div className="flex items-center text-lg gap-x-3">
        <Icon iconType={EmailIcon} roundedType="xl"/>
        <p>phantanduy14@gmail.com</p>
      </div>
      <div className="flex items-center text-lg gap-x-3">
        <Icon iconType={PhoneIcon} roundedType="xl"/>
        <p>0886514681</p>
      </div>
      <div className="flex items-center text-lg gap-x-3">
        <Icon iconType={GithubIcon} roundedType="xl"/>
        <p>https://github.com/ptduy14 </p>
      </div>
      </div>
    </div>
  );
}
