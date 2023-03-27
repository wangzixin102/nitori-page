import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function getSKUImg(req: NextApiRequest, res: NextApiResponse) {

    const SKUImg = await prisma.sku_image.findMany();
    res.json(SKUImg)
};