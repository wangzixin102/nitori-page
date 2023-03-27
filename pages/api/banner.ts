import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function getBannerSlides(req: NextApiRequest, res: NextApiResponse) {

    const bannerSlides = await prisma.banner.findMany();
    res.json(bannerSlides)
};