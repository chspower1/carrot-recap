import { NextApiRequest, NextApiResponse } from "next";
export default async function getEnter(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log("enter api 작동", req.body.email);
    res.status(200).end();
  } catch (err) {
    console.log(err);
  }
}
