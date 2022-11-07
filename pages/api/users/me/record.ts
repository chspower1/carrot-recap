import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";
import { Kind } from "@prisma/client";

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  // Requser Info
  const {
    session: { user },
    query: { kind: kindGuide },
  } = req;
  const kind = kindGuide as Kind;
  const records = await client.record.findMany({
    where: {
      kind,
      userId: user?.id,
    },
    include: {
      product: {
        include: {
          _count: {
            select: {
              records: {
                where: {
                  kind: "Favorite",
                },
              },
            },
          },
        },
      },
    },
  });
  return res.json({
    ok: true,
    records,
  });
}
export default withApiSession(withHandler({ methods: ["GET"], handler }));
