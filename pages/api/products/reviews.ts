import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function getProducts(req: NextApiRequest, res: NextApiResponse) {

    const reviews = await prisma.review.findMany();
    res.json(reviews)
};