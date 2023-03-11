import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function getUserOrders(req, res) {
    const userOrders = await prisma.user_order_table.findMany();
    res.json(userOrders)
}
