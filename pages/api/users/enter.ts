import { NextApiRequest, NextApiResponse } from "next";
import withHandler from "./../../../libs/server/withHandler";

async function getEnter(req: NextApiRequest, res: NextApiResponse) {
  try {
    res.status(200).end();
  } catch (err) {
    console.log(err);
  }
}
export default withHandler("POST", getEnter);
