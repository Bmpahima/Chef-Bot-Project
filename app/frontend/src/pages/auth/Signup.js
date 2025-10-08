import { useState } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";

import styles from "./Signup.module.css";
import { PROFILE_IMAGES } from "../../data/data.js";
import ErrorBox from "../../components/UI/ErrorBox.js";
import ErrorMessage from "../../components/UI/ErrorMessage.js";
import { authAPI } from "../../http/api.js";

const initialStateValue = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  profileImage: "/static/media/profile-1.63a59e2c2259d740b518.png",
};

export default function Signup() {
  const [formData, setFormData] = useState(initialStateValue);
  const [isLoading, setIsLoading] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [validationErrors, setValidationErrors] = useState([]);
  const navigate = useNavigate();

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const onImgClick = (value) => {
    setFormData((p) => ({ ...p, profileImage: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrMsg("");
    setValidationErrors([]);

    const { username, email, password, confirmPassword, profileImage } =
      formData;

    if (password.length < 8) {
      setValidationErrors((prev) => [
        ...prev,
        "Password must be at least 8 characters.",
      ]);
      setIsLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setValidationErrors((prev) => [...prev, "Passwords do not match."]);
      setIsLoading(false);
      return;
    }

    try {
      await authAPI.post(
        "/signup",
        { username, email, password, confirmPassword, imageUrl: profileImage },
        { headers: { "Content-Type": "application/json" } }
      );

      navigate("/auth/login");
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
      <title>Chef Bot - SignUp</title>

      <div className={styles.signupPanel}>
        <h1 className={styles.title}>Sign Up</h1>

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

        <form className={styles.signupForm} onSubmit={handleSignup} noValidate>
          <div className={styles.inputRow}>
            <input
              type="text"
              name="username"
              id="username"
              required
              placeholder=" "
              value={formData.username}
              onChange={onChangeHandler}
              autoComplete="username"
            />
            <label htmlFor="username">Username</label>
          </div>

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

          <div className={styles.inlineInputs}>
            <div className={styles.inputRow}>
              <input
                type="password"
                name="password"
                id="password"
                required
                placeholder=" "
                value={formData.password}
                onChange={onChangeHandler}
                autoComplete="new-password"
              />
              <label htmlFor="password">Password</label>
            </div>
            <div className={styles.inputRow}>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                required
                placeholder=" "
                value={formData.confirmPassword}
                onChange={onChangeHandler}
                autoComplete="new-password"
              />
              <label htmlFor="confirmPassword">Confirm Password</label>
            </div>
          </div>

          <div className={styles.profileGridWrap}>
            <p className={styles.gridLabel}>Choose a profile image</p>
            <div
              className={styles.profileGrid}
              role="group"
              aria-label="Choose profile image"
            >
              {PROFILE_IMAGES.map((item) => {
                const selected = item.src === formData.profileImage;
                return (
                  <button
                    key={item.src}
                    type="button"
                    className={`${styles.profTile} ${
                      selected ? styles.selected : ""
                    }`}
                    aria-pressed={selected}
                    onClick={() => onImgClick(item.src)}
                  >
                    <img src={item.src} alt={item.alt} />
                  </button>
                );
              })}
            </div>
          </div>

          <div className={styles.formActions}>
            <button
              type="submit"
              disabled={isLoading}
              className={styles.signupSubmitBtn}
            >
              {isLoading ? "Submitting..." : "Sign Up →"}
            </button>
            <p className={styles.switchAuth}>
              Already have an account? <NavLink to="/auth/login">Login</NavLink>
            </p>
          </div>
        </form>
      </div>
    </>
  );
}
