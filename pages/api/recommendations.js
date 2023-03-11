import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function getRecommendations(req, res) {
  const recommendations = await prisma.recommendation.findMany();
  res.json(recommendations)
};