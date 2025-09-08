import { useState } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";

import styles from "./Login.module.css";
import BurgerImg from "../../assets/images/welcomeImg.png";
import NavbarSmall from "../../components/layout/NavbarSmall.js";
import { useUser } from "../../store/userContext.js";

const initialStateValue = {
  email: "",
  password: "",
};

export default function Login() {
  const [formData, setFormData] = useState(initialStateValue);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();
  const userCtx = useUser();

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData((prevValue) => ({ ...prevValue, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors([]);

    try {
      const { email, password } = formData;

      const { data } = await axios.post(
        `http://localhost:8000/auth/login`,
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (data?.error) {
        setErrors((prev) => [...prev, data.error]);
        return;
      }
      console.log(data);
      userCtx.login(data.user, data.token);
      navigate("/app/dashboard");
    } catch (err) {
      const msg = err.message || "Login failed";
      setErrors((prev) => [...prev, msg]);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.curvedCut} aria-hidden="true"></div>

      <NavbarSmall />

      <section className={styles.content}>
        <div className={styles.loginForm}>
          <h3>Login</h3>
          <form method="POST" className={styles.loginForm}>
            <div className={styles.loginForm__input}>
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
            <div className={styles.loginForm__input}>
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

            <button type="button" onClick={handleLogin} disabled={isLoading}>
              {isLoading ? "Submitting..." : "Sign In →"}
            </button>
          </form>
          <p>
            Already got an account? <NavLink>Sign In</NavLink>
          </p>
        </div>

        <div className={styles.heroImage}>
          <img src={BurgerImg} alt="Chef-Bot hero burger" />
        </div>
      </section>
    </div>
  );
}
