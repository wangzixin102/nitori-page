import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function getCategories(req: NextApiRequest, res: NextApiResponse) {

    const categories = await prisma.category.findMany();
    res.json(categories)
};