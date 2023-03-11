import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function getProducts(req, res) {
    const products = await prisma.products.findMany();
    res.json(products)
};