import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function getProductSKU(req: NextApiRequest, res: NextApiResponse) {

    const productSKU = await prisma.sku_table.findMany();
    res.json(productSKU)
};