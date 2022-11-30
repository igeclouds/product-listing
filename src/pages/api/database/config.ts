import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

async function Post(req: NextApiRequest, res: NextApiResponse) {
  const { name, darkMode }: { name: string; darkMode: boolean } = req.body;
  const config = await prisma.config.create({
    include: {
      globals: true,
    },
    data: {
      name,
      globals: {
        create: {
          darkMode,
        },
      },
    },
  });
  return res.status(200).json(config);
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Filter out if the reuqest is a Put or a GET
  switch (req.method) {
    case 'POST':
      return Post(req, res);
    default:
      return res.status(405).end();
  }
};
