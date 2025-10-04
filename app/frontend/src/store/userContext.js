import { createContext, useState, useEffect, useContext } from "react";
import { authAPI } from "../http/api";
import { DEFUALT_PREFERENCES } from "../data/constants";

const INITIAL_USER = {
  id: null,
  username: "",
  email: "",
  profileImg: "",
  fullName: "",
  defaultPreferences: DEFUALT_PREFERENCES,
};

const UserContext = createContext({
  user: INITIAL_USER,
  isAuthenticated: false,
  loading: true,
  login: async (_token) => {},
  logout: () => {},
  updateUser: (data) => {},
});

export const useUser = () => useContext(UserContext);

export function UserProvider({ children }) {
  const [user, setUser] = useState(INITIAL_USER);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t) {
      authAPI
        .get("/me")
        .then((result) => setUser(result.data.user))
        .catch(() => {
          localStorage.removeItem("token");
          setUser(INITIAL_USER);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const updateUser = (data) => {
    setUser((prev) => {
      const newUser = { ...prev, ...data };
      return newUser;
    });
  };

  const login = (nextUser, nextToken) => {
    setUser(nextUser || INITIAL_USER);
    localStorage.setItem("token", nextToken);
  };

  const logout = () => {
    setUser(INITIAL_USER);
    localStorage.removeItem("token");
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated: !!user.id,
        loading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
