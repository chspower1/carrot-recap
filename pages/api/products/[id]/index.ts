import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  // Request Info
  const {
    query: { id },
    session: { user },
  } = req;
  const productId = Number(id);

  // 해당 product가 있는지 확인
  const product = await client.product.findUnique({
    where: {
      id: productId,
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
  // 만약 없다면 404 리턴
  if (!product) return res.status(404).json({ ok: false, message: "존재하지 않는 상품입니다." });

  // product 이름 공백 기준으로 쪼개기
  const terms = await product?.name.split(" ");

  // 관련성이 있는 product 목록 추출
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

  // 좋아요 클릭 여부
  const isLiked = Boolean(
    await client.record.findFirst({
      where: {
        productId,
        userId: user?.id,
        kind: "Favorite",
      },
      select: {
        id: true,
      },
    })
  );

  // 정상 리턴
  return res.json({ ok: true, product, relatedProducts, isLiked });
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);
