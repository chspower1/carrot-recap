import { NextApiRequest } from "next";
import { NextApiResponse } from "next";

export interface ResponseType {
  ok: boolean;
  [key: string]: any;
}
interface Config {
  method: "GET" | "POST" | "DELETE" | "PUT";
  handler: (req: NextApiRequest, res: NextApiResponse) => void;
  isPrivate?: boolean;
}
export default function withHandler({ method, handler, isPrivate = true }: Config) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== method) {
      return res.status(405).end();
    }
    if (isPrivate && !req.session.user) {
      return res.status(401).json({ ok: false, message: "로그인이 필요합니다!" });
    }
    try {
      await handler(req, res);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ err });
    }
  };
}
