import { API_URL } from "../config/api";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Lock,
  Mail,
  ShieldCheck,
  User,
  Eye,
  EyeOff,
  Building2,
} from "lucide-react";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  const handleRegister = async (event) => {

    event.preventDefault();

    setError("");
    setSuccess("");


    if (
      !name.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword
    ) {

      setError(
        "Please complete all required fields."
      );

      return;
    }


    if (password.length < 8) {

      setError(
        "Password must contain at least 8 characters."
      );

      return;
    }


    if (password !== confirmPassword) {

      setError(
        "Passwords do not match."
      );

      return;
    }


    setLoading(true);


    try {

      const response =
        await fetch(
          `${API_URL}/api/auth/register`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              name: name.trim(),

              email:
                email.trim(),

              company:
                company.trim(),

              password,
            }),
          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data?.detail ||
            "Unable to create account."
        );

      }


      setSuccess(
        "Account created successfully. Redirecting to login..."
      );


      /*
       * Give the user a moment to see
       * the success message.
       */

      setTimeout(() => {

        navigate("/login", {
          replace: true,
        });

      }, 1200);


    } catch (err) {

      console.error(
        "Registration error:",
        err
      );

      setError(
        err.message ||
          "Unable to connect to the authentication server."
      );

    } finally {

      setLoading(false);

    }

  };


  return (

    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#020b14] px-4 py-8">

      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="absolute inset-0">

        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/5 blur-3xl" />

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
          REGISTER CARD
      ===================================================== */}

      <div className="relative z-10 w-full max-w-md">

        {/* Logo */}

        <div className="mb-7 text-center">

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
              New Account
            </p>

            <h2 className="mt-2 text-2xl font-bold text-white">
              Create your account
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Register to access AOUT-FREIGHT intelligence tools.
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


          {/* Success */}

          {success && (

            <div className="mb-5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-4 py-3">

              <p className="text-xs leading-5 text-emerald-400">
                {success}
              </p>

            </div>

          )}


          <form
            onSubmit={handleRegister}
            className="space-y-4"
          >

            {/* Name */}

            <div>

              <label className="mb-2 block text-xs font-medium text-slate-400">
                Full Name
              </label>

              <div className="relative">

                <User
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
                />

                <input
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(
                      event.target.value
                    )
                  }
                  placeholder="Your full name"
                  autoComplete="name"
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 py-3 pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-cyan-500/50"
                />

              </div>

            </div>


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
                    setEmail(
                      event.target.value
                    )
                  }
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 py-3 pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-cyan-500/50"
                />

              </div>

            </div>


            {/* Company */}

            <div>

              <label className="mb-2 block text-xs font-medium text-slate-400">
                Company
                <span className="ml-1 text-slate-700">
                  (optional)
                </span>
              </label>

              <div className="relative">

                <Building2
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
                />

                <input
                  type="text"
                  value={company}
                  onChange={(event) =>
                    setCompany(
                      event.target.value
                    )
                  }
                  placeholder="Company name"
                  autoComplete="organization"
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
                    setPassword(
                      event.target.value
                    )
                  }
                  placeholder="Minimum 8 characters"
                  autoComplete="new-password"
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 py-3 pl-10 pr-11 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-cyan-500/50"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-300"
                >

                  {showPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}

                </button>

              </div>

            </div>


            {/* Confirm Password */}

            <div>

              <label className="mb-2 block text-xs font-medium text-slate-400">
                Confirm Password
              </label>

              <div className="relative">

                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
                />

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(
                      event.target.value
                    )
                  }
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 py-3 pl-10 pr-11 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-cyan-500/50"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-300"
                >

                  {showConfirmPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}

                </button>

              </div>

            </div>


            {/* Register Button */}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-500 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
            >

              {loading
                ? "Creating account..."
                : "Create Account"}

              {!loading && (
                <ArrowRight size={16} />
              )}

            </button>

          </form>


          {/* Login */}

          <div className="mt-6 border-t border-slate-800 pt-5 text-center">

            <p className="text-xs text-slate-600">
              Already have an account?
            </p>

            <Link
              to="/login"
              className="mt-2 inline-block text-xs font-semibold text-cyan-400 transition hover:text-cyan-300"
            >
              Sign in →
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

export default Register;