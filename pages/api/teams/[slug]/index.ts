import type { NextApiRequest, NextApiResponse } from "next";

import { getSession } from "@/lib/session";
import { getTeam, isTeamMember } from "models/team";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case "GET":
      return handleGET(req, res);
    case "PUT":
      return handlePUT(req, res);
    default:
      res.setHeader("Allow", ["GET", "PUT"]);
      res.status(405).json({
        data: null,
        error: { message: `Method ${method} Not Allowed` },
      });
  }
}

// Get a team by slug
const handleGET = async (req: NextApiRequest, res: NextApiResponse) => {
  const { slug } = req.query;

  const session = await getSession(req, res);
  const userId = session?.user?.id as string;

  const team = await getTeam({ slug: slug as string });

  if (!isTeamMember(userId, team?.id)) {
    return res.status(400).json({
      data: null,
      error: { message: "Bad request." },
    });
  }

  return res.status(200).json({ data: team, error: null });
};

const handlePUT = async (req: NextApiRequest, res: NextApiResponse) => {
  // const tenantSlug = req.query.slug as string;
  // const { name, slug, domain } = req.body;
  // const tenant = await prisma.tenant.update({
  //   where: { slug: tenantSlug },
  //   data: { name, slug, domain },
  // });
  // return res.status(200).json({ data: tenant, error: null });
};
