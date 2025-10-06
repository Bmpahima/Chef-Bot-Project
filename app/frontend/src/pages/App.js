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
import { loader as RecipeByIdLoader } from "./app/recipes/RecipeDetail.js";
import RecipeGenerator from "./app/generateRecipe/RecipeGenerator.js";
import UploadImage from "./app/generateRecipe/create-options/UploadImage.js";
import ManualEntry from "./app/generateRecipe/create-options/ManualEntry.js";
import AISuggestions from "./app/generateRecipe/create-options/AISuggestions.js";
import Profile, { loader as ProfileLoader } from "./settings/Profile.js";
import RecipePreview from "./app/generateRecipe/RecipePreview.js";
import { UserProvider } from "../store/userContext.js";
import EditRecipe from "./app/recipes/EditRecipe.js";
import ErrorRecipePage from "./app/recipes/ErrorRecipePage.js";
import ResetPasswordModal from "./auth/ResetPasswordModal.js";
import LandingPage from "./auth/LandingPage.js";
import RecipeDetailLayout from "./app/recipes/RecipeDetailLayout.js";
import RecipeImageModal from "./app/recipes/RecipeImageModal.js";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
    children: [
      {
        index: true,
        element: <Welcome />,
      },
      {
        path: "auth",
        children: [
          {
            path: "login",
            element: <Login />,
            children: [
              { index: true, element: null },
              { path: "reset-password", element: <ResetPasswordModal /> },
            ],
          },
          { path: "signup", element: <Signup /> },
        ],
      },
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
          {
            path: ":id",
            id: "recipe",
            loader: RecipeByIdLoader,
            errorElement: <ErrorRecipePage />,
            shouldRevalidate: ({
              currentParams,
              nextParams,
              currentUrl,
              nextUrl,
            }) =>
              currentParams.id !== nextParams.id ||
              currentUrl.pathname !== nextUrl.pathname,

            children: [
              {
                element: <RecipeDetailLayout />,
                children: [
                  { index: true, element: null },
                  { path: "image", element: <RecipeImageModal /> },
                ],
              },
              { path: "edit", element: <EditRecipe /> },
            ],
          },
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
        loader: ProfileLoader,
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
