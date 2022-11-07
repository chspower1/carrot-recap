import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  if (req.method === "POST") {
    const {
      session: { user },
      body: { question, latitude, longitude },
    } = req;
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
    return res.json({ ok: true, community });
  }
  if (req.method === "GET") {
    const {
      query: { latitude: latitudeStr, longitude: longitudeStr },
    } = req;
    const [latitude, longitude] = [Number(latitudeStr), Number(longitudeStr)];
    console.log(latitude, longitude);
    if (latitude && longitude) {
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
      return res.json({ ok: true, communities });
    }
  }
}

export default withApiSession(
  withHandler({
    methods: ["POST", "GET"],
    handler,
  })
);
