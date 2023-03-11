import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function getSKUImg(req, res) {
    const SKUImg = await prisma.sku_image.findMany();
    res.json(SKUImg)
};