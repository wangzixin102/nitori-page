import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function getUserOrders(req: NextApiRequest, res: NextApiResponse) {
    const userOrders = await prisma.user_order_table.findMany();
    res.json(userOrders)
}
