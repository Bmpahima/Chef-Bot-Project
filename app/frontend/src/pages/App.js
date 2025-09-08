import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Welcome from "./auth/Welcome.js";
import Login from "./auth/Login.js";
import Signup from "./auth/Signup.js";
import PrivateRoutes from "./app/PrivateRoute.js";
import Dashboard from "./app/Dashboard.js";
import RecipesPage from "./app/recipes/RecipesPage.js";
import RecipeDetail from "./app/recipes/RecipeDetail.js";
import RecipeGenerator from "./app/generateRecipe/RecipeGenerator.js";
import UploadImage from "./app/generateRecipe/create-options/UploadImage.js";
import ManualEntry from "./app/generateRecipe/create-options/ManualEntry.js";
import AISuggestions from "./app/generateRecipe/create-options/AISuggestions.js";
import Profile from "./settings/Profile.js";
import RecipePreview from "./app/generateRecipe/RecipePreview.js";
import { UserProvider } from "../store/userContext.js";

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
    element: <PrivateRoutes />,
    children: [
      { path: "dashboard", element: <Dashboard /> },
      {
        path: "recipes",
        element: null,
        children: [
          { index: true, element: <Navigate to="all" replace /> },
          { path: "all", element: <RecipesPage /> },
          { path: ":id", element: <RecipeDetail /> },
        ],
      },
      {
        path: "create",
        element: <RecipeGenerator />,
        children: [
          { index: true, element: <Navigate to="upload" replace /> },
          { path: "upload", element: <UploadImage /> },
          { path: "manual", element: <ManualEntry /> },
          { path: "ai", element: <AISuggestions /> },
        ],
      },
      {
        path: "preview",
        element: <RecipePreview />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },
]);

function App() {
  return (
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  );
}

export default App;
