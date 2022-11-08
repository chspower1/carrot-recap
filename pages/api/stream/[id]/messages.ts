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
  const streamId = Number(id);
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
            id: streamId,
          },
        },
        message,
      },
    });
    console.log(newMessage);
    //정상 리턴
    return res.json({ ok: true });
  }

  // GET Request
  if (req.method === "GET") {
    const messages = await client.streamMessage.findMany({
      where: {
        streamId,
      },
      select: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        id: true,
        message: true,
        createAt: true,
      },
    });
    return res.json({ ok: true, messages });
  }
}

export default withApiSession(
  withHandler({
    methods: ["POST", "GET"],
    handler,
  })
);
