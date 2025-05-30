import axios from "axios";
import { Eye, EyeOff, Lock, LogIn, Mail } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const INITIAL_FORM = { email: "", password: "" };

function Login({ onSubmit, onSwitchMode }) {
  const [showPassword, setshowPassword] = useState(false);
  const [rememberMe, setrememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setformData] = useState(INITIAL_FORM);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rememberMe) {
      toast.error('You must enable "Remember Me" to login.');
      return;
    }
    setLoading(true);

    try {
      const { data } = await axios.post(`${url}/api/login`, formData);
      if (!data.token) throw new Error(data.message || "Login failed");
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.id);
      setformData(INITIAL_FORM);
      onSubmit?.({ token: data.token, userId: data.user.id, ...data.user });
      toast.success("Login successfull Redirecting...");
      setTimeout(() => navigate("/"), 1000);
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchmode = () => {
    toast.dismiss();
    onSwitchMode?.();
  };
  const navigate = useNavigate();
  const url = "http://localhost:4000";
  const fields = [
    { name: "email", type: "email", placeholder: "Email", icon: Mail },
    {
      name: "password",
      type: "password",
      placeholder: "Password",
      icon: Lock,
      isPassword: true,
    },
  ];
  const Inputwrapper =
    "flex items-center border border-purple-100 rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-purple-500 transition-all duration-200";
  const BUTTONCLASSES =
    "w-full bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white text-sm font-semibold py-2.5 rounded-lg hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2";
useEffect(() => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  if (token) {
    (async () => {
      try {
        const { data } = await axios.get(`${url}/api/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Me response:", data);

        if (data.success) {
          onSubmit?.({ token, userId, ...data.user });
          toast.success("Session restored. Redirecting...");
          navigate("/");
        } else {
          localStorage.clear();
        }
      } catch (err) {
        console.error("Error restoring session:", err);
        localStorage.clear();
      }
    })();
  }
}, [navigate, onSubmit]);
  return (
    <div className="max-w-md bg-white w-full shadow-lg border border-purple-100 rounded-xl p-8">
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />

      <div className="mb-6 text-center">
        <div
          className="w-16 h-16 bg-gradient-to-br from-fuchsia-500 to-purple-500 rounded-full
         mx-auto flex items-center justify-center mb-4"
        >
          <LogIn className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 ">Welcome Back</h2>
        <p className="text-gray-500 text-sm mt-1 ">
          Sign in to continue TaskManager
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map(({ name, type, placeholder, icon: Icon, isPassword }) => (
          <div key={name} className={Inputwrapper}>
            <Icon className="text-purple-500 w-5 h-5 mr-2" />
            <input
              type={showPassword && isPassword ? "text" : type}
              placeholder={placeholder}
              value={formData[name]}
              onChange={(e) =>
                setformData({ ...formData, [name]: e.target.value })
              }
              className="w-full focus:outline-none text-sm text-gray-700"
              required
            />
            {isPassword && (
              <button
                type="button"
                onClick={() => setshowPassword((prev) => !prev)}
                className="ml-2 text-gray-500 hover:text-purple-500 transition-colors "
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            )}
          </div>
        ))}

        <div className="flex items-center">
          <input
            type="checkbox"
            id="remeberMe"
            checked={rememberMe}
            onChange={() => setrememberMe(!rememberMe)}
            className="h-4 w-4 text-purple-500 focus:ring-purple-400 border-gray-300 rounded"
            required
          />
          <label
            htmlFor="rememberMe"
            className="ml-2 block text-sm text-gray-700"
          >
            Remember Me
          </label>
        </div>
        <button className={BUTTONCLASSES} disabled={loading} type="submit">
          {loading ? (
            "Logging in..."
          ) : (
            <>
              <LogIn className="w-4 h-4 " />
              Login
            </>
          )}
        </button>
      </form>
      <p className="text-sm text-center text-gray-600 mt-6">
        Don't have an acoount?{" "}
        <button
          type="button"
          className="text-purple-600 hover:text-purple-700 hover:underline
         font-medium transition-colors "
          onClick={handleSwitchmode}
        >
          Sign Up
        </button>
      </p>
    </div>
  );
}

export default Login;
