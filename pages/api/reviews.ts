import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  // Request Info
  const {
    session: { user },
  } = req;
  // Reviews 목록 추출
  const reviews = await client.review.findMany({
    where: {
      createForId: user?.id,
    },
    include: {
      createBy: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });
  console.log(user, reviews);
  // 정상 리턴
  return res.json({
    ok: true,
    reviews,
  });
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);
