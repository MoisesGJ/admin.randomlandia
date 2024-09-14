"use server";


import { getAllOrders, } from "@/app/_lib/mongo/adapter";

export async function getOrders() {
    const orders = await getAllOrders()

    if (!orders) return { error: { global: 'No existen ordenes:(' } }


    return orders

}



export async function createProduct() {
    /* const validation = await validationForm(formData)

    if (!validation.success) return validation;

    const newProduct = addProduct(validation.data)

    if (!validation) return { success: false, errors: { global: newProduct.error.message } };

    return { success: true }; */
}


export async function removeOrder(id) {
    const order = await deleteOrder(id)

    if (!order) return { success: false, errors: { global: order.error.message } };

    return { success: true };
}