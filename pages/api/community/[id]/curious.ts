import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  // Request info
  const {
    query: { id },
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

  // 궁금해요 클릭 여부
  const isExists = await client.curious.findFirst({
    where: {
      userId: user?.id,
      communityId,
    },
    select: {
      id: true,
    },
  });

  // 이미 클릭했으면
  if (isExists) {
    //delete
    await client.curious.delete({
      where: {
        id: isExists.id,
      },
    });
  }
  // 클릭을 안했으면
  else {
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
