import { useRouter } from 'next/router';
import React, { useState, useEffect } from "react";
import axios from "axios";
import Head from 'next/head';
import Image from 'next/image';
import Cookies from 'universal-cookie';

import {getProductData} from '../../lib/productData';
import getUserData from '@/lib/userData';
import { SlideContext } from '@/contexts/SlideContext';
import Navbar from '@/component/nav/navbar';
import ProductSwiper from '../../component/productPage/productSwiper';
import Table from '@/component/productPage/table';
import QAList from '@/component/productPage/qaSection';
import Review from '@/component/productPage/review'

import closeIcon from '@/public/icon/close.svg';
import addCartIcon from '@/public/icon/add-cart.svg'
import favouriteProduct from '@/public/icon/favourite-product.svg';
import styles from '../../styles/product.module.css';

export async function getStaticPaths() {
  const products = await axios.get("http://localhost:3000/api/products/products");
  if (!Array.isArray(products.data)) {
    throw new Error(`something went wrong`)
  };
  const paths = products.data.map((product) => ({
    params: { id: product.id.toString() }
  }));

  return { paths, fallback: true };
}
  
export async function getStaticProps({ params }) {
  const productId = params.id;
  const { product, productImg, sku, skuImg, skuProp } = await getProductData(productId);
  return {
    props: {
      product: product[0],
      productImg,
      sku,
      skuImg,
      skuProp
    }
  }
};
  
export default function Product ({product, productImg, sku, skuImg, skuProp}) {
  if (!product || !productImg || !sku || !skuImg || !skuProp) {
    return <div>Loading...</div>
  };  
  
  const router = useRouter();
  const productId= router.query.id;
  const cookies = new Cookies();
  const token = cookies.get('token');
  const { userData } = getUserData();
  const [hasVoted, setHasVoted] = useState(false);
  const [addAmount, setAddAmount] = useState('1');
  const [addProductModal, setAddProductModal] = useState(false);

  // match props# and props name by sku and skuprop 
  function mapSkuPropsToNames(sku, skuProp) {
    const mappedPropsArr = sku.map((skuItem) => {
      const mappedProps = {};
      skuProp.forEach((prop) => {
        const propName = prop.prop_name;
        const propId = prop.prop_id;
        if (skuItem[`${propId}`] !== undefined) {
          mappedProps[propName] = skuItem[`${propId}`]
        }
      });
      return mappedProps
    });
    return mappedPropsArr
  };
  const skuWithName = mapSkuPropsToNames(sku, skuProp);

  // filter which parts need to be selected
  const selectionProps = skuProp.filter((prop) => prop.select_on_page === 0);

  // get selection options in dropdown
  function getSelectionOptions(selectionProps, skuWithName) {
    const selectionOptions = [];
    selectionProps.forEach(prop => {
      const options = [];
      skuWithName.forEach(sku => {
        if (sku[prop.prop_name] && !options.includes(sku[prop.prop_name])) {
          options.push(sku[prop.prop_name])
        }
      });
      selectionOptions.push({
        propName: prop.prop_name,
        options: options
      })
    });
    return selectionOptions
  };
  const selectionOptions = getSelectionOptions(selectionProps, skuWithName);

  // set default select options
  const defaultSelectedOptions = {};
  selectionOptions.forEach((prop) => {
    const defaultValue = prop.defaultValue || prop.options[0];
    defaultSelectedOptions[prop.propName] = defaultValue
  });
  const [selectedOptions, setSelectedOptions] = useState(defaultSelectedOptions);

  // listen to the change of select options, update when change
  const handleSelectChange = (propName, value) => {
    setSelectedOptions({ ...selectedOptions, [propName]: value })
  };

  // filter the sku by select options
  const filteredSku = skuWithName.filter((sku) => {
    return Object.entries(selectedOptions).every(([propName, value]) => {
      return sku[propName] === value
    })
  });
  const currentSku = filteredSku[0];

  // filter current skuid by product sub id
  const skuId = sku.filter((sku) => {
    for (let key in sku) {
      if (sku[key] === currentSku.product_sub_id) {
        return true;
      }
    }
    return false;
  })[0]?.sku_id;

  // get current imgs with filter sku imgs
  const skuImgs = skuImg.filter((s) => s.sku_id === skuId)?.map((s) => ({ imgUrl: s.imgUrl }));
  const currentImgs = skuImgs.concat([...productImg].map(img => ({ imgUrl: img.imgUrl })));
  
  // filter props show_on_page(info detail)
  const skuShowOnPage = skuProp.filter((prop) => prop.show_on_page === 0);
  const propNames = skuShowOnPage.map((prop) => prop.prop_name);
  const tableSku = filteredSku.map((obj )=> {
    return propNames.reduce((acc, prop) => {
      acc[prop] = obj[prop]
      return acc
    }, {})
  });

  // submit sku selection data
  const formatObject = (obj) => {
    const props = Object.keys(obj);
    const formattedProps = props.map(prop => `${prop}:${obj[prop]}`);
    return formattedProps.join('/');  
  }
  const formattedSku = formatObject(selectedOptions);

  const handleAddProduct = async() => {
    try {
      const response = await axios.post('/api/user/cart/cart', {
        product_id: productId,
        user_email: userData.email,
        sku_imgUrl: currentImgs[0],
        sku_subname: currentSku.subname,
        sku_price: currentSku.price,
        sku_id: currentSku.product_sub_id,
        selection: formattedSku,
        order_method: product.order_method,
        amount: addAmount
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
    } catch (error) {
        console.error(error);
    }
  }

  const handleCartPage = () => {
    router.push('/cart')
  }

  const handleLikedProduct = async (e) => {
    e.preventDefault();
      try {
        const response = await axios.post('/api/user/wishlist/liked-products', {
          product_id: productId,
          user_email: userData.email,
          sku_imgUrl: currentImgs[0],
          sku_subname: currentSku.subname,
          sku_price: currentSku.price,
          sku_id: currentSku.product_sub_id,
          selection: formattedSku,
          order_method: product.order_method
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data);
        setHasVoted(true)
      } catch (error) {
          console.error(error);
      }
    }

    useEffect(() => {
      async function fetchVoteHistory() {
        const alreadyLiked = await axios.get('../api/user/wishlist/liked-products');
        setHasVoted(alreadyLiked.data.some((vote) => vote.sku_id === currentSku.product_sub_id));
      }
      fetchVoteHistory();
    }, [currentSku.product_sub_id]);

  return (
    <div className={styles.mainContainer}>
      <Head>
        <title>{product.product_name}</title>
      </Head>
 
      <div>
        <Navbar />  
        <div className={styles.subContainer}>
            <h1 className={styles.subTitle}>{currentSku.subname}</h1>
            <p className={styles.subId}>商品コード<span> {currentSku.product_sub_id}</span></p>
        </div>

        <div className={styles.product}>
          <div className={styles.scrollContainer}>
            <div className={styles.upperContainer}>
              <div className={styles.slidePics}>
                <SlideContext.Provider value={currentImgs}>
                  <ProductSwiper />
                </SlideContext.Provider>
              </div>

              <div className={styles.infoContainer}>
                {selectionOptions.map((prop) => (
                  <div key={prop.propName}>
                    <label htmlFor={prop.id} className={styles.propName}>
                      {prop.propName}: 
                    </label>
                    <select 
                      id={prop.id} 
                      name={prop.propName}
                      onChange={(e) => handleSelectChange(prop.propName, e.target.value)}
                    >
                      {prop.options.map((option) => (
                        <option key={option} className={styles.propName}>{option}</option>
                      ))}
                    </select>
                  </div>
                ))}

                <p className={styles.orderPrice}>{currentSku.price}</p>

                <div className={styles.skuDetails}>
                  <h3>仕様・サイズ</h3>
                  <Table data={tableSku[0]}/>
                </div>
              </div>
            </div>

            <div className={styles.lowerContainer}>
              <div className={styles.QAContainer}>
                <QAList />
              </div>

              <div className={styles.reviewContainer}>
                <Review />
              </div>
            </div>
          </div>

          <div className={styles.orderContainer}>
            <div className={styles.orderInfoContainer}>
              <p className={styles.orderProp}>
                <span className={styles.orderInfo}>
                  納品方法
                </span>
                <span className={styles.orderDetail}>
                  {product.order_method}
                </span>
              </p>
              <p className={styles.orderProp}>
                <span className={styles.orderInfo}>
                  返品・交換
                </span>
                <span className={styles.orderDetail}>
                  {product.return}
                </span>
              </p>
              <p className={styles.orderProp}>
                <span className={styles.orderInfo}>
                  送料
                </span>
                <span className={styles.orderDetail}>
                  {product.delivery_fee}
                </span>
              </p>
              <p className={styles.orderProp}>
                <span className={styles.orderInfo}>
                  数量
                  <input
                    className={styles.amountInput}
                    type='text'
                    value={addAmount}
                    onChange={(e) => setAddAmount(e.target.value)}
                  />
                </span>
              </p>
            </div>

            <div className={styles.orderBuyContainer}>
              <p className={styles.orderPrice}>{currentSku.price}</p>
              <button 
                className={styles.orderBtn} 
                onClick={() => {
                  handleAddProduct();
                  setAddProductModal(!addProductModal);
                }}
              >
                <Image
                  className={styles.addProductIcon}
                  src={addCartIcon}
                  alt=''
                  width={30}
                  height={30}
                />
                <p>カートに入れる</p>
              </button>
              {addProductModal && (
                <div className={styles.addProductModalContainer}>
                  <div className={styles.addProductModalContent}>
                    <div className={styles.titleWrapper}>
                        <p className={styles.titleText}>カートに追加しました</p>
                        <button 
                          onClick={() => {setAddProductModal(!addProductModal)}} 
                          className={styles.modalCloseBtn}
                        >
                          <Image
                            className={styles.modalCloseImg}
                            src={closeIcon}
                            alt=''
                            width={30}
                            height={30}
                          />
                        </button>
                    </div> 
                    <button className={styles.turnCartPage} onClick={handleCartPage}>
                      <p>カートを見る</p>
                      <Image
                        className={styles.addProductIcon2}
                        src={addCartIcon}
                        alt=''
                        width={30}
                        height={30}
                      />
                    </button>  
                  </div>             
                </div>
              )}
              <div className={styles.functionsBtn}>
                <button 
                  className={`${styles.likeAddBtn} ${hasVoted ? styles.disabledBtn : ''}`} 
                  onClick={handleLikedProduct}
                  disabled={hasVoted}
                >
                  <Image
                    className={`${styles.likeIcon} ${hasVoted ? styles.hasVoted : ''}`}
                    src={favouriteProduct}
                    alt=''
                    width={30}
                    height={30}
                  />
                  <p className={styles.likeText}>お気に入り</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
