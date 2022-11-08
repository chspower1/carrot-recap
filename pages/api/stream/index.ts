import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  if (req.method === "POST") {
    //Request Info
    const {
      body: { name, price, description, isNew, productId },
      session: { user },
    } = req;
    // 새로운 상품으로 stream 생성
    if (isNew) {
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
    // 기존에 있던 상품으로 stream 생성
    else {
      const stream = await client.stream.create({
        data: {
          user: {
            connect: {
              id: user?.id,
            },
          },
          product: {
            connect: {
              id: productId,
            },
          },
        },
      });
      return res.json({ ok: true, stream });
    }
  }

  if (req.method === "GET") {
    const {
      query: { page },
    } = req;
    // Product 목록 추출
    const streams = await client.stream.findMany({
      take: 5,
      skip: Number(page) * 5,
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
    const countStream = await client.stream.count();
    console.log(countStream);
    // 정상 리턴
    return res.json({
      ok: true,
      streams,
      countStream,
    });
  }
}

export default withApiSession(
  withHandler({
    methods: ["POST", "GET"],
    handler,
  })
);
