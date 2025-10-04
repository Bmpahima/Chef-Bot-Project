export const getBadges = (recipe) => {
  return [
    recipe.difficulty,
    ...(recipe.cuisine || []),
    ...(recipe.flavors || []),
    recipe.kosher ? "Kosher" : undefined,
    recipe.vegetarian ? "Vegetarian" : undefined,
  ].filter(Boolean);
};
