import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Welcome from "./auth/Welcome.js";
import Login from "./auth/Login.js";
import Signup from "./auth/Signup.js";
import Dashboard from "./app/Dashboard.js";

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
          { path: "all", element: null },
          { path: ":id", element: null },
        ],
      },
      {
        path: "create",
        element: null,
        children: [
          { path: "upload", element: null },
          { path: "review", element: null },
          { path: "constraints", element: null },
          { path: "generate", element: null },
          { path: "publish", element: null },
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
