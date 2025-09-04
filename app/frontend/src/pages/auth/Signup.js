import { useState } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import NavbarSmall from "../../components/layout/NavbarSmall.js";

import styles from "./Signup.module.css";
import BurgerImg from "../../assets/images/welcomeImg.png";

const initialStateValue = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function Signup() {
  const [formData, setFormData] = useState(initialStateValue);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData((prevValue) => ({ ...prevValue, [name]: value }));
  };

  const handleSignup = async (event) => {
    setIsLoading(true);
    event.preventDefault();
    const username = formData.username;
    const email = formData.email;
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;
    try {
      const { data } = await axios.post(
        "http://localhost:8000/auth/signup",
        {
          username,
          email,
          password,
          confirmPassword,
        },
        { headers: "Content-Type: application/json" }
      );
      if (data?.error) {
        setErrors((prev) => [...prev, data.error]);
        return;
      }

      navigate("/app/dashboard");
    } catch (error) {
      const msg = error.message || "Login failed";
      setErrors((prev) => [...prev, msg]);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.curvedCut} aria-hidden="true"></div>
      <NavbarSmall />
      <section className={styles.content}>
        <div className={styles.signUpForm}>
          <h3>Sign Up</h3>
          <form method="POST" className={styles.signUpForm}>
            <div className={styles.signUpForm__input}>
              <input
                type="text"
                name="username"
                id="username"
                required
                placeholder=" "
                value={formData.username}
                onChange={onChangeHandler}
              />
              <label htmlFor="username">Username</label>
            </div>
            <div className={styles.signUpForm__input}>
              <input
                type="email"
                name="email"
                id="email"
                required
                placeholder=" "
                value={formData.email}
                onChange={onChangeHandler}
              />
              <label htmlFor="email">Email</label>
            </div>
            <div className={styles.signUpForm__input}>
              <input
                type="password"
                name="password"
                id="password"
                required
                placeholder=" "
                value={formData.password}
                onChange={onChangeHandler}
              />
              <label htmlFor="password">Password</label>
            </div>
            <div className={styles.signUpForm__input}>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                required
                placeholder=" "
                value={formData.confirmPassword}
                onChange={onChangeHandler}
              />
              <label htmlFor="confirmPassword">Confirm Password</label>
            </div>
            <button type="button" onClick={handleSignup} disabled={isLoading}>
              {isLoading ? "Submitting..." : "Sign Up →"}
            </button>
          </form>

          <p>
            Already got an account? <NavLink to="/auth/login">Sign In</NavLink>
          </p>
        </div>
        <div className={styles.heroImage}>
          <img src={BurgerImg} alt="Chef-Bot hero burger" />
        </div>
      </section>
    </div>
  );
}
