import { NextApiRequest } from "next";
import { NextApiResponse } from "next";

export default function withHandler(
  method: "GET" | "POST" | "DELETE" | "PUT",
  fn: (req: NextApiRequest, res: NextApiResponse) => void
) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    return res.json({ hi: "hello" });
  };
}
