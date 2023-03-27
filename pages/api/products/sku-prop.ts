import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function getSKUProp(req: NextApiRequest, res: NextApiResponse) {

    const SKUProp = await prisma.prop_table.findMany();
    res.json(SKUProp)
};