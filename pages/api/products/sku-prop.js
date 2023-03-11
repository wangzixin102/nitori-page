import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function getSKUProp(req, res) {
    const SKUProp = await prisma.prop_table.findMany();
    res.json(SKUProp)
};