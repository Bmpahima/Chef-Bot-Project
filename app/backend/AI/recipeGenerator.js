import OpenAI from "openai";
import {
  createUserPrompt,
  systemPrompt,
  systemPromptForSuggestions,
  systemPromptVisionIngredients,
  systemPromptImageGen,
  generatePathName,
} from "./recipeFormats.js";
import { cloudinary } from "../services/cloudinary.js";

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

  const response = await openai.chat.completions.create({
    model: MODEL,
    messages: messages,
    response_format: { type: "json_object" },
  });

  const raw = response.choices?.[0]?.message?.content?.trim() ?? "{}";
  return raw;
};

export const generateRecipeImage = async (name, ingredients) => {
  try {
    if (!name || !ingredients) {
      throw new Error("Invalid Inputs, failed to generate image.");
    }

    const ingsNames = ingredients.map((ing) => ing.ingredientName);
    const prompt = systemPromptImageGen(name, ingsNames);

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      size: "1024x1024",
      n: 1,
    });

    if (!response || !response.data) {
      throw new Error("Failed to generate recipe AI image.");
    }

    const imageUrl = response.data[0].url;
    const uploaded = await cloudinary.uploader.upload(imageUrl, {
      folder: "chef-bot/generated",
      public_id: generatePathName(name),
      overwrite: true,
    });

    console.log(uploaded);

    return {
      ok: true,
      message: "Image uploaded to Cloudinary.",
      path: uploaded.secure_url,
    };
  } catch (error) {
    return {
      ok: false,
      message: error.message || "Failed to generate recipe AI image.",
      path: "",
    };
  }
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
