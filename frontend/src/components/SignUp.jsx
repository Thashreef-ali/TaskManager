import axios from "axios";
import { Icon, Lock, Mail, User, UserPlus } from "lucide-react";
import React, { useState } from "react";

const API_URL = "https://taskmanager-backend-v5cr.onrender.com";
const INITIAL_FORM = { name: "", email: "", password: "" };
function SignUp({ onSwitchMode }) {
  const FIELDS = [
    { name: "name", type: "text", placeholder: "Full Name", icon: User },
    { name: "email", type: "email", placeholder: "Email", icon: Mail },
    { name: "password", type: "password", placeholder: "Password", icon: Lock },
  ];

  const InputWraper =
    "flex items-center border border-purple-100 rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-purple-500 transition-all duration-200";
  const BUTTONCLASSES =
    "w-full bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white text-sm font-semibold py-2.5 rounded-lg hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2";
  const MESSAGE_SUCCESS =
    "bg-green-50 text-green-600 p-3 rounded-lg text-sm mb-4 border border-green-100";
  const MESSAGE_ERROR =
    "bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-100";
  const [formData, setformData] = useState(INITIAL_FORM);
  const [loading, setLoding] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoding(true);
    setMessage({ text: "", type: "" });

    try {
      const { data } = await axios.post(`${API_URL}/api/register`, formData);
      console.log("Signup Successfull", data);
      setMessage({
        text: "Registration Successful! You can now log in",
        type: "success",
      });
      setformData(INITIAL_FORM);
    } catch (error) {
      console.error("Signup error", error);
      setMessage({
        text:
          error.response?.data?.message ||
          "An error occoured.please try again ",
        type: "error",
      });
    } finally {
      setLoding(false);
    }
  };
  return (
    <div className="max-w-md w-full bg-white shadow-lg border border-purple-100 rounded-xl p-8">
      <div className="mb-6 text-center">
        <div
          className="w-16 h-16 bg-gradient-to-br from-fuchsia-500 to-purple-600 rounded-full
        mx-auto flex items-center justify-center mb-4 "
        >
          <UserPlus className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 ">Create Account</h2>
        <p className="text-gray-500 text-sm mt-1 ">
          Join TaskManger to manage your tasks
        </p>
      </div>
      {message.text && (
        <div
          className={
            message.type === "success" ? MESSAGE_SUCCESS : MESSAGE_ERROR
          }
        >
          {message.text}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        {FIELDS.map(({ name, type, placeholder, icon: Icon }) => (
          <div key={name} className={InputWraper}>
            <Icon className="w-5 h-5 text-purple-500 mr-2" />
            <input
              type={type}
              placeholder={placeholder}
              value={formData[name]}
              onChange={(e) =>
                setformData({ ...formData, [name]: e.target.value })
              }
              className="w-full focus:outline-none text-sm text-gray-700"
              required
            />
          </div>
        ))}

        <button type="submit" className={BUTTONCLASSES} disabled={loading}>
          {loading ? (
            "Signing Up..."
          ) : (
            <>
              <UserPlus className="w-4 h-4 " />
              Sign Up
            </>
          )}
        </button>
      </form>
      <p className="text-center text-sm text-gray-600 mt-6">
        Already have an account?{" "}
        <button
          onClick={onSwitchMode}
          className="text-purple-600 hover:text-purple-700  hover:underline 
        font-medium transition-colors "
        >
          Login
        </button>
      </p>
    </div>
  );
}

export default SignUp;
