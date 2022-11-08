import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  //Request Info
  const {
    query: { id },
  } = req;
  // 해당 stream 추출
  const stream = await client.stream.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      product: true,
      user: true,
    },
  });
  if (!stream) {
    return res.status(404).json({ ok: false, message: "해당 라이브는 존재하지 않습니다!" });
  }

  return res.json({
    ok: true,
    stream,
  });
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);
