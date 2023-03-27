import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function getQAData(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { product_id, question, question_use_email } = req.body;
    const question_date = new Date(); 

    const qa_table = await prisma.qa_table.findMany({
      where: {
        product_id: product_id,
      },
    });
    const qa_id = `qa${product_id}-${qa_table.length + 1}`;

    try {
      const result = await prisma.qa_table.create({
        data: {
          QA_id: qa_id,
          product_id: product_id,
          question: question,
          question_date: question_date,
          question_user_email: question_use_email,
          show_on_page: 1,
        },
      });
      res.status(200).json({ message: 'Question posted successfully' });
    } catch (error) {
      console.log('aaaaaaa', error)
      res.status(500).json({ message: 'Error posting question' });
    }
  } else {
    const productId = req.query.id as string;
    const page = Number(req.query.page) || 1;    
    const pageSize = 3;
    const skipAmounts = page ? (page - 1) * pageSize : 0;    
    const orderBy = req.query.orderBy;

    let orderByValue = {};

    if (orderBy === "question_date") {
      orderByValue = {
        question_date: "desc",
      };
    } else if (orderBy === "helpful_count") {
      orderByValue = {
        helpful_count: "desc",
      };
    }

    const QADatas = await prisma.qa_table.findMany({
      where: {
        product_id: productId,
        show_on_page: 0
      },
      skip: skipAmounts,
      take: pageSize,
      orderBy: orderByValue,
    });

    const count = await prisma.qa_table.count({
      where: {
        product_id: productId,
        show_on_page: 0,
      },
    });

    const totalPages = Math.ceil(count / pageSize);

    if (QADatas.length === 0) {
      return res.status(404).json({ message: "Data not found" });
    }
    res.json({ QADatas, totalPages, count });
  }
}
