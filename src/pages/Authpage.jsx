import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import personImage from '../person.png';
import "./AuthPageSplit.css";
import logoimg from '../logo.png';

export default function AuthPage() {
  const { login } = useAuth();
  const location = useLocation();

  const [mode, setMode] = useState("signup");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    countryCode: "+1",
    newPassword: "",
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

useEffect(() => {
  document.title = "Sign In | Ironic Gym";
}, []);
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const modeParam = params.get("mode");

    if (modeParam === "signin") {
      setMode("signin");
    } else {
      setMode("signup");
    }

    setError("");
    setMessage("");
    setOtpSent(false);
setFormData({ name: "", email: "", password: "", phone: "", countryCode: "+1", newPassword: "" });    
    setOtp("");
    
  }, [location.search]);

  const toggleMode = () => {
    if (mode === "forgot" || mode === "reset") {
      setMode("signin");
    } else {
      setMode(mode === "signin" ? "signup" : "signin");
    }
    setError("");
    setMessage("");
    setOtpSent(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const numericValue = value.replace(/\D/g, "");

      // Only update state if the length is 10 or less
      if (numericValue.length <= 10) {
        setFormData({ ...formData, phone: numericValue });
      }
    } else {
      // Standard update for all other fields
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      // SIGNUP
      if (mode === "signup") {
        if (!otpSent) {
          setOtpSent(true);

          // COMBINE PHONE NUMBER HERE
          const fullPhoneNumber = `${formData.countryCode}${formData.phone}`;

          // Use this payload for the fetch request
          const res = await fetch("https://ironic-gym-backend.onrender.com/api/auth/send-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            // Send fullPhoneNumber instead of just formData.phone
            body: JSON.stringify({ 
                email: formData.email, 
                phone: fullPhoneNumber,
              otp
            }),
          });

          const data = await res.json();
          if (!res.ok) {
            setOtpSent(false);
            throw new Error(data.message);
          }

          setMessage("Sign up OTP sent to your email.");
          return;
        } else {
          const res = await fetch("https://ironic-gym-backend.onrender.com/api/auth/verify-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...formData, otp }),
          });

          const data = await res.json();
          if (!res.ok) throw new Error(data.message);

          login(data.user, data.token);
          window.location.href = "/";
          return;
        }
      }

      // SIGNIN
      if (mode === "signin") {
        const res = await fetch("https://ironic-gym-backend.onrender.com/api/auth/signin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        login(data.user, data.token);

        window.location.href = data.isAdmin ? "/admin/dashboard" : "/";
        return;
      }

      // FORGOT PASSWORD (send OTP)
      if (mode === "forgot") {
        const res = await fetch("https://ironic-gym-backend.onrender.com/api/auth/send-reset-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        setMessage("Reset OTP sent. Check your email.");
        setMode("reset");
        return;
      }

      // RESET PASSWORD
      if (mode === "reset") {
        const res = await fetch("https://ironic-gym-backend.onrender.com/api/auth/reset-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            otp: otp,
            newPassword: formData.newPassword,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        setMessage("Password reset! You can now sign in.");
        setMode("signin");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-page-container">

      {/* LEFT WHITE SIDE */}
      <div className="auth-page-decorative-panel">
        <div className="auth-page-motivation-content">
          <img src={logoimg} className="auth-page-motivation-logo"></img>
        </div>

        <img
          src={personImage}
          alt="Athlete"
          className="auth-page-athlete-img"
        />
      </div>

      {/* RIGHT BLACK SIDE */}
      <div className="auth-page-form-panel">
        <div className="auth-page-card">

          <h1 className="auth-page-brand-title">Ironic</h1>

          <h2 className="auth-page-mode-title">
            {mode === "signup" && "Create Account"}
            {mode === "signin" && "Sign In"}
            {mode === "forgot" && "Forgot Password"}
            {mode === "reset" && "Reset Your Password"}
          </h2>

          {error && <p className="auth-page-message-error">{error}</p>}
          {message && <p className="auth-page-message-success">{message}</p>}

          <form className="auth-page-form" onSubmit={handleSubmit}>

            {/* SIGNUP */}
            {mode === "signup" && (
              <div className="auth-page-input-group">
                <input name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} className="auth-page-input" required />
                <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} className="auth-page-input" required />
                <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} className="auth-page-input" required />
                {/* --- New Phone Input with +1 Prefix --- */}
                 <div className="auth-page-phone-row">
                   {/* 1. Country Code Dropdown */}
                   <select 
                     name="countryCode" 
                     value={formData.countryCode} 
                     onChange={handleChange} 
                     className="auth-page-input auth-page-select-code"
                   >
                     <option value="+1">US +1</option>
                     <option value="+91">IN +91</option>
                     <option value="+44">GB +44</option>
                     <option value="+93">AF +93</option>
                   </select>

                   {/* 2. Phone Number Input */}
                   <input
                     name="phone"
                     type="tel"
                     placeholder="Phone Number"
                     value={formData.phone}
                     onChange={handleChange}
                     className="auth-page-input auth-page-phone-number"
                     required
                   />
                </div>
                {/* --- End of new phone input --- */}


                {otpSent && (
                  <input name="otp" placeholder="Enter Sign Up OTP" value={otp} onChange={(e) => setOtp(e.target.value)} className="auth-page-input" required />
                )}
              </div>
            )}

            {/* SIGNIN */}
            {mode === "signin" && (
              <div className="auth-page-input-group">
                <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} className="auth-page-input" required />
                <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} className="auth-page-input" required />

                <div className="auth-page-forgot-link-wrapper">
                  <button type="button" onClick={() => { setMode("forgot"); setError(""); setMessage(""); }} className="auth-page-forgot-link">
                    Forgot Password?
                  </button>
                </div>
              </div>
            )}

            {/* FORGOT PASSWORD */}
            {mode === "forgot" && (
              <div className="auth-page-input-group">
                <p className="auth-page-info-text">Enter your email and we'll send you a reset code.</p>
                <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} className="auth-page-input" required />
              </div>
            )}

            {/* RESET PASSWORD */}
            {mode === "reset" && (
              <div className="auth-page-input-group">
                <p className="auth-page-info-text">
                  Check your email for the OTP. Your email is: <strong>{formData.email}</strong>
                </p>

                <input name="otp" placeholder="Enter Reset OTP" value={otp} onChange={(e) => setOtp(e.target.value)} className="auth-page-input" required />
                <input name="newPassword" type="password" placeholder="Enter New Password" value={formData.newPassword} onChange={handleChange} className="auth-page-input" required />
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <button type="submit" className="auth-page-submit-button">
              {mode === "signup" && !otpSent && "Send OTP"}
              {mode === "signup" && otpSent && "Create Account"}
              {mode === "signin" && "Sign In"}
              {mode === "forgot" && "Send Reset Code"}
              {mode === "reset" && "Reset Password"}
            </button>

            {/* GOOGLE LOGIN */}
            {(mode === "signin" || mode === "signup") && (
              <button
                type="button"
                onClick={async () => {
                  try {
                    const result = await signInWithPopup(auth, googleProvider);
                    const user = result.user;

                    const res = await fetch("https://ironic-gym-backend.onrender.com/api/auth/google-signin", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        name: user.displayName,
                        email: user.email,
                        googleId: user.uid,
                      }),
                    });

                    const data = await res.json();
                    if (!res.ok) throw new Error(data.message);

                    login(data.user, data.token);
                    window.location.href = "/";
                  } catch (err) {
                    setError(err.message);
                  }
                }}
                className="auth-page-google-button"
              >
                Sign in with Google
              </button>
            )}
          </form>

          {/* TOGGLE MODE */}
          <p className="auth-page-toggle-text">
            {mode === "signin" && "New here? "}
            {mode === "signup" && "Already have an account? "}
            {(mode === "forgot" || mode === "reset") && "Remembered your password? "}

            <button onClick={toggleMode} className="auth-page-toggle-button">
              {mode === "signin" && "Sign Up"}
              {mode === "signup" && "Sign In"}
              {(mode === "forgot" || mode === "reset") && "Sign In"}
            </button>
          </p>

        </div>

      </div>

    </div>

  );
}
