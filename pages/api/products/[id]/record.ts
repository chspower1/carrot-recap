import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";
import { Kind } from "@prisma/client";

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  //Request Info
  const {
    query: { id, kind: kindGuide },
    session: { user },
  } = req;
  const kind = kindGuide as Kind;
  const productId = Number(id);
  console.log(productId, kind);
  // 좋아요 버튼 클릭 여부
  const isExists = await client.record.findFirst({
    where: {
      kind,
      userId: user?.id,
      productId: productId,
    },
  });

  // 좋아요 버튼을 이미 클릭한 상태라면
  if (isExists) {
    //delete
    await client.record.delete({
      where: {
        id: isExists.id,
      },
    });
  }
  // 좋아요 버튼을 클릭하지 않은 상태라면
  else {
    //create
    await client.record.create({
      data: {
        user: {
          connect: {
            id: user?.id,
          },
        },
        product: {
          connect: {
            id: Number(id),
          },
        },
        kind,
      },
    });
  }
  // 정상 리턴
  return res.json({ ok: true });
}
export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
  })
);
