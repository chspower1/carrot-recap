import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  const id = req.session.user;
  console.log(req.session.user);
  return res.json({
    ok: true,
    profile: await client.user.findUnique({ where: id! }),
  });
}
export default withApiSession(withHandler({ method: "GET", handler }));
