import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import smtpTransport from "@libs/server/email";

async function Confirm(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  const { token } = req.body;
  if (!token) return res.status(400).json({ ok: false });
  console.log(token);
  return res.status(200).end();
}
export default withHandler("POST", Confirm);
