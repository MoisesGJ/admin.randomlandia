"use server";

import { z } from "zod";

const user = process.env.USER;
const password = process.env.PASSWORD;

const allowedTopics = [
  "ciencias",
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
const arraySchema = z.array(schema);

export async function createSandia(formData) {
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

  try {
    const state = await create(user, password, validation.data);

    if (state.error) return { success: false, errors: { global: state.error } };

    return { success: true };

  } catch (error) {
    return { success: false, errors: { global: error.message } };
  }

}

export async function createManySandias(sandias) {
  try {
    const convertedFormDataArray = sandias.map((item) => {
      if (item.answer === "true") {
        return {
          ...item,
          answer: true,
        };
      } else if (item.answer === "false") {
        return {
          ...item,
          answer: false,
        };
      } else {
        throw new Error(`Valor de respuesta inválida en la pregunta: ${item.question}. Se espera "true" o "false".`);
      }
    });

    const parsedData = arraySchema.parse(convertedFormDataArray);
    const state = await create(user, password, parsedData, true);

    if (state.error) return { success: false, errors: { global: state.error } };

    return { success: true, };
  } catch (e) {
    console.error(e);
    return { success: false, errors: { global: e.message } };
  }
}

async function create(user, password, data, many) {
  const APISandias = `${process.env.API}sandias/${many ? "many" : ""}`;

  try {
    const credentials = btoa(`${user}:${password}`);
    const r = await fetch(APISandias, {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": `${many ? "text/plain" : "application/json"}`,
      },
      body: JSON.stringify(data),
    });

    const response = await r.json();

    if (!response.success) return { error: response.message };

    return true;
  } catch (error) {
    return { error: error.message };
  }
}
