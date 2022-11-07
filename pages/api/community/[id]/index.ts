import withHandler from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Request info
  const {
    query: { id },
    session: { user },
  } = req;
  const communityId = Number(id);

  // 해당 커뮤니티가 존재하는지
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

  // 존재하지 않는 커뮤니티라면 404 리턴
  if (!community) return res.status(404);

  // 댓글 정보
  const replies = await client.reply.findMany({
    where: {
      communityId,
    },
    select: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
      description: true,
    },
  });

  // 궁금해요 클릭 여부
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

  // 정상 리턴
  return res.json({ ok: true, community, replies, isCurious });
}
export default withApiSession(withHandler({ methods: ["GET"], handler }));
