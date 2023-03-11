import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function getCategories(req, res) {
    const categories = await prisma.category.findMany();
    res.json(categories)
};