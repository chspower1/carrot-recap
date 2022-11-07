import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  const {
    query: { id },
    session: { user },
  } = req;
  const communityId = Number(id);
  const isExists = await client.curious.findFirst({
    where: {
      userId: user?.id,
      communityId,
    },
    select: {
      id: true,
    },
  });

  if (isExists) {
    //delete
    await client.curious.delete({
      where: {
        id: isExists.id,
      },
    });
  } else {
    //create
    await client.curious.create({
      data: {
        user: {
          connect: {
            id: user?.id,
          },
        },
        community: {
          connect: {
            id: communityId,
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
