import axios from "axios";

export const getProductData = async (productId: string) => {
  const products = await axios.get('http://localhost:3000/api/products/products');
  const productImg = await axios.get('http://localhost:3000/api/products/product-img');
  const sku = await axios.get('http://localhost:3000/api/products/sku');
  const skuImg = await axios.get('http://localhost:3000/api/products/sku-img');
  const skuProp = await axios.get("http://localhost:3000/api/products/sku-prop");

  // Filter the data to only include the product with the given ID
  const product = products.data.filter((p: { product_id: string; }) => p.product_id === productId);
  const productImgData = productImg.data.filter((pi: { product_id: string; }) => pi.product_id === productId);
  const skus = sku.data.filter((s: { product_id: string; }) => s.product_id === productId);
  const skuImgData = skuImg.data.filter((si: { product_id: string; }) => si.product_id === productId);
  const skuPropData = skuProp.data.filter((sp: { product_id: string; }) => sp.product_id === productId);

  if (!product.length) {
    throw new Error(`Product with ID ${productId} not found`);
  }

  // Combine the data into a single object
  return { 
    product: product,
    productImg: productImgData,
    sku: skus,
    skuImg: skuImgData,
    skuProp: skuPropData,
  };
};
