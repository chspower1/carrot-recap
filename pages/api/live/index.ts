import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  // POST Request
  if (req.method === "POST") {
    //Request Info
    const {
      body: { name, price, description },
      session: { user },
    } = req;

    // product 생성
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
    const stream = await client.stream.create({
      data: {
        product: {
          connect: {
            id: product.id,
          },
        },
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
      select: {
        id: true,
      },
    });
    //정상 리턴
    console.log(stream);
    return res.status(200).json({ ok: true, stream });
  }
  // GET Request
  if (req.method === "GET") {
    // Product 목록 추출
    const streams = await client.stream.findMany({
      include: {
        user: true,
        product: {
          select: {
            name: true,
            price: true,
          },
        },
      },
    });
    // 정상 리턴
    return res.json({
      ok: true,
      streams,
    });
  }
}

export default withApiSession(
  withHandler({
    methods: ["POST", "GET"],
    handler,
  })
);
