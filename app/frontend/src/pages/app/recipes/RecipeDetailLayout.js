import RecipeDetail from "./RecipeDetail.js";

import { Outlet } from "react-router-dom";

export default function RecipeDetailLayout() {
  return (
    <>
      <RecipeDetail />
      <Outlet />
    </>
  );
}
