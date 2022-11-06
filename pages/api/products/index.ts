import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";
import favorite from "./[id]/favorite";

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  if (req.method === "POST") {
    const {
      body: { name, price, description },
      session: { user },
    } = req;
    const product = await client.product.create({
      data: {
        name,
        price: +price,
        description,
        image: "xx",
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });
    console.log(product);
    return res.status(200).json({
      ok: true,
      product: product,
    });
  }
  if (req.method === "GET") {
    const products = await client.product.findMany({
      include: {
        _count: {
          select: {
            favorites: true,
          },
        },
      },
    });
    return res.json({
      ok: true,
      products,
    });
  }
}

export default withApiSession(
  withHandler({
    methods: ["POST", "GET"],
    handler,
  })
);
