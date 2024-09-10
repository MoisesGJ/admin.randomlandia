"use server";


import { getAllProducts } from "@/app/_lib/mongo/adapter";

export async function getProducts() {
    const products = await getAllProducts()

    if (!products) return { error: { global: 'No existen productos:(' } }


    return products

}
