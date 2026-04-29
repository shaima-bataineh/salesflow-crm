import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("Email is required");
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return false;
    } else {
      setEmailError("");
      return true;
    }
  };

       const validatePassword = (password: string) => {
    if (!password) {
          setPasswordError("Password is required");
      return false;
    }       else if (password.length < 8) {
          setPasswordError("Password must be at least 8 characters");
      return false;
    } else {
      setPasswordError("");
       return true;
    }
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) return;

    setLoading(true);

    try {
      await axiosInstance.post(
        "/auth/login",
        { email, password },
        { withCredentials: true }
      );

      const res = await axiosInstance.get("/auth/me", {
        withCredentials: true,
      });

      const user = res.data;

      if (user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/sales", { replace: true });
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center 
    bg-gradient-to-br from-emerald-600 via-teal-600 to-green-600 px-6">

      {/* Card */}
      <div className="w-full max-w-md bg-white/90 backdrop-blur-xl 
      rounded-2xl shadow-2xl p-10 border border-white/40">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-xl 
          bg-gradient-to-r from-emerald-500 to-teal-500 
          flex items-center justify-center text-white font-bold text-xl shadow-lg">
            SF
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800">
          Welcome Back
        </h2>

        <p className="text-center text-gray-500 mt-2 mb-8">
          login to your account
        </p>

        <form onSubmit={handleLogin} className="space-y-5">

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                validateEmail(e.target.value);
              }}
              className={`w-full px-4 py-3 rounded-lg border 
              focus:outline-none focus:ring-2 focus:ring-emerald-500 transition
              ${emailError ? "border-red-400" : "border-gray-300"}`}
            />

            {emailError && (
              <p className="text-red-500 text-sm mt-1">{emailError}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                validatePassword(e.target.value);
              }}
              className={`w-full px-4 py-3 rounded-lg border 
              focus:outline-none focus:ring-2 focus:ring-emerald-500 transition
              ${passwordError ? "border-red-400" : "border-gray-300"}`}
            />

            {passwordError && (
              <p className="text-red-500 text-sm mt-1">{passwordError}</p>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-semibold text-white 
            bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500
            shadow-lg hover:shadow-xl hover:scale-[1.02] 
            transition-all duration-300 disabled:opacity-70"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {error && (
            <p className="text-red-500 text-center text-sm mt-3">
              {error}
            </p>
          )}
        </form>

        {/* Back to home */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/")}
            className="text-sm text-emerald-600 hover:underline"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}