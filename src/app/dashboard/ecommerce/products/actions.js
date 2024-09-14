"use server";

import { z } from "zod";

import { getAllProducts, addProduct, updateProduct, deleteProduct } from "@/app/_lib/mongo/adapter";

export async function getProducts() {
    const products = await getAllProducts()

    if (!products) return { error: { global: 'No existen productos:(' } }


    return products

}

const urlRegex = new RegExp(
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)/
);
const schema = z.object({
    name: z.string().min(3, { message: "El nombre es obligatorio" }),
    description: z.string().min(3, { message: "La descripción es obligatoria" }),
    price: z.preprocess(
        (val) => Number(val),
        z.number().positive({ message: "El precio debe ser un número positivo" })
    ),
    images: z.string().refine((images) => {
        const urls = images.split(',').map(image => image.trim());
        return urls.every(url => urlRegex.test(url));
    }, { message: "Las imágenes deben ser URLs válidas separadas por comas" }).transform((images) => {
        return images.split(',').map(image => image.trim());
    }),
    category: z.string().min(3, { message: "La categoría es obligatoria" })
});


async function validationForm(formData) {
    const validation = schema.safeParse(formData);

    if (!validation.success) {
        const errors = validation.error.issues.reduce((acc, issue) => {
            acc[issue.path[0]] = issue.message;
            return acc;
        }, {});


        return { success: false, errors };
    }

    return { success: true, data: validation.data };
}

export async function createProduct(formData) {
    const validation = await validationForm(formData)

    if (!validation.success) return validation;

    const newProduct = addProduct(validation.data)

    if (!validation) return { success: false, errors: { global: newProduct.error.message } };

    return { success: true };
}

export async function editProduct(id, formData) {
    const validation = await validationForm(formData)

    if (!validation.success) return validation;

    const editProduct = updateProduct(id, validation.data)

    if (!editProduct) return { success: false, errors: { global: editProduct.error.message } };

    return { success: true };

}

export async function removeProduct(id) {
    const product = await deleteProduct(id)

    if (!product) return { success: false, errors: { global: product.error.message } };

    return { success: true };
}