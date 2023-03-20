import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import useSWR from "swr";
import axios from "axios";
import React from 'react';

import Navbar from '../../component/nav/navbar';
import styles from '../../styles/product.module.css';

export default function Products () {
    const fetcher = async (url) => await axios.get(url).then((res) => res.data);
    const { data: products, error: productsErr } = useSWR('../api/products/products', fetcher);
    if(productsErr) return <div>An error occured.</div>;
    if (!products) return <div>Loading ...</div>;
    // const { data: sku, error: skuErr } = useSWR('../api/products/sku', fetcher);
    // const { data: skuImg, error: skuImgErr } = useSWR('../api/products/sku-img', fetcher);
    // const { data: skuProp, error: skuPropErr } = useSWR('../api/products/sku-prop', fetcher);
    // if (productsErr || skuErr || skuImgErr || skuPropErr) return <div>An error occured.</div>;
    // if (!products || !sku || !skuImg || !skuProp) return <div>Loading ...</div>;
  
    return (
        <div>
            <Head>
                <title>All Products</title>
            </Head>

            <div>
                <Navbar />
                <div className={styles.sections}>
                    {products && products.map((product) => (
                        <div key={product.id}>
                            <Link legacyBehavior href={`/products/${product.product_id}`}>
                                <a id='link'>
                                    <p>{product.product_name}</p>
                                </a>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}