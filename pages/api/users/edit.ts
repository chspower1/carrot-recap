import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import smtpTransport from "@libs/server/email";
import { withApiSession } from "@libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  const {
    session: { user },
    body: { name, email, phone },
  } = req;
  console.log("aaaaaaaaaaaaaaaaa", user);
  const newUser = await client.user.update({
    where: {
      id: user?.id,
    },
    data: {
      name,
      email,
      phone,
    },
  });
  console.log(newUser);
  return res.json({ ok: true });
}
export default withApiSession(withHandler({ methods: ["POST"], handler }));
