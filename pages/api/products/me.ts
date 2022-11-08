import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  // Request Info
  const {
    session: { user },
  } = req;
  console.log(user);
  // Product 목록 추출
  const products = await client.product.findMany({
    where: {
      userId: user?.id,
    },
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
  return res.json({
    ok: true,
    products,
  });
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);
