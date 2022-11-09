import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  //Request Info
  const {
    body: { name, price, description, image },
    session: { user },
    query: { page },
  } = req;
  // POST Request
  if (req.method === "POST") {
    // product 생성
    const product = await client.product.create({
      data: {
        name,
        price: +price,
        description,
        image,
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });
    //정상 리턴
    return res.status(200).json({ ok: true, product });
  }
  // GET Request
  if (req.method === "GET") {
    // Product 목록 추출
    const products = await client.product.findMany({
      take: 7,
      skip: (Number(page) - 1) * 7,
      include: {
        _count: {
          select: {
            records: {
              where: {
                kind: "Favorite",
              },
            },
          },
        },
      },
    });
    // 정상 리턴
    const countProducts = await client.product.count();
    return res.json({
      ok: true,
      products,
      countProducts,
    });
  }
}

export default withApiSession(
  withHandler({
    methods: ["POST", "GET"],
    handler,
  })
);
