import { useEffect, useRef, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { PiChefHatFill } from "react-icons/pi";
import { FiX } from "react-icons/fi";
import { CiMail } from "react-icons/ci";

import styles from "./ResetPasswordModal.module.css";
import { authAPI } from "../../http/api";
import ErrorBox from "../../components/UI/ErrorBox.js";
import ErrorMessage from "../../components/UI/ErrorMessage.js";
import ModalLayout from "../../components/layout/ModalLayout.js";

const RESEND_COOLDOWN_SEC = 60;

export default function ResetPasswordModal() {
  const navigate = useNavigate();

  const [step, setStep] = useState("email");

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [ticket, setTicket] = useState(null);
  const [uid, setUid] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [validationErrors, setValidationErrors] = useState([]);

  const [attemptsLeft, setAttemptsLeft] = useState(null);
  const [maxAttempts, setMaxAttempts] = useState(null);
  const [cooldown, setCooldown] = useState(0);
  const canResend = cooldown <= 0;

  const emailInputRef = useRef(null);
  const codeInputRef = useRef(null);
  const passInputRef = useRef(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  useEffect(() => {
    if (step === "email") emailInputRef.current?.focus();
    if (step === "code") codeInputRef.current?.focus();
    if (step === "password") passInputRef.current?.focus();
  }, [step]);

  const attemptsInfo = useMemo(() => {
    if (attemptsLeft == null || maxAttempts == null) return null;
    return `${attemptsLeft} / ${maxAttempts} attempts left`;
  }, [attemptsLeft, maxAttempts]);

  async function handleRequest(e) {
    e.preventDefault();
    setErr("");
    setValidationErrors([]);

    if (!email) {
      emailInputRef.current?.focus();
      return;
    }

    setLoading(true);
    try {
      await authAPI.post("/reset/request", {
        email: email.trim().toLowerCase(),
      });
      setStep("code");
      setCooldown(RESEND_COOLDOWN_SEC);
      setAttemptsLeft(null);
      setMaxAttempts(null);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (!err.response) {
          setErr("Network error. Please try again.");
          return;
        }
        const { status, data } = err.response;
        console.log(status, data);

        if (status === 422) {
          const list = data?.errors ?? data?.validationsErrors ?? [];
          const msgs = list.map((e) => e.msg || e.message || String(e));
          setValidationErrors(msgs);
          return;
        }

        setErr(
          data?.message || data?.error || err.message || "Something went wrong."
        );
      } else {
        setErr("Unexpected error.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (!canResend) return;
    setErr("");
    setValidationErrors([]);
    setLoading(true);
    try {
      await authAPI.post("/reset/request", {
        email: email.trim().toLowerCase(),
      });
      setCooldown(RESEND_COOLDOWN_SEC);
      setAttemptsLeft(null);
      setMaxAttempts(null);
    } catch {
      if (axios.isAxiosError(err)) {
        if (!err.response) {
          setErr("Network error. Please try again.");
          setCooldown(RESEND_COOLDOWN_SEC);

          return;
        }
        const { status, data } = err.response;
        console.log(status, data);

        if (status === 422) {
          const list = data?.errors ?? data?.validationsErrors ?? [];
          const msgs = list.map((e) => e.msg || e.message || String(e));
          setValidationErrors(msgs);
          setCooldown(RESEND_COOLDOWN_SEC);
          return;
        }

        setErr(
          data?.message || data?.error || err.message || "Something went wrong."
        );
      } else {
        setErr("Unexpected error.");
      }
      setCooldown(RESEND_COOLDOWN_SEC);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(e) {
    e.preventDefault();
    setErr("");
    setValidationErrors([]);
    if (code.length !== 6) return;
    setLoading(true);
    try {
      const { data } = await authAPI.post("/reset/verify", {
        email: email.trim().toLowerCase(),
        code: code.trim(),
      });
      if (data?.ticket && data?.uid) {
        setTicket(data.ticket);
        setUid(data.uid);
        setStep("password");
        setAttemptsLeft(null);
        setMaxAttempts(null);
      } else {
        setErr(data?.error || "Code invalid or expired.");
      }
    } catch (error) {
      const resp = error?.response?.data || {};
      setErr(resp?.error || "Code invalid or expired.");
      if (typeof resp.attemptsLeft === "number")
        setAttemptsLeft(resp.attemptsLeft);
      if (typeof resp.maxAttempts === "number")
        setMaxAttempts(resp.maxAttempts);
    } finally {
      setLoading(false);
    }
  }

  async function handleComplete(e) {
    e.preventDefault();
    setErr("");
    setValidationErrors([]);
    if (newPassword.length < 8)
      return setValidationErrors(["Password must be at least 8 characters."]);
    if (newPassword !== confirm) return setErr("Passwords do not match.");
    setLoading(true);
    try {
      console.log(ticket, uid, newPassword);
      await authAPI.post("/reset/complete", { ticket, uid, newPassword });
      alert("Password updated. Please log in.");
      navigate("/auth/login", { replace: true });
    } catch (error) {
      const resp = error?.response?.data || {};
      setErr(resp?.error || "Could not reset password.");
    } finally {
      setLoading(false);
    }
  }

  function onPasteCode(e) {
    const pasted = (e.clipboardData?.getData("text") || "").replace(/\D/g, "");
    if (pasted.length === 6) {
      e.preventDefault();
      setCode(pasted);
    }
  }
  return (
    <>
      <title>Forgot Password?</title>
      <ModalLayout>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.iconContainer} aria-hidden="true">
            <PiChefHatFill size={22} color="#fff" />
          </div>
          <h1 id="reset-title">Reset Password</h1>
        </div>

        <p className={styles.subHeader}>
          {step === "email" && "Enter your email to receive a 6-digit code."}
          {step === "code" &&
            "We sent a 6-digit code to your email. Enter it below."}
          {step === "password" && "Set a new password for your account."}
        </p>

        {step === "email" && (
          <form className={styles.resetForm} onSubmit={handleRequest}>
            <label htmlFor="rp-email">Email Address</label>
            <div className={styles.inputWrap}>
              <CiMail className={styles.icon} aria-hidden="true" />
              <input
                id="rp-email"
                ref={emailInputRef}
                type="email"
                placeholder="chef@example.com"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {err && <ErrorMessage message={err} />}
            {validationErrors.length > 0 && (
              <ErrorBox>
                <ul>
                  {validationErrors.map((msg, i) => (
                    <li key={i}>{msg}</li>
                  ))}
                </ul>
              </ErrorBox>
            )}

            <button
              type="submit"
              className={styles.resetBtn}
              disabled={loading || !email}
            >
              {loading ? "Sending..." : "Send code"}
            </button>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={() => {
                navigate("..", { relative: "path", replace: true });
              }}
            >
              Cancel
            </button>
          </form>
        )}

        {step === "code" && (
          <form className={styles.resetForm} onSubmit={handleVerify}>
            <label htmlFor="rp-code">Verification Code</label>
            <div className={styles.inputWrap}>
              <input
                id="rp-code"
                ref={codeInputRef}
                type="text"
                inputMode="numeric"
                pattern="\d{6}"
                maxLength={6}
                placeholder="123456"
                required
                value={code}
                onPaste={onPasteCode}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                autoComplete="one-time-code"
              />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                margin: "4px 0 10px",
              }}
            >
              <small style={{ color: "var(--gray-300)" }}>
                {attemptsInfo ? attemptsInfo : "\u00A0"}
              </small>
              <button
                type="button"
                onClick={handleResend}
                disabled={!canResend || loading}
                style={{
                  background: "transparent",
                  border: 0,
                  color: canResend ? "var(--green-300)" : "var(--gray-400)",
                  cursor: canResend ? "pointer" : "not-allowed",
                  padding: 0,
                }}
              >
                {canResend ? "Resend code" : `Resend in ${cooldown}s`}
              </button>
            </div>

            {err && <ErrorMessage message={err} />}
            {validationErrors.length > 0 && (
              <ErrorBox>
                <ul>
                  {validationErrors.map((msg, i) => (
                    <li key={i}>{msg}</li>
                  ))}
                </ul>
              </ErrorBox>
            )}

            <button
              type="submit"
              className={styles.resetBtn}
              disabled={loading || code.length !== 6}
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={() => setStep("email")}
            >
              Back
            </button>
          </form>
        )}

        {step === "password" && (
          <form className={styles.resetForm} onSubmit={handleComplete}>
            <label htmlFor="rp-pass">New Password</label>
            <div className={styles.inputWrap}>
              <input
                id="rp-pass"
                ref={passInputRef}
                type="password"
                placeholder="••••••••"
                required
                // minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <label htmlFor="rp-confirm">Confirm Password</label>
            <div className={styles.inputWrap}>
              <input
                id="rp-confirm"
                type="password"
                placeholder="••••••••"
                required
                // minLength={8}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </div>

            {err && <ErrorMessage message={err} />}
            {validationErrors.length > 0 && (
              <ErrorBox>
                <ul>
                  {validationErrors.map((msg, i) => (
                    <li key={i}>{msg}</li>
                  ))}
                </ul>
              </ErrorBox>
            )}
            <button
              type="submit"
              className={styles.resetBtn}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save new password"}
            </button>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={() => {
                navigate("..", { relative: "path", replace: true });
              }}
            >
              Cancel
            </button>
          </form>
        )}

        <button
          type="button"
          className={styles.closeContainer}
          aria-label="Close reset password modal"
          onClick={() => {
            navigate("..", { relative: "path", replace: true });
          }}
        >
          <FiX className={styles.XIcon} />
        </button>

        <p className={styles.safetyText}>
          We’ll only use your email for password reset.
        </p>
      </ModalLayout>
    </>
  );
}
