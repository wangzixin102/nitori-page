import axios from "axios";

export const getCategoryData = async (parentCategory: string, childCategory: string) => {
    const categories = await axios.get('/api/categoryPage')
    const products = await axios.get('/api/products/products');
    const sku = await axios.get('/api/products/sku');
    const skuImg = await axios.get('/api/products/sku-img');
    const skuProp = await axios.get("/api/products/sku-prop");
    const reviews = await axios.get('/api/products/reviews')

    // Filter the data to only include the product with the given ID
    const category = categories.data.filter((c: { categoryId: string; }) => c.categoryId === parentCategory)
    const product = products.data.filter((p: { category_id: string; }) => p.category_id === childCategory);
    const productIds = product.map((p: { product_id: string }) => p.product_id);
    const skuData = sku.data.filter((s: { product_id: string }) => productIds.includes(s.product_id));
    const skuImgData = skuImg.data.filter((si: { product_id: string; }) => productIds.includes(si.product_id));
    const skuPropData = skuProp.data.filter((sp: { product_id: string; }) => productIds.includes(sp.product_id));
    const review = reviews.data.filter((rv: { product_id: string; }) => productIds.includes(rv.product_id));

    const findCategory = (categoryId: string, categories: any[]) => {
        for (const category of categories) {
          if (category.categoryId === categoryId) {
            return category;
          }
          const nestedCategory = findCategory(categoryId, category.children);
          if (nestedCategory) {
            return nestedCategory;
          }
        }
        return null;
    };

    function mapSkuPropsToNames(
        sku: { [key: string]: any }[], 
        skuProp: { product_id: string, prop_name: string, prop_id: string }[], 
        productIdKey: string, 
    ) {
        const mappedPropsArr: { [key: string]: any }[] = sku.map((skuItem) => {
            const mappedProps: { [key: string]: any } = { product_id: skuItem[productIdKey] };
            const skuPropData = skuProp.filter((sp) => sp.product_id === skuItem[productIdKey]);
        
            skuPropData.forEach((prop) => {
                const propName = prop.prop_name;
                const propId = prop.prop_id;
                if (skuItem[propId] !== undefined) {
                mappedProps[propName] = skuItem[propId];
                }
            });
            return mappedProps;
        });
        return mappedPropsArr.filter((mappedProps) => Object.keys(mappedProps).length !== 0);
    }
    const productIdKey = 'product_id';
    const skuWithName = mapSkuPropsToNames(skuData, skuPropData, productIdKey);
                
    // get first sku img for each product
    const productImg = skuImgData.reduce((acc: any[], curr: any) => {
        if (!acc.some(item => item.product_id === curr.product_id)) {
          acc.push(curr);
        }
        return acc;
    }, []);    
    
    // Get length of review for each product
    const reviewLength = review.reduce((acc: { [key: string]: number }, cur: { product_id: string; }) => {
        const productId = cur.product_id;
        if (acc[productId]) {
            acc[productId] += 1;
        } else {
            acc[productId] = 1;
        }
        return acc;
    }, {});  

    // Get average rating for each product
    const rating = review.reduce((acc: { [key: string]: number }, cur: { product_id: string; review_score: number; }) => {
        const productId = cur.product_id;
        const score = cur.review_score;
        if (acc[productId]) {
            acc[productId] += score;
        } else {
            acc[productId] = score;
        }
        return acc;
    }, {});    

    const averageRating = Object.keys(rating).reduce((acc: { [key: string]: number }, productId: string) => {
        const totalScore = rating[productId]
        const numReviews = reviewLength[productId];
        const average = totalScore / numReviews;
        acc[productId] = average;
        return acc;
    }, {});    
    
    return {
        category: category,
        products: product,
        skus: skuWithName,
        skuImgs: productImg,
        rating: averageRating,
        reviewLength: reviewLength    
    };
};
