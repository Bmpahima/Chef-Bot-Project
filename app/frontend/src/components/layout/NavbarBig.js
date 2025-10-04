import { NavLink, useNavigate, useLocation } from "react-router-dom";

import styles from "./NavbarBig.module.css";
import { useUser } from "../../store/userContext";
import ImageDropdown from "./ImageDropdown";

export default function NavbarBig() {
  const navigate = useNavigate();
  const location = useLocation();
  const userCtx = useUser();

  const setPageTitle = () => {
    const p = location.pathname;
    if (p.startsWith("/app/recipes")) return "Recipes";
    if (p.startsWith("/app/create")) return "Create Recipe";
    if (p.startsWith("/app/profile")) return "Profile";
    if (p.startsWith("/app/dashboard")) return "Dashboard";
    if (p.startsWith("/app/preview")) return "Recipe Preview";
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
            to={"/app/recipes"}
            className={({ isActive }) =>
              isActive ? styles.activeOption : undefined
            }
          >
            Recipes
          </NavLink>
          {/* <NavLink
            to={"/app/profile"}
            className={({ isActive }) =>
              isActive ? styles.activeOption : undefined
            }
          >
            Profile
          </NavLink> */}
        </div>
        <ImageDropdown
          src={userCtx.user.profileImg}
          username={userCtx.user.username}
        />
        {/* <div className={styles.navProfileImg} aria-hidden="true">
          <img src={userCtx.user.profileImg} alt="User Profile" />
        </div> */}
      </nav>
    </header>
  );
}
