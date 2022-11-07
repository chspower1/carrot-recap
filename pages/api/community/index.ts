import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  // POST Request
  if (req.method === "POST") {
    // Request Info
    const {
      session: { user },
      body: { question, latitude, longitude },
    } = req;

    // 커뮤니티 생성
    const community = await client.community.create({
      data: {
        question,
        latitude,
        longitude,
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });

    // 정상 리턴
    return res.json({ ok: true, community });
  }
  // GET Request
  if (req.method === "GET") {
    // Request Info
    const {
      query: { latitude: latitudeStr, longitude: longitudeStr },
    } = req;
    const [latitude, longitude] = [Number(latitudeStr), Number(longitudeStr)];

    // 가까운 커뮤니티글
    const communities = await client.community.findMany({
      where: {
        latitude: {
          gte: latitude - 0.01,
          lte: latitude + 0.01,
        },
        longitude: {
          gte: longitude - 0.01,
          lte: longitude + 0.01,
        },
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            curious: true,
            replies: true,
          },
        },
      },
    });

    // 정상 리턴
    return res.json({ ok: true, communities });
  }
}

export default withApiSession(
  withHandler({
    methods: ["POST", "GET"],
    handler,
  })
);
