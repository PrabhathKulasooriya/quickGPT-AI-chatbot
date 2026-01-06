import React, { useState } from "react";
import { useAppContext } from "../context/AppContext.jsx";
import toast from "react-hot-toast";

const Login = () => {
  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // 1. Add loading state
  const [isLoading, setIsLoading] = useState(false);

  const { axios, setToken } = useAppContext();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 2. Start loading
    setIsLoading(true);

    const url = state === "login" ? "/api/user/login" : "/api/user/register";

    try {
      const { data } = await axios.post(url, { name, email, password });
      if (data.success) {
        setToken(data.token);
        localStorage.setItem("token", data.token);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      // 3. Stop loading regardless of success or failure
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="sm:w-[350px] w-full text-center border border-purple-300/90 rounded-2xl px-8 bg-slate-50 dark:bg-[#583c79]/30 py-12"
    >
      <h1 className="text-purple-700 text-3xl mt-10 font-medium dark:text-white">
        {state === "login" ? "Login" : "Sign up"}
      </h1>
      <p className="text-gray-500 text-sm mt-2">Please sign in to continue</p>

      {state !== "login" && (
        <div className="flex items-center mt-6 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2 dark:bg-gray-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#6B7280"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-user-round-icon lucide-user-round"
          >
            <circle cx="12" cy="8" r="5" />
            <path d="M20 21a8 8 0 0 0-16 0" />
          </svg>
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="border-none outline-none ring-0 text-gray-900"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
      )}

      <div className="flex items-center w-full mt-4 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2 dark:bg-gray-300">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#6B7280"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-mail-icon lucide-mail"
        >
          <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
          <rect x="2" y="4" width="20" height="16" rx="2" />
        </svg>
        <input
          type="email"
          name="email"
          placeholder="Email id"
          className="border-none outline-none ring-0 text-gray-900"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="flex items-center mt-4 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2 dark:bg-gray-300">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#6B7280"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-lock-icon lucide-lock"
        >
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="border-none outline-none ring-0 text-gray-900"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <div className="mt-4 text-left text-indigo-500">
        <button className="text-sm" type="reset">
          Forget password?
        </button>
      </div>

      {/* 4. Update Button Logic */}
      <button
        type="submit"
        disabled={isLoading} // Disable button while loading
        className={`mt-2 w-full h-11 rounded-full text-white bg-gradient-to-r from-[#A456F7] to-[#3D81F6] hover:opacity-90 transition-opacity flex items-center justify-center ${
          isLoading ? "opacity-70 cursor-not-allowed" : ""
        }`}
      >
        {isLoading ? (
          // Loading Spinner
          <div className="flex items-center gap-2">
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>Please wait...</span>
          </div>
        ) : state === "login" ? (
          "Login"
        ) : (
          "Sign up"
        )}
      </button>

      <p
        // Prevent switching modes while loading
        onClick={() =>
          !isLoading &&
          setState((prev) => (prev === "login" ? "register" : "login"))
        }
        className={`text-gray-500 text-sm mt-3 mb-11 ${
          isLoading ? "cursor-not-allowed opacity-50" : "cursor-pointer"
        }`}
      >
        {state === "login"
          ? "Don't have an account?"
          : "Already have an account?"}{" "}
        <span className="text-indigo-500 hover:underline">click here</span>
      </p>
    </form>
  );
};

export default Login;
