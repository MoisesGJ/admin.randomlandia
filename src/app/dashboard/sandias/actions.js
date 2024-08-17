"use server";

import { z } from "zod";

export async function createSandia(formData) {
  const allowedTopics = [
    "ciencia",
    "deportes",
    "nerd",
    "idiomas",
    "matematicas",
    "artes",
    "mundo",
    "vida",
  ];

  const schema = z.object({
    topic: z.enum(allowedTopics, {
      message: "Debe seleccionar un tema válido",
    }),
    content: z.string().min(2, {
      message: "El contenido debe tener al menos 2 caracteres.",
    }),
    question: z
      .string()
      .min(2, { message: "La pregunta debe tener al menos 2 caracteres." }),
    answer: z.boolean(),
    reference: z
      .string()
      .min(2, { message: "La referencia debe tener al menos 2 caracteres." }),
  });

  const validation = schema.safeParse({
    topic: formData.get("topic"),
    content: formData.get("content"),
    question: formData.get("question"),
    answer: formData.has("answer"),
    reference: formData.get("reference"),
  });

  if (!validation.success) {
    const errors = validation.error.issues.reduce((acc, issue) => {
      acc[issue.path[0]] = issue.message;
      return acc;
    }, {});

    return { success: false, errors };
  }

  const user = process.env.USER;
  const password = process.env.PASSWORD;

  const state = await create(user, password, validation.data);

  if (state.error) return { success: false, errors: { global: state.error } };

  return { success: true };
}

async function create(user, password, data) {
  const APISandias = process.env.API + "sandias/";

  try {
    const credentials = btoa(`${user}:${password}`);
    const r = await fetch(APISandias, {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    });

    const response = await r.json();

    console.log(response);
    if (!response.success) return { error: response.message };

    return true;
  } catch (error) {
    return { error: error.message };
  }
}
