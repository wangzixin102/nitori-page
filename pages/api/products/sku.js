import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function getProductSKU(req, res) {
    const productSKU = await prisma.sku_table.findMany();
    res.json(productSKU)
};