import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function getBannerSlides(req, res) {
    const bannerSlides = await prisma.banner.findMany();
    res.json(bannerSlides)
};