import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Welcome from "./auth/Welcome.js";
import Login from "./auth/Login.js";
import Signup from "./auth/Signup.js";
import Dashboard from "./app/Dashboard.js";
import RecipesPage from "./app/recipes/RecipesPage.js";
import RecipeDetail from "./app/recipes/RecipeDetail.js";
import RecipeGenerator from "./app/generateRecipe/RecipeGenerator.js";
import Profile from "./settings/Profile.js";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Welcome />,
  },
  {
    path: "auth",
    children: [
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },
    ],
  },
  {
    path: "/app",
    element: null,
    children: [
      { path: "dashboard", element: <Dashboard /> },
      {
        path: "recipes",
        element: null,
        children: [
          { path: "all", element: <RecipesPage /> },
          { path: ":id", element: <RecipeDetail /> },
        ],
      },
      {
        path: "create",
        element: <RecipeGenerator />,
        children: [
          { path: "upload", element: null },
          { path: "review", element: null },
          { path: "constraints", element: null },
          { path: "generate", element: null },
          { path: "publish", element: null },
        ],
      },
      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
