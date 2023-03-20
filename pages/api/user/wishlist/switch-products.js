import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function deleteProdut(req, res) {
    if (req.method === "POST") {
        const { data, listName } = req.body
        const skuIds = data.map((product) => product.sku_id);

        try {
            if (data.length > 0) {
                const result = await prisma.favourite_products.updateMany({
                    where: {
                        sku_id: { in: skuIds }
                    },
                    
                    data: { 
                        list_name: listName
                    },
                });
                res.status(200).json({ message: 'products switch successfully' }); 
            } else {
                res.status(400).json({ error: '移動するお気に入り商品を1つ以上選択してください。'});
            }
        } catch (error) {
            console.log('aaaaaaa', error)
            res.status(500).json({ message: 'Error switching products' });
        } 
    }
}