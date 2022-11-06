import withHandler from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  console.log(id);
  if (id) {
    const community = await client.community.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        user: {
          select: {
            name: true,
            avatar: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        _count: {
          select: {
            replies: true,
            curious: true,
          },
        },
      },
    });
    console.log(community);
    return res.json({ ok: true, community });
  }
}
export default withApiSession(withHandler({ methods: ["GET"], handler }));
