import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function getProducts(req: NextApiRequest, res: NextApiResponse) {

    const products = await prisma.products.findMany();
    res.json(products)
};