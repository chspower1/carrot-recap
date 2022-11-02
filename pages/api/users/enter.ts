import { NextApiRequest, NextApiResponse } from "next";
import withHandler from "@libs/server/withHandler";
import client from "@libs/server/client";

async function getEnter(req: NextApiRequest, res: NextApiResponse) {
  const { email, phone } = req.body;
  const payload = phone ? { phone: +phone } : { email };
  const user = await client.user.upsert({
    where: {
      ...payload,
    },
    create: {
      ...payload,
      name: "Anonymous",
    },
    update: {},
  });
  const token = await client.token.create({
    data: {
      payload: "12356",
      user: {
        connect: {
          id: user.id,
        },
      },
    },
  });
  console.log(token);
  console.log(user);
  return res.status(200).end();
}
export default withHandler("POST", getEnter);
