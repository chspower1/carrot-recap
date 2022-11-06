import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  const {
    query: { id },
    session: { user },
  } = req;
  const isExists = await client.favorite.findFirst({
    where: {
      userId: user?.id,
      productId: Number(id),
    },
  });
  console.log(isExists);

  if (isExists) {
    //delete
    await client.favorite.delete({
      where: {
        id: isExists.id,
      },
    });
  } else {
    //create
    await client.favorite.create({
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
      },
    });
  }
  return res.json({ ok: true });
}
export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
  })
);
