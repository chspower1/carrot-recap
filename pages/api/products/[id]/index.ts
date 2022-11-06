import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  const {
    query: { id },
    session: { user },
  } = req;
  if (id) {
    const product = await client.product.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });
    const terms = await product?.name.split(" ");
    const relatedProducts = await client.product.findMany({
      where: {
        OR: terms?.map((term) => ({
          name: {
            contains: term,
          },
        })),
        AND: {
          id: {
            not: product?.id,
          },
        },
      },
    });
    const isLiked = Boolean(
      await client.favorite.findFirst({
        where: {
          productId: Number(id),
          userId: user?.id,
        },
        select: {
          id: true,
        },
      })
    );
    return res.json({ ok: true, product, relatedProducts, isLiked });
  }
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);
