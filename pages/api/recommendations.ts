import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function getRecommendations(req: NextApiRequest, res: NextApiResponse) {

  const recommendations = await prisma.recommendation.findMany();
  res.json(recommendations)
};