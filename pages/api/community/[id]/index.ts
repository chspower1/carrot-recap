import withHandler from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    session: { user },
  } = req;
  const communityId = Number(id);
  console.log(id);
  if (communityId) {
    const community = await client.community.findUnique({
      where: {
        id: communityId,
      },
      include: {
        user: {
          select: {
            name: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            curious: true,
          },
        },
      },
    });
    const replies = await client.reply.findMany({
      where: {
        communityId,
      },
      select: {
        user: {
          select: {
            name: true,
            avatar: true,
          },
        },
        description: true,
      },
    });
    const isCurious = Boolean(
      await client.curious.findFirst({
        where: {
          userId: user?.id,
          communityId,
        },
        select: {
          id: true,
        },
      })
    );

    console.log(community, replies, isCurious);
    return res.json({ ok: true, community, replies, isCurious });
  }
}
export default withApiSession(withHandler({ methods: ["GET"], handler }));
