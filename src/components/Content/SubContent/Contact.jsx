import { useState, useRef, useContext } from "react";
import isEmty from "../../../utils/isEmty";
import EmailIcon from "../../Icons/EmailIcon";
import Icon from "../../Icons";
import PhoneIcon from "../../Icons/PhoneIcon";
import GithubIcon from "../../Icons/GithubIcon";
import emailjs from "@emailjs/browser";
import { ToastContext } from "../../../context/ToastContext";
import resume from "../../../assets/resume/resume.pdf";

export default function Contact() {
  const { handleShowingToast } = useContext(ToastContext);
  const [isSending, setIsSending] = useState(false);
  const [input, setInput] = useState({
    user_name: "",
    user_email: "",
    message: "",
  });
  const [error, setError] = useState({
    user_name: false,
    user_email: false,
    message: false,
  });
  const form = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      input.user_name === "" ||
      input.user_email === "" ||
      input.message === ""
    ) {
      setError({
        user_name: isEmty(input.user_name),
        user_email: isEmty(input.user_email),
        message: isEmty(input.message),
      });

      return;
    }

    setIsSending(true);
    emailjs
      .sendForm(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        form.current,
        {
          publicKey: process.env.REACT_APP_EMAILJS_PUBLIC_KEY,
        }
      )
      .then(
        () => {
          handleShowingToast(
            "Thank you for leaving a message, I will reply to you as soon as possible"
          );
          setIsSending(false);
          setInput({ user_name: "", user_email: "", message: "" });
        },
        (error) => {
          setIsSending(false);
          handleShowingToast(error.text);
        }
      );
  };

  const handleOnchange = (value, inputName) => {
    setInput((prev) => ({
      ...prev,
      [inputName]: value,
    }));

    setError((prev) => ({
      ...prev,
      [inputName]: isEmty(value),
    }));
  };

  const onOpenResume = () => {
    window.open(resume);
  };

  return (
    <div className="flex">
      <div className="w-full lg:w-1/2">
        <form ref={form} onSubmit={handleSubmit} className="space-y-1">
          <div>
            <input
              type="text"
              name="user_name"
              placeholder="Your name"
              className={`w-full lg:w-3/4 p-3 border-solid border-transparent border-2 outline-none text-sm bg-[#121622] ${
                error.user_name && "border-[#9d0808] border-[0.0625rem]"
              }`}
              value={input.user_name}
              onChange={(e) =>
                handleOnchange(e.target.value.trim(), e.target.name)
              }
            />
            <br />
            <span className="text-text-color-error text-sm inline-block h-3.5">
              {error.user_name && "This feild cannot empty"}
            </span>
          </div>
          <div>
            <input
              type="text"
              name="user_email"
              placeholder="Your Email"
              className={`w-full lg:w-3/4 p-3 border-solid border-transparent border-2 outline-none text-sm bg-[#121622] ${
                error.user_email && "border-[#9d0808] border-[0.0625rem]"
              }`}
              value={input.user_email}
              onChange={(e) =>
                handleOnchange(e.target.value.trim(), e.target.name)
              }
            />
            <br />
            <span className="text-text-color-error text-sm inline-block h-3.5">
              {error.user_email && "This feild cannot empty"}
            </span>
          </div>
          <div>
            <textarea
              className={`w-full lg:w-3/4 resize-none text-sm bg-[#121622] p-2.5 outline-none border-solid border-transparent border-2 ${
                error.message ? "border-[#9d0808] border-[0.0625rem]" : ""
              } ${error.message || "mb-2"}`}
              name="message"
              rows="4"
              placeholder="Your message"
              value={input.message}
              onChange={(e) =>
                handleOnchange(e.target.value.trim(), e.target.name)
              }
            ></textarea>
            <br />
            <span className="text-text-color-error text-sm inline-block h-3.5 break-words">
              {error.message && "This feild cannot empty"}
            </span>
          </div>
          <button
            type="submit"
            disabled={isSending}
            className={`bg-tertiary-color px-12 py-2 rounded-md ${
              isSending || "hover:bg-[#2d3f6a] hover:text-[#d6d3cd]"
            } transition-all duration-700`}
          >
            {isSending ? (
              <svg
                aria-hidden="true"
                className="inline w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
            ) : (
              "Send"
            )}
          </button>
        </form>
      </div>
      <div className="hidden lg:block w-1/2 pl-10 space-y-3">
        <div className="flex items-center text-lg gap-x-3">
          <Icon iconType={EmailIcon} roundedType="xl" />
          <p>phantanduy14@gmail.com</p>
        </div>
        <div className="flex items-center text-lg gap-x-3">
          <Icon iconType={PhoneIcon} roundedType="xl" />
          <p>0886514681</p>
        </div>
        <div className="flex items-center text-lg gap-x-3">
          <Icon iconType={GithubIcon} roundedType="xl" />
          <p>https://github.com/ptduy14 </p>
        </div>
        <div className="flex items-center text-lg gap-x-3">
          <button
            onClick={onOpenResume}
            className="mt-7 bg-tertiary-color px-8 py-2 rounded-md hover:bg-[#2d3f6a] hover:text-[#d6d3cd] transition-all duration-700"
          >
            Download My CV
          </button>
        </div>
      </div>
    </div>
  );
}
