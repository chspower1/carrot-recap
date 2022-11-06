import withHandler from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import community from "..";
async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id: communityId },
    body: { description },
    session: { user },
  } = req;
  console.log(communityId, description, user);
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
