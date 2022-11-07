import withHandler from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import community from "..";
async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    body: { description },
    session: { user },
  } = req;
  const communityId = Number(id);
  console.log(communityId, description, user);
  const community = await client.community.findUnique({
    where: {
      id: communityId,
    },
    select: {
      id: true,
    },
  });
  if (!community) return res.status(404);
  const reply = await client.reply.create({
    data: {
      description,
      user: {
        connect: {
          id: user?.id,
        },
      },
      community: {
        connect: {
          id: Number(communityId),
        },
      },
    },
  });
  console.log(reply);
  return res.json({ ok: true, reply });
}

export default withApiSession(withHandler({ methods: ["POST"], handler }));
