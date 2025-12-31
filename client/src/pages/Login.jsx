import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Login = () => {
  // const [state, setState] = useState("login");
  // const [name, setName] = useState("");
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");

  // return (
  //   <form
  //     action=""
  //     className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px]
  // text-gray-500 rounded-lg shadow-xl border border-gray-200 bg-white">
  //     <p className="text-2xl font-medium m-auto">
  //       <span className="text-indigo-500">
  //         User {state === "login" ? "Login" : "Sign Up"}
  //       </span>
  //     </p>

  //     {state === "register" && (
  //       <div className="w-full">
  //         <p>Name</p>
  //         <input
  //           type="text"
  //           value={name}
  //           placeholder="type here"
  //           onChange={(e) => setName(e.target.value)}
  //           className="border border-gray-200 rounded w-full p-2 mt-1 outline-500"
  //           required
  //         />
  //       </div>
  //     )}

  //     <div className="">
  //       <p>Email</p>
  //       <input
  //         type="email"
  //         value={email}
  //         placeholder="type here"
  //         className="border border-gray-200 rounded  p-2 mt-1 outline-500"
  //         required
  //       />
  //     </div>

  //     <div className=""></div>
  //   </form>
  // );

  const { axios, navigate, setToken } = useAppContext();

  const [state, setState] = useState("login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    let res;
    if (state === "login") {
      res = await axios.post("/api/user/login", formData);

      if (res.data.success) {
        setToken(res.data.token);
        localStorage.setItem("SparkGPTtoken", res.data.token);
      } else {
        toast.error(res.data.message, {
          style: {
            border: "1px solid #713200",
            padding: "16px",
            color: "#713200",
          },
          iconTheme: {
            primary: "#660e60",
            secondary: "#FFFAEE",
          },
        });
      }
    } else {
      res = await axios.post("/api/user/register", formData);
      if (res.data.success) {
        setState("login");
        toast.success("User successfully Created");
      } else return toast.error(res.data.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex items-center mx-auto">
      <form
        onSubmit={handleSubmit}
        className="sm:w-100 w-full text-center bg-gray-900 border border-gray-800 
        not-dark:bg-white not-dark:border-gray-300/80 rounded-2xl px-8">
        <h1 className="text-white not-dark:text-gray-900 text-3xl mt-10 font-medium">
          {state === "login" ? "Login" : "Sign up"}
        </h1>

        <p className="text-gray-400 not-dark:text-gray-900 text-sm mt-2">
          Please sign in to continue
        </p>

        {state !== "login" && (
          <div
            className="flex items-center mt-6 w-full bg-gray-800 border border-gray-700
           not-dark:text-gray-900 h-12 rounded-full overflow-hidden pl-6 gap-2 ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="text-gray-400"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              {" "}
              <circle
                cx="12"
                cy="8"
                r="5"
              /> <path d="M20 21a8 8 0 0 0-16 0" />{" "}
            </svg>
            <input
              type="text"
              name="name"
              placeholder="Name"
              className="w-full bg-transparent text-white placeholder-gray-400 border-none outline-none "
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        )}

        <div className="flex items-center w-full mt-4 bg-gray-800 border border-gray-700 h-12 rounded-full overflow-hidden pl-6 gap-2 ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="text-gray-400"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            {" "}
            <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />{" "}
            <rect x="2" y="4" width="20" height="16" rx="2" />{" "}
          </svg>
          <input
            type="email"
            name="email"
            placeholder="Email id"
            className="w-full bg-transparent text-white placeholder-gray-400 border-none outline-none "
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className=" flex items-center mt-4 w-full bg-gray-800 border border-gray-700 h-12 rounded-full overflow-hidden pl-6 gap-2 ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="text-gray-400"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            {" "}
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />{" "}
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />{" "}
          </svg>
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full bg-transparent text-white placeholder-gray-400 border-none outline-none"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mt-4 text-left">
          <button className="text-sm text-indigo-400 hover:underline not-dark:text-gray-900">
            Forget password?
          </button>
        </div>

        <button
          type="submit"
          className="mt-2 w-full h-11 rounded-full text-white bg-purple-800 hover:bg-indigo-500 transition cursor-pointer ">
          {state === "login" ? "Login" : "Sign up"}
        </button>

        <p
          onClick={() =>
            setState((prev) => (prev === "login" ? "register" : "login"))
          }
          className="text-gray-400 text-sm mt-3 mb-11 cursor-pointer not-dark:text-gray-900">
          {state === "login"
            ? "Don't have an account?"
            : "Already have an account?"}
          <span className="text-indigo-400 hover:underline ml-1 not-dark:text-gray-900">
            click here
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
