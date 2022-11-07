import withHandler from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import community from "..";
async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Request info
  const {
    query: { id },
    body: { description },
    session: { user },
  } = req;
  const communityId = Number(id);

  // 해당 커뮤니티가 존재 하는지
  const community = await client.community.findUnique({
    where: {
      id: communityId,
    },
    select: {
      id: true,
    },
  });
  // 만약 존재하지 않는다면 404 리턴
  if (!community) return res.status(404);

  // 댓글 업로드
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

  // 정상 리턴
  return res.json({ ok: true, reply });
}

export default withApiSession(withHandler({ methods: ["POST"], handler }));
