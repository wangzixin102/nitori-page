import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function getCategories(req: NextApiRequest, res: NextApiResponse) {
  const categories = await prisma.category.findMany();

  const buildNestedCategories = (categories: any[], parentId = 'null') => {
    const childCategories = categories.filter(category => category.parentId === parentId);
    if (childCategories.length === 0) {
      return [];
    }
    const nestedCategories = childCategories.map(category => {
      return {
        ...category,
        children: buildNestedCategories(categories, category.categoryId),
      };
    });
      return nestedCategories;
  };
  
  const nestedCategories = buildNestedCategories(categories);
  res.json(nestedCategories);
}
