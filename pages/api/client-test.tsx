import { NextApiRequest, NextApiResponse } from "next";
import client from "../../libs/server/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await client.user.create({
      data: {
        email: "test22",
        name: "chs",
      },
    });
    res.json({ data: "CREATE" });
  } catch (err) {
    console.log(err);
  }
}
