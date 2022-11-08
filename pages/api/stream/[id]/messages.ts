import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  // POST Request
  //Request Info
  const {
    body: { message },
    query: { id },
    session: { user },
  } = req;
  if (req.method === "POST") {
    // create message
    const newMessage = await client.streamMessage.create({
      data: {
        user: {
          connect: {
            id: user?.id,
          },
        },
        stream: {
          connect: {
            id: Number(id),
          },
        },
        message,
      },
    });

    //정상 리턴
    return res.json({ ok: true });
  }

  // GET Request
  if (req.method === "GET") {
    return;
  }
}

export default withApiSession(
  withHandler({
    methods: ["POST", "GET"],
    handler,
  })
);
