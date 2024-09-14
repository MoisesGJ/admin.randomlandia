import "server-only";

import { Binary, ObjectId } from "mongodb";
import { connectToDatabase } from "./connect";

export async function getUserFromUserName(username) {
  const { db } = await connectToDatabase();

  try {
    const user = await db.collection("users").findOne({ username: username });

    if (!user) {
      return false;
    }
    return {
      ...user,
      _id: user._id.toString(),
    };
  } catch (error) {
    console.error("Failed to retrieve user", error);
    throw error;
  }
}

export async function getUserFromDB(userId) {
  const { db } = await connectToDatabase();

  try {
    const objectId = new ObjectId(userId);

    const user = await db.collection("users").findOne({ _id: objectId });
    if (!user) {
      throw new Error(`User with ID ${objectId} not found`);
    }
    return {
      ...user,
      _id: user._id.toString(),
    };
  } catch (error) {
    console.error("Failed to retrieve user", error);
    throw error;
  }
}

export async function getUserPasskeys(userId) {
  const { db } = await connectToDatabase();

  try {
    const objectId = new ObjectId(userId);
    const passkeys = await db
      .collection("passkeys")
      .find({ user: objectId })
      .toArray();

    return passkeys;
  } catch (error) {
    console.error("Failed to retrieve passkeys", error);
    throw error;
  }
}

export async function getUserOnePasskey(keyId) {
  const { db } = await connectToDatabase();

  try {
    const passkey = await db.collection("passkeys").findOne({ id: keyId });

    if (!passkey) {
      throw new Error(`Passkey with ID ${keyId} not found`);
    }

    const publicKeyBuffer = passkey.publicKey.buffer;
    const publicKeyUint8Array = new Uint8Array(publicKeyBuffer);

    return {
      ...passkey,
      publicKey: publicKeyUint8Array,
    };
  } catch (error) {
    console.error("Failed to retrieve passkey", error);
    throw error;
  }
}

export async function saveNewPasskey(newPasskey) {
  const { db } = await connectToDatabase();

  try {
    if (newPasskey.publicKey instanceof Uint8Array) {
      newPasskey.publicKey = new Binary(Buffer.from(newPasskey.publicKey));
    } else {
      throw new Error("publicKey is not an instance of Uint8Array");
    }

    const result = await db.collection("passkeys").insertOne(newPasskey);
    return result;
  } catch (error) {
    console.error("Failed to save passkey", error);
    throw error;
  }
}

export async function getAllProducts() {
  const { db } = await connectToDatabase('randomland');

  try {
    const products = await db.collection("products").find({}).toArray();

    if (!products || products.length < 1) throw new Error(`No products found`);

    return products.map((product) => ({
      ...product,
      _id: product._id.toString(),
    })
    )
  } catch (error) {
    console.error("Failed to get all products", error);
    throw error;
  }
}

export async function addProduct(product) {
  const { db } = await connectToDatabase('randomland');

  try {
    const newProduct = await db.collection("products").insertOne(product);


    return newProduct
  } catch (error) {
    console.error("Failed to create product", error);
    throw error;
  }
}

export async function updateProduct(id, product) {
  const { db } = await connectToDatabase('randomland');

  try {
    const result = await db.collection("products").updateOne(
      { _id: new ObjectId(id) },
      { $set: product }
    );

    if (result.matchedCount === 0) {
      throw new Error('Product not found');
    }

    return result;
  } catch (error) {
    console.error("Failed to update product", error);
    throw error;
  }
}

export async function deleteProduct(id, product) {
  const { db } = await connectToDatabase('randomland');

  try {
    const result = await db.collection("products").deleteOne(
      { _id: new ObjectId(id) },
      { $set: product }
    );

    if (result.matchedCount === 0) {
      throw new Error('Product not found');
    }

    return result;
  } catch (error) {
    console.error("Failed to update product", error);
    throw error;
  }
}

export async function getAllOrders() {
  const { db } = await connectToDatabase('randomland');

  try {
    const orders = await db.collection("orders").aggregate([
      {
        $unwind: { path: "$items" }
      },
      {
        $addFields: {
          itemsId: { $toObjectId: "$items.id" }
        }
      },
      {
        $lookup: {
          from: "products",
          localField: "itemsId",
          foreignField: "_id",
          as: "productDetails"
        }
      },
      {
        $unwind: { path: "$productDetails" }
      },
      {
        $addFields: {
          "items.name": "$productDetails.name",
          "items.images": "$productDetails.images",
          "items.price": "$productDetails.price"
        }
      },
      {
        $addFields: {
          _id: { $toString: "$_id" }
        }
      },
      {
        $group: {
          _id: "$_id",
          email: { $first: "$email" },
          totalAmount: { $first: "$totalAmount" },
          order: { $first: "$order" },
          createdAt: { $first: "$createdAt" },
          status: { $first: "$status" },
          items: {
            $push: {
              id: "$items.id",
              name: "$items.name",
              price: "$items.price",
              count: "$items.count",
              images: "$items.images"
            }
          },
        }
      }
    ]).toArray();


    if (!orders || orders.length < 1) throw new Error(`No orders found`);

    return orders.map((order) => ({
      ...order,
      _id: order._id.toString(),
    })
    )
  } catch (error) {
    console.error("Failed to get all orders", error);
    throw error;
  }
}