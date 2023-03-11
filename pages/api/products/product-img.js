import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function getProductImgs(req, res) {
    const productImgs = await prisma.product_image.findMany();
    res.json(productImgs)
};