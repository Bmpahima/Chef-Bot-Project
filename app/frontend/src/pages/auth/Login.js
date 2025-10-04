import { useState } from "react";
import axios from "axios";
import { NavLink, useNavigate, Outlet } from "react-router-dom";

import styles from "./Login.module.css";
import { useUser } from "../../store/userContext.js";
import ErrorBox from "../../components/UI/ErrorBox.js";
import ErrorMessage from "../../components/UI/ErrorMessage.js";

const initialStateValue = { email: "", password: "" };

export default function Login() {
  const [formData, setFormData] = useState(initialStateValue);
  const [isLoading, setIsLoading] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [validationErrors, setValidationErrors] = useState([]);
  const navigate = useNavigate();
  const userCtx = useUser();

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrMsg("");
    setValidationErrors([]);
    try {
      const { email, password } = formData;
      const { data } = await axios.post(
        `http://localhost:8000/auth/login`,
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      userCtx.login(data.user, data.token);
      navigate("/app/dashboard");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (!err.response) {
          setErrMsg("Network error. Please try again.");
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

        if (status === 401 || status === 403 || status === 404) {
          setErrMsg(data?.message || "Email or password is incorrect.");
          return;
        }

        setErrMsg(
          data?.message || data?.error || err.message || "Something went wrong."
        );
      } else {
        setErrMsg("Unexpected error.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <title>Chef Bot - Login</title>
      <div className={styles.loginPanel}>
        <h1 className={styles.title}>Login</h1>

        {errMsg && <ErrorMessage message={errMsg} />}

        {validationErrors.length > 0 && (
          <ErrorBox>
            <ul>
              {validationErrors.map((msg, i) => (
                <li key={i}>{msg}</li>
              ))}
            </ul>
          </ErrorBox>
        )}

        <form className={styles.loginForm} noValidate>
          <div className={styles.inputRow}>
            <input
              type="email"
              name="email"
              id="email"
              required
              placeholder=" "
              value={formData.email}
              onChange={onChangeHandler}
              autoComplete="email"
            />
            <label htmlFor="email">Email</label>
          </div>

          <div className={styles.inputRow}>
            <input
              type="password"
              name="password"
              id="password"
              required
              placeholder=" "
              value={formData.password}
              onChange={onChangeHandler}
              autoComplete="current-password"
            />
            <label htmlFor="password">Password</label>
          </div>

          <div className={styles.formActions}>
            <NavLink
              className={styles.forgotPasswordLink}
              to={"reset-password"}
            >
              Forgot Password?
            </NavLink>

            <button type="button" disabled={isLoading} onClick={handleLogin}>
              {isLoading ? "Submitting..." : "Sign In →"}
            </button>
          </div>
        </form>

        <p className={styles.switchAuth}>
          Don’t have an account? <NavLink to={"/auth/signup"}>Sign up</NavLink>
        </p>
      </div>
      <Outlet />
    </>
  );
}
