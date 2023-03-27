import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function getProductImgs(req: NextApiRequest, res: NextApiResponse) {

    const productImgs = await prisma.product_image.findMany();
    res.json(productImgs)
};