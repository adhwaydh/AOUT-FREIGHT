import { API_URL } from "../config/api";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Lock,
  Mail,
  ShieldCheck,
  Eye,
  EyeOff,
} from "lucide-react";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleLogin = async (event) => {
    event.preventDefault();

    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            "Invalid email or password."
        );
      }

      /*
       * Save authentication token.
       *
       * Your App.jsx checks this value before
       * allowing access to the application.
       */

      const token =
        data.access_token ||
        data.token ||
        data.accessToken;

      if (!token) {
        throw new Error(
          "Login succeeded, but the server did not return an authentication token."
        );
      }

      localStorage.setItem(
        "aout_freight_token",
        token
      );

      /*
       * Optional user information.
       */

      if (data.user) {
        localStorage.setItem(
          "aout_freight_user",
          JSON.stringify(data.user)
        );
      }

      /*
       * Go to the application.
       */

      navigate("/dashboard", {
        replace: true,
      });

    } catch (err) {
      console.error("Login error:", err);

      setError(
        err.message ||
          "Unable to connect to the authentication server."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#020b14] px-4">

      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="absolute inset-0">

        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/5 blur-3xl" />

        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(rgba(34,211,238,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,.08) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />

      </div>


      {/* =====================================================
          LOGIN CARD
      ===================================================== */}

      <div className="relative z-10 w-full max-w-md">

        {/* Logo */}

        <div className="mb-8 text-center">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10">

            <ShieldCheck
              size={28}
              className="text-cyan-400"
            />

          </div>

          <h1 className="mt-4 text-2xl font-bold tracking-tight text-white">
            AOUT<span className="text-cyan-400">FREIGHT</span>
          </h1>

          <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-600">
            Chartering Intelligence
          </p>

        </div>


        {/* Card */}

        <div className="rounded-2xl border border-slate-800 bg-[#061724]/95 p-6 shadow-2xl backdrop-blur">

          <div className="mb-6">

            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-cyan-400">
              Secure Access
            </p>

            <h2 className="mt-2 text-2xl font-bold text-white">
              Welcome back
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Sign in to access your freight intelligence dashboard.
            </p>

          </div>


          {/* Error */}

          {error && (

            <div className="mb-5 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3">

              <p className="text-xs leading-5 text-red-400">
                {error}
              </p>

            </div>

          )}


          {/* Form */}

          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >

            {/* Email */}

            <div>

              <label className="mb-2 block text-xs font-medium text-slate-400">
                Email Address
              </label>

              <div className="relative">

                <Mail
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 py-3 pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-cyan-500/50"
                />

              </div>

            </div>


            {/* Password */}

            <div>

              <label className="mb-2 block text-xs font-medium text-slate-400">
                Password
              </label>

              <div className="relative">

                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
                />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 py-3 pl-10 pr-11 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-cyan-500/50"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 transition hover:text-slate-300"
                >

                  {showPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}

                </button>

              </div>

            </div>


            {/* Login */}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-500 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
            >

              {loading
                ? "Signing in..."
                : "Sign In"}

              {!loading && (
                <ArrowRight size={16} />
              )}

            </button>

          </form>


          {/* Register */}

          <div className="mt-6 border-t border-slate-800 pt-5 text-center">

            <p className="text-xs text-slate-600">
              Don't have an account?
            </p>

            <Link
              to="/register"
              className="mt-2 inline-block text-xs font-semibold text-cyan-400 transition hover:text-cyan-300"
            >
              Create an account →
            </Link>

          </div>

        </div>


        {/* Back */}

        <div className="mt-5 text-center">

          <Link
            to="/"
            className="text-xs text-slate-600 transition hover:text-slate-400"
          >
            ← Back to AOUT-FREIGHT
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Login;