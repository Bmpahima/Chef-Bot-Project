import { NavLink, useNavigate, useLocation } from "react-router-dom";

import styles from "./NavbarBig.module.css";

export default function NavbarBig() {
  const navigate = useNavigate();
  const location = useLocation();

  const setPageTitle = () => {
    const p = location.pathname;
    if (p.startsWith("/app/recipes")) return "Recipes";
    if (p.startsWith("/app/create")) return "Create Recipe";
    if (p.startsWith("/app/profile")) return "Profile";
    if (p.startsWith("/app/dashboard")) return "Dashboard";
    return "Page";
  };

  let pageTitle = setPageTitle();

  return (
    <header>
      <nav className={styles.navbarContainer}>
        <div className={styles.logo}>
          <p
            onClick={() => {
              navigate("/app/dashboard");
            }}
          >
            Chef-Bot
          </p>
        </div>
        <p className={styles.currentPage}>{pageTitle}</p>
        <div className={styles.navOptions}>
          <NavLink
            to={"/app/dashboard"}
            className={({ isActive }) =>
              isActive ? styles.activeOption : undefined
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to={"/app/create"}
            className={({ isActive }) =>
              isActive ? styles.activeOption : undefined
            }
          >
            Create
          </NavLink>
          <NavLink
            to={"/app/recipes/all"}
            className={({ isActive }) =>
              isActive ? styles.activeOption : undefined
            }
          >
            Recipes
          </NavLink>
          <NavLink
            to={"/app/profile"}
            className={({ isActive }) =>
              isActive ? styles.activeOption : undefined
            }
          >
            Profile
          </NavLink>
        </div>
        <div className={styles.navProfileImg} aria-hidden="true"></div>
      </nav>
    </header>
  );
}
