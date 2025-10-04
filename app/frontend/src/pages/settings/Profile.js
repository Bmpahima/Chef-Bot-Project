import { useState } from "react";
import {
  NavLink,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "react-router-dom";
import { FaBowlFood } from "react-icons/fa6";
import { AiFillEdit } from "react-icons/ai";
import { MdFavorite } from "react-icons/md";
import axios from "axios";

import styles from "./Profile.module.css";
import NavbarBig from "../../components/layout/NavbarBig.js";
import {
  CUISINE_OPTIONS,
  DIET_TOGGLES,
  DIFFICULTY_OPTIONS,
  FLAVOR_OPTIONS,
} from "../../data/constants.js";
import { useUser } from "../../store/userContext.js";
import { appAPI, authAPI } from "../../http/api.js";
import ErrorMessage from "../../components/UI/ErrorMessage.js";
import ErrorBox from "../../components/UI/ErrorBox.js";

const INITIAL_PASSWORD_DATA = {
  currentPassword: "",
  newPassword: "",
};

export default function Profile() {
  const userCtx = useUser();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const {
    recentRecipes = [],
    totalRecipes = 0,
    ok = true,
    error,
  } = useLoaderData();
  const [passwordFormData, setPasswordFormData] = useState(
    INITIAL_PASSWORD_DATA
  );
  const [editProfileLoading, setEditProfileLoading] = useState(false);
  const [editPrefLoading, setEditPrefLoading] = useState(false);
  const [editPassLoading, setEditPassLoading] = useState(false);

  const [errorType, setErrorType] = useState(""); // ["general", "profile", "password", "prefs"]
  const [errorMsg, setErrorMsg] = useState("");
  const [validationErrors, setValidationErrors] = useState([]);

  const [profileFormData, setProfileFormData] = useState({
    fullName: userCtx.user.fullName || "",
    email: userCtx.user.email || "",
    username: userCtx.user.username || "",
  });

  const [userPref, setUserPref] = useState({
    cuisine: userCtx.user.defaultPreferences.cuisine || ["other"],
    difficulty: userCtx.user.defaultPreferences.difficulty || "easy",
    diet: userCtx.user.defaultPreferences.diet || [],
    flavors: userCtx.user.defaultPreferences.flavors || ["comfort"],
  });

  const onLogout = () => {
    userCtx.logout();
    navigate("/auth/login", { replace: true });
  };

  const onChangeUserPref = (event) => {
    try {
      const { name, value, checked } = event.target;

      setUserPref((prev) => {
        switch (name) {
          case "difficulty":
            return { ...prev, [name]: value };
          case "flavors":
            const flavors = prev.flavors.includes(value)
              ? prev.flavors.filter((v) => v !== value)
              : [...prev.flavors, value];
            return { ...prev, flavors: flavors };
          case "cuisine":
            const cuisine = !checked
              ? prev.cuisine.filter((v) => v !== value)
              : [...prev.cuisine, value];
            return { ...prev, cuisine: cuisine };
          case "diet":
            const diet = !checked
              ? prev.diet.filter((v) => v !== value)
              : [...prev.diet, value];
            return { ...prev, diet: diet };
          default:
            return prev;
        }
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const onChangeProfileData = (event) => {
    console.log(event.target);
    const { name, value } = event.target;
    setProfileFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onChangePasswordData = (event) => {
    console.log(event.target);
    const { name, value } = event.target;
    setPasswordFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitProfileData = async () => {
    try {
      setErrorType("");
      setErrorMsg("");
      setValidationErrors([]);
      setEditProfileLoading(true);
      const { data } = await authAPI.patch("/edit-profile", profileFormData);
      if (!data || data.error) {
        setErrorMsg(data?.error || "Failed to edit profile data.");
      } else {
        alert("Profile data changed Successfully.");
        userCtx.updateUser(data.updated || {});
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (!err.response) {
          setErrorMsg("Network error. Please try again.");
          return;
        }
        const { status, data } = err.response;
        console.log(status, data);

        if (status === 422) {
          const list = data?.errors ?? data?.validationsErrors ?? [];
          const msgs = list.map((e) => e.msg || e.message || String(e));
          setValidationErrors(msgs);
          setErrorType("profile");
          return;
        }

        setErrorMsg(
          data?.message || data?.error || err.message || "Something went wrong."
        );
      } else {
        setErrorMsg("Unexpected error.");
        setErrorType("general");
      }
    } finally {
      setEditProfileLoading(false);
    }
  };

  const onSubmitNewPassword = async () => {
    try {
      setErrorType("");
      setErrorMsg("");
      setValidationErrors([]);
      setEditPassLoading(true);
      const { data } = await authAPI.patch(
        "/change-password",
        passwordFormData
      );
      if (!data || data.error) {
        setErrorMsg(data?.error || "Failed to change password.");
      } else {
        alert("Password Changed Successfully.");
        setPasswordFormData(INITIAL_PASSWORD_DATA);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (!err.response) {
          setErrorMsg("Network error. Please try again.");
          return;
        }
        const { status, data } = err.response;
        console.log(status, data);

        if (status === 422) {
          const list = data?.errors ?? data?.validationsErrors ?? [];
          const msgs = list.map((e) => e.msg || e.message || String(e));
          setValidationErrors(msgs);
          setErrorType("password");

          return;
        }

        setErrorMsg(
          data?.message || data?.error || err.message || "Something went wrong."
        );
      } else {
        setErrorType("general");
        setErrorMsg("Unexpected error.");
      }
    } finally {
      setEditPassLoading(false);
    }
  };

  const onSubmitUserPreferences = async () => {
    try {
      setErrorType("");
      setErrorMsg("");
      setValidationErrors([]);
      setEditPrefLoading(true);
      console.log(userPref);
      const { data } = await authAPI.patch("/edit-default-preferences", {
        prefs: userPref,
      });
      if (!data || data.error) {
        setErrorMsg(data?.error || "Failed to change your recipe preferences.");
      } else {
        alert("Recipe Preferences Changed Successfully.");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (!err.response) {
          setErrorMsg("Network error. Please try again.");
          return;
        }
        const { status, data } = err.response;
        console.log(status, data);

        if (status === 422) {
          const list = data?.errors ?? data?.validationsErrors ?? [];
          const msgs = list.map((e) => e.msg || e.message || String(e));
          setValidationErrors(msgs);
          setErrorType("prefs");
          return;
        }

        setErrorMsg(
          data?.message || data?.error || err.message || "Something went wrong."
        );
      } else {
        setErrorType("general");
        setErrorMsg("Unexpected error.");
      }
    } finally {
      setEditPrefLoading(false);
    }
  };

  let isLoading = navigation.state === "loading";
  let recipesContent = undefined;

  if (isLoading) {
    recipesContent = <p>Recipes are loading...</p>;
  } else {
    recipesContent = recentRecipes.map((r, index) => (
      <div
        key={`rec-${r.name}-${index}`}
        className={styles.recipeCard}
        onClick={() => {
          navigate(`/app/recipes/${r._id}`);
        }}
      >
        {r.url && <img src={r.url} alt={r.name}></img>}
        <span>{r.name}</span>
      </div>
    ));
  }

  return (
    <>
      <title>Profile</title>{" "}
      <div className={styles.pageContainer}>
        <NavbarBig />
        {errorType === "general" && (
          <>
            {" "}
            {errorMsg && <ErrorMessage message={errorMsg} />}
            {validationErrors.length > 0 && (
              <ErrorBox>
                <ul>
                  {validationErrors.map((msg, i) => (
                    <li key={i}>{msg}</li>
                  ))}
                </ul>
              </ErrorBox>
            )}
          </>
        )}
        <main className={styles.container}>
          <div className={styles.mainProfileContainer}>
            <div className={styles.mainProfileImgWrap}>
              <img
                className={styles.profileImg}
                src={userCtx.user.profileImg}
                alt="User Profile Pic"
              />
            </div>

            <h3>{userCtx.user.fullName || "User Name"}</h3>
            <h5>@{userCtx.user.username}</h5>

            <div className={styles.mainProfileDits}>
              <div className={styles.dits}>
                <strong>{totalRecipes}</strong>
                <p>Recipes</p>
              </div>
              <div className={styles.dits}>
                <strong>20</strong>
                <p>Favorites</p>
              </div>
            </div>

            <div className={styles.quickAction}>
              <h4>Quick Actions</h4>
              <button
                type="button"
                className={styles.quickItem}
                onClick={() => {
                  navigate("/app/recipes/all");
                }}
              >
                <FaBowlFood size={"16px"} color="#d4d4d4" />
                <p>View All Recipes</p>
              </button>
              <button
                type="button"
                className={styles.quickItem}
                onClick={() => {
                  navigate("/app/create");
                }}
              >
                <AiFillEdit size={"16px"} color="#d4d4d4" />
                <p>Create Recipe</p>
              </button>
              <button type="button" className={styles.quickItem}>
                <MdFavorite size={"16px"} color="#d4d4d4" />
                <p>Favorite</p>
              </button>
            </div>
            <div className={styles.bottomMenuContainer}>
              <button type="button" onClick={onLogout}>
                Logout
              </button>
            </div>
          </div>

          <div className={styles.profileDetailsContainer}>
            <div>
              <h3>Profile</h3>
              <form className={styles.detailsForm}>
                <div className={styles.textInput}>
                  <label htmlFor="fullName">Full Name</label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Your full name"
                    onChange={onChangeProfileData}
                    value={profileFormData.fullName}
                  />
                </div>

                <div className={styles.textInput}>
                  <label htmlFor="username">Username</label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="chef_lover"
                    onChange={onChangeProfileData}
                    value={profileFormData.username}
                  />
                </div>

                <div className={styles.textInput}>
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    onChange={onChangeProfileData}
                    value={profileFormData.email}
                  />
                </div>

                <button
                  type="button"
                  className={styles.profileSaveButton}
                  onClick={onSubmitProfileData}
                  disabled={
                    isLoading ||
                    editPrefLoading ||
                    editProfileLoading ||
                    editPassLoading
                  }
                >
                  {editProfileLoading ? "Saving..." : "Save Changes"}
                </button>
              </form>
              {errorType === "profile" && (
                <>
                  {" "}
                  {errorMsg && <ErrorMessage message={errorMsg} />}
                  {validationErrors.length > 0 && (
                    <ErrorBox>
                      <ul>
                        {validationErrors.map((msg, i) => (
                          <li key={i}>{msg}</li>
                        ))}
                      </ul>
                    </ErrorBox>
                  )}
                </>
              )}
            </div>
            <div>
              <h3>Change Password</h3>
              <form className={styles.detailsForm}>
                <div className={styles.textInput}>
                  <label htmlFor="currentPassword">Current Password</label>
                  <input
                    id="currentPassword"
                    type="password"
                    name="currentPassword"
                    value={passwordFormData.currentPassword}
                    onChange={onChangePasswordData}
                    placeholder="Your current password"
                  />
                </div>
                <div className={styles.textInput}>
                  <label htmlFor="newPassword">New Password</label>
                  <input
                    id="newPassword"
                    type="password"
                    name="newPassword"
                    value={passwordFormData.newPassword}
                    onChange={onChangePasswordData}
                    placeholder="Your new password"
                  />
                </div>
                <button
                  type="button"
                  className={styles.profileSaveButton}
                  onClick={onSubmitNewPassword}
                  disabled={
                    isLoading ||
                    editPrefLoading ||
                    editProfileLoading ||
                    editPassLoading
                  }
                >
                  {editPassLoading ? "Saving..." : "Save Changes"}
                </button>
              </form>
              {errorType === "password" && (
                <>
                  {" "}
                  {errorMsg && <ErrorMessage message={errorMsg} />}
                  {validationErrors.length > 0 && (
                    <ErrorBox>
                      <ul>
                        {validationErrors.map((msg, i) => (
                          <li key={i}>{msg}</li>
                        ))}
                      </ul>
                    </ErrorBox>
                  )}
                </>
              )}
            </div>
          </div>

          <div className={styles.aboutMeContainer}>
            <h3>About Me</h3>
            <h5>My Default Preferences</h5>
            <form>
              <fieldset className={styles.cuisineContainer}>
                <legend className={styles.prefLabelHeader}>Cuisine</legend>
                <div className={styles.cuisineOptions}>
                  {CUISINE_OPTIONS.map((cuisine) => (
                    <label
                      key={cuisine.value}
                      htmlFor={`cuisine-${cuisine.value}`}
                      style={{ display: "block" }}
                    >
                      <input
                        type="checkbox"
                        checked={userPref.cuisine.includes(cuisine.value)}
                        name="cuisine"
                        value={cuisine.value}
                        onChange={onChangeUserPref}
                        id={`cuisine-${cuisine.value}`}
                      />
                      {cuisine.label}
                    </label>
                  ))}
                </div>
              </fieldset>
              <div className={styles.flavorsContainer}>
                <label className={styles.prefLabelHeader}>Flavor</label>
                <div className={styles.flavorsOptions}>
                  {FLAVOR_OPTIONS.map((opt) => (
                    <button
                      type="button"
                      key={opt.value}
                      className={styles.flavorBtn}
                      style={
                        userPref.flavors.includes(opt.value)
                          ? { background: opt.color }
                          : {}
                      }
                      name="flavors"
                      value={opt.value}
                      onClick={onChangeUserPref}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className={styles.dietsDiffWrap}>
                <fieldset className={styles.dietsContainer}>
                  <legend className={styles.prefLabelHeader}>Diets</legend>
                  <div className={styles.dietsOptions}>
                    {DIET_TOGGLES.map((diet) => (
                      <label
                        htmlFor={`diet-${diet.key}`}
                        key={diet.label}
                        style={{ display: "block" }}
                      >
                        <input
                          key={diet.label}
                          type="checkbox"
                          checked={userPref.diet.includes(diet.key)}
                          name="diet"
                          value={diet.key}
                          onChange={onChangeUserPref}
                          id={`diet-${diet.key}`}
                        />
                        {diet.label}
                      </label>
                    ))}
                  </div>
                </fieldset>
                <div className={styles.diffContainer}>
                  <label className={styles.prefLabelHeader}>Difficulty</label>
                  <select
                    id="difficulty"
                    className={styles.diffOptions}
                    name="difficulty"
                    value={userPref.difficulty}
                    onChange={onChangeUserPref}
                  >
                    {DIFFICULTY_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                type="button"
                className={styles.profileSaveButton}
                onClick={onSubmitUserPreferences}
                disabled={
                  isLoading ||
                  editPrefLoading ||
                  editProfileLoading ||
                  editPassLoading
                }
              >
                {editPrefLoading ? "Saving..." : "Save Changes"}
              </button>
            </form>
            {errorType === "prefs" && (
              <>
                {" "}
                {errorMsg && <ErrorMessage message={errorMsg} />}
                {validationErrors.length > 0 && (
                  <ErrorBox>
                    <ul>
                      {validationErrors.map((msg, i) => (
                        <li key={i}>{msg}</li>
                      ))}
                    </ul>
                  </ErrorBox>
                )}
              </>
            )}
          </div>
          {/* <div className={styles.quickActionContainer}></div> */}
          <div className={styles.recentRecipesContainer}>
            <div className={styles.blockHead}>
              <h3>Recent Recipes</h3>
              <NavLink to={"/app/recipes/all"}>View All</NavLink>
            </div>
            <div className={styles.recentList}>
              {ok ? recipesContent : <ErrorMessage message={error} />}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export async function loader() {
  try {
    const { data } = await appAPI.get(`/get-profile`);
    console.log(data);
    if (!data) {
      console.log("No profile dara has been found.");
      throw new Error("No profile dara has been found.");
    }

    if (data?.error) {
      throw new Error(
        "Failed to fetch profile page. please try again later." + data.error
      );
    }

    const response = {
      recentRecipes: data.recipes,
      totalRecipes: data.totalRecipes,
      ok: true,
      error: null,
    };
    return response;
  } catch (error) {
    return {
      recentRecipes: null,
      totalRecipes: null,
      error: error.message || "Failed to fetch recipe. please try again later.",
      ok: false,
    };
  }
}
