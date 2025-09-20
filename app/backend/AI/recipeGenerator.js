import OpenAI from "openai";
import {
  createUserPrompt,
  systemPrompt,
  systemPromptForSuggestions,
  systemPromptVisionIngredients,
} from "./recipeFormats.js";

const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

const MODEL = "gpt-4o-mini";

export const imageToIngredientsGenerator = async (imageUrl) => {
  console.log("3");
  const messages = [
    { role: "system", content: systemPromptVisionIngredients },
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "extract ingredients per the rules and output JSON only.",
        },
        { type: "image_url", image_url: { url: imageUrl } },
      ],
    },
  ];

  console.log("object");

  const response = await openai.chat.completions.create({
    model: MODEL,
    messages: messages,
    response_format: { type: "json_object" },
  });

  const raw = response.choices?.[0]?.message?.content?.trim() ?? "{}";
  return raw;
};

export const ManualRecipeGenerator = async (
  ingredients,
  constraints,
  history = null
) => {
  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: createUserPrompt(ingredients, constraints) },
  ];

  const response = await openai.chat.completions.create({
    model: MODEL,
    messages: messages,
    response_format: { type: "json_object" },
  });
  return response.choices[0].message.content;
};

export const AISuggestionsRecipeGenerator = async (
  constraints,
  history = null
) => {
  const messages = [
    { role: "system", content: systemPromptForSuggestions },
    { role: "user", content: createUserPrompt(null, constraints) },
  ];

  const response = await openai.chat.completions.create({
    model: MODEL,
    messages: messages,
    response_format: { type: "json_object" },
  });
  return response.choices[0].message.content;
};
