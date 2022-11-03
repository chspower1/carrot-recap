import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { withIronSessionApiRoute } from "iron-session/next";
import client from "@libs/server/client";

async function Confirm(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  const { token } = req.body;
  const exits = await client.token.findUnique({
    where: {
      payload: token,
    },
    include: {
      user: true,
    },
  });
  if (!exits) return res.status(400).end();
  req.session.user = {
    id: exits.userId,
  };
  await req.session.save();
  return res.status(200).end();
}
export default withIronSessionApiRoute(withHandler("POST", Confirm), {
  cookieName: "carrotsession",
  password:
    "2r1fk4hf1k4hfk31h4fk3lv1g3f4kfjh123lf4khk1g342fkl1g45klkjlklhkkjbbjkaawerWDFCFGC234fl1g24",
});
