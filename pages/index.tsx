import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import useSWR from "swr";
import axios from "axios";
import React from 'react';

import Navbar from '../component/nav/navbar';
import Banner from '../component/banner/banner';

import styles from '../styles/Home.module.css';

export default function Home () {
  const fetcher = async (url: string) => await axios.get(url).then((res) => res.data);
  const { data, error } = useSWR('/api/recommendations', fetcher);
  if (error) return <div>An error occured.</div>;
  if (!data) return <div>Loading ...</div>;

  interface Recommendation {
    id: number;
    productId: number;
    itemName: string;
    price: string;
    rank: number;
    review: number;
    imgUrl: string;
  }

  return (
    <div>
      <Head>
        <title>Nitori</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div>
        <Navbar />
        <Banner />
        <h3 className={styles.sectionTitle}>おすすめ商品</h3>
        <div className={styles.sections}>
          {data && data.map((recommendation: Recommendation) => (
            <div className={styles.productsInfo} key={recommendation.id}>
              <Link legacyBehavior href={`/recommendation/${recommendation.productId}`}>
                <a className={styles.productsLink} id='link'>
                  <Image
                    className={styles.productsImage}
                    alt='' 
                    src={recommendation.imgUrl}
                    width={160}
                    height={160}
                  ></Image>
                  <p className={styles.productsName}>{recommendation.itemName}</p>
                </a>
              </Link>
              <p className={styles.productsPrice}>
                <span className={styles.productsPriceNum}>
                  {recommendation.price}
                </span> 円（税込）
              </p>
              {/* <div className={styles.productsProps}>
                <p>{recommendation.rank}</p>
                <p>({recommendation.review})</p>
              </div> */}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
};
