import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

async function Get(req: NextApiRequest, res: NextApiResponse) {
  const users = await prisma.user.findMany();
  return res.status(200).json(users);
}

async function Post(req: NextApiRequest, res: NextApiResponse) {
  const { name, email } = req.body;
  const user = await prisma.user.create({
    data: {
      name,
      email,
    },
  });
  return res.status(200).json(user);
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Filter out if the reuqest is a Put or a GET
  switch (req.method) {
    case 'GET':
      return Get(req, res);
    case 'POST':
      return Post(req, res);
    default:
      return res.status(405).end();
  }
};
