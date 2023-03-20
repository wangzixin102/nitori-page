import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import useSWR from "swr";
import axios from 'axios';
import Cookies from 'universal-cookie';
import Head from "next/head";
import Image from 'next/image';

import Navbar from "@/component/nav/navbar";
import getUserData from '@/lib/userData';

import closeIcon from '@/public/icon/close.svg';
import styles from '@/styles/cart.module.css';

const cookies = new Cookies();

export default function Cart () {
    const router = useRouter();
    const { userData } = getUserData();
    const token = cookies.get('token');
    const [currentAmount, setCurrentAmount] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);

    const fetcher = async (url) => await axios.get(url).then((res) => res.data);
    const { data: addedProducts, error } = useSWR('/api/user/cart/cart', fetcher);
    if (error) return <div>An error occured.</div>;
    if (!addedProducts) return <div>Loading ...</div>;

    const inCartProducts = addedProducts.filter((product) => {
        return product.status === "カート";
    })

    const buyLaterProducts = addedProducts.filter((product) => {
        return product.status === "あとで買う";
    })

    const handleProductPage = (productId) => {
        router.push(`/products/${productId}`)
    }

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    }

    const priceforItem = inCartProducts.map((item) => item.amount * item.price);
    const totalProductPrice = priceforItem.reduce((sum, price) => sum + price, 0);

    const nonBigFurniture = inCartProducts.filter((item) => item.deliver_category !== "大型家具");
    const nonBigFurnitureTotalPrice = nonBigFurniture.reduce((sum, item) => sum + item.price * item.amount, 0);
    const deliverFee = nonBigFurnitureTotalPrice < 110000 && nonBigFurniture.length > 0 ? 550 : 0;

    const handleChangeStatus = async(skuId, status) => {
        const newStatus = status === 'カート' ? 'あとで買う' : 'カート';
        try {
            const response = await axios.post('/api/user/cart/change-status', {
                user_email: userData.email,
                sku_id: skuId,
                status: newStatus
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response.data);
            router.reload();
        } catch (error) {
            setErrorMessage(error.response.data.error);
        }
    }

    const handleAmountBlur = async(event, product) => {
        const newAmount = parseInt(event.target.value);
        if (isNaN(newAmount)) return;
        const updatedProduct = { ...product, amount: newAmount };
        try {
            const response = await axios.post('/api/user/cart/update-amount', {
                data: updatedProduct
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response.data);
            router.reload();
        } catch (error) {
            setErrorMessage(error.response.data.error);
        }
    }

    const handleCartItemDelete = async(skuId) => {
        try {
            const response = await axios.post('/api/user/cart/delete-cart', {
                user_email: userData.email,
                sku_id: skuId
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });                
            console.log(response.data);
            router.reload();
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className={styles.mainContainer}>
            <Head>
                <title>
                    カート
                </title>
            </Head>
            <Navbar />

            <div className={styles.mainContent}>
                <h1 className={styles.title}>カート</h1>
                <div className={styles.cartContainer}>
                    <div className={styles.productContainer}>
                        {!inCartProducts || inCartProducts.length === 0 ? (
                            <div className={styles.noItemNotionWrapper}>
                                <p className={styles.noItemNotion}>
                                    ショッピングカートに商品が入っていません。
                                </p>
                                <p className={styles.noItemNotion}>
                                    ショッピングカート内の商品は自由に出し入れしていただけます。
                                </p>
                                <p className={styles.noItemNotion}>
                                    また、商品は「あとで買う」に移動していただくこともできます。
                                </p>
                            </div>
                        ) : ( inCartProducts.map((product) => (
                            <div className={styles.inCartContainer}>
                                <div className={styles.productImgWrapper}>
                                    <Image
                                        onClick={() => handleProductPage(product.product_id)}
                                        className={styles.productImg}
                                        src={product.imgUrl}
                                        alt=''
                                        width={140}
                                        height={140}
                                    />
                                </div>
                                <div className={styles.otherDetailWrapper}>
                                    <div className={styles.productDetailWrapper}>
                                        <p 
                                            className={styles.subname} 
                                            onClick={() => handleProductPage(product.product_id)}
                                        >
                                            {product.sku_subname}
                                        </p>
                                        <p className={styles.skuId}>
                                            商品コード
                                            <span className={styles.skuIdNum}>{product.sku_id}</span>
                                        </p>
                                        {product.selection.includes("/") ? (
                                            product.selection.split("/").map((value, index) => (
                                                <p key={index} className={styles.selections}>
                                                    {value}
                                                </p>
                                            ))
                                        ) : (
                                            <p className={styles.selections}>{product.selection}</p>
                                        )}
                                        <p className={styles.price}>
                                            <span className={styles.priceNum}>{product.price}</span>
                                            円 （税込）
                                        </p>
                                        {product.order_method && (
                                            <p className={styles.orderMethod}>{product.order_method}</p>
                                        )}
                                    </div>
                                    <div className={styles.operationWrapper}>
                                        <div className={styles.operation}>
                                            <input
                                                className={styles.amountInput}
                                                type='text'
                                                value={currentAmount !== null ? currentAmount : product.amount}
                                                onChange={(e) => setCurrentAmount(e.target.value)}
                                                onBlur={(event) => handleAmountBlur(event, product)}
                                            />
                                            <button 
                                                className={styles.buyLaterBtn} 
                                                onClick={() => {handleChangeStatus(product.sku_id, product.status)}}
                                            >
                                                あとで買う
                                            </button>
                                            <div 
                                                className={styles.deleteWrapper} 
                                                onClick={() => {handleCartItemDelete(product.sku_id)}}
                                            >
                                                <Image
                                                    className={styles.deleteIcon}
                                                    src={closeIcon}
                                                    alt=''
                                                    width={20}
                                                    height={20}
                                                />
                                                <p className={styles.deleteText}>削除</p>
                                            </div>
                                        </div>
                                        <div className={styles.textInfo}>
                                            <p className={styles.itemDeliverFee}>
                                                個別送料
                                                <span className={styles.itemDeliverFeeNum}>0</span>
                                                円
                                            </p>
                                            <p className={styles.textInfoPrice}>
                                                小計
                                                <span className={styles.textInfoPriceNum}>
                                                    {product.price * product.amount}
                                                </span>
                                                円 （税込）
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>                        
                        )))}
                        {buyLaterProducts && buyLaterProducts.length > 0 && (
                            <div className={styles.buyLaterContainer}>
                                <h2 className={styles.butLaterTitle}>「あとで買う」に入っている商品</h2>
                                {buyLaterProducts.map((product) => (
                                    <div className={styles.inCartContainer}>
                                        <div className={styles.productImgWrapper}>
                                            <Image
                                                onClick={() => handleProductPage(product.product_id)}
                                                className={styles.productImg}
                                                src={product.imgUrl}
                                                alt=''
                                                width={140}
                                                height={140}
                                            />
                                        </div>
                                        <div className={styles.otherDetailWrapper}>
                                            <div className={styles.productDetailWrapper}>
                                                <p 
                                                    className={styles.subname} 
                                                    onClick={() => handleProductPage(product.product_id)}
                                                >
                                                    {product.sku_subname}
                                                </p>
                                                <p className={styles.skuId}>
                                                    商品コード
                                                    <span className={styles.skuIdNum}>{product.sku_id}</span>
                                                </p>
                                                {product.selection.includes("/") ? (
                                                    product.selection.split("/").map((value, index) => (
                                                    <p key={index} className={styles.selections}>
                                                        {value}
                                                    </p>
                                                    ))
                                                ) : (
                                                    <p className={styles.selections}>{product.selection}</p>
                                                )}
                                                <p className={styles.price}>
                                                    <span className={styles.priceNum}>{product.price}</span>
                                                    円 （税込）
                                                </p>
                                                <p className={styles.orderMethod}>{product.order_method}</p>
                                            </div>
                                            <div className={styles.operationWrapper}>
                                                <div className={styles.backCart}>
                                                    <button 
                                                        className={styles.backCartBtn} 
                                                        onClick={() => {handleChangeStatus(product.sku_id, product.status)}}
                                                    >
                                                        カートに戻す
                                                    </button>
                                                    <div 
                                                        className={styles.deleteWrapper} 
                                                        onClick={() => {handleCartItemDelete(product.sku_id)}}
                                                    >
                                                        <Image
                                                            className={styles.deleteIcon}
                                                            src={closeIcon}
                                                            alt=''
                                                            width={20}
                                                            height={20}
                                                        />
                                                        <p className={styles.deleteText}>削除</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div> 
                                ))} 
                            </div>                      
                        )}
                    </div>
                    {inCartProducts && inCartProducts.length > 0 && (
                        <div className={styles.orderContainer}>
                            <div className={styles.priceContainer}>
                                <div className={styles.totalPriceWrapper}>
                                    <p className={styles.totalPriceText}>お支払金額</p>
                                    <p className={styles.totalPrice}>
                                        <span className={styles.totalPriceNum}>{totalProductPrice + deliverFee}</span>
                                        円
                                    </p>
                                </div>
                                <div className={styles.pointGetWrapper}>
                                    <p className={styles.pointGetText}>獲得予定ポイント</p>
                                    <p className={styles.pointGet}>
                                        <span className={styles.pointGetNum}>000</span>
                                        pt
                                    </p>
                                </div>
                                <div className={styles.productPriceWrapper}>
                                    <p className={styles.productPriceText}>商品金額合計</p>
                                    <p className={styles.productPrice}>
                                        <span className={styles.productPriceNum}>{totalProductPrice}</span>
                                        円
                                    </p>
                                </div>
                                <div className={styles.deliverFeeWrapper}>
                                    <p className={styles.deliverFeeText}>送料</p>
                                    <p className={styles.deliverFee}>
                                        <span className={styles.deliverFeeNum}>{deliverFee}</span>
                                        円
                                    </p>
                                </div>
                                <ul className={styles.notionList}>
                                    <li className={styles.notionItem}>
                                        送料および手数料はまだ確定しておりません。
                                        一部地域へのご配達は、別途料金がかかる場合がございます。
                                        (沖縄本島以外の離島の中継料は、別途ご案内いたします)
                                    </li>
                                </ul>
                            </div>
                            {inCartProducts && inCartProducts.some((product) => product.deliver_category === "大型家具") ? (                                <div className={styles.radioContainer}>
                                    <label className={styles.radioItem}>
                                        <input
                                            className={styles.radioBtn}
                                            type='radio'
                                            value='option1'
                                            checked={selectedOption === 'option1'}
                                            onChange={handleOptionChange}
                                        />
                                        <p className={styles.radioText}>ご指定の場所に配送する</p>
                                    </label>
                                    <label className={styles.radioItem}>
                                        <input
                                            className={styles.radioBtn}
                                            type='radio'
                                            value='option2'
                                            checked={selectedOption === 'option2'}
                                            onChange={handleOptionChange}
                                        />
                                        <p className={styles.radioText}>
                                            店舗/配送センターで受け取る
                                            <span className={styles.notionBox}>送料無料</span>
                                        </p>
                                    </label>
                                </div>
                            ) : totalProductPrice < 110000 ? (
                                <div className={styles.freeDelivery}>
                                    <p className={styles.freeDeliveryText}>
                                        あと
                                        <span className={styles.neededFee}>
                                            <span className={styles.neededFeeNum}>{110000-totalProductPrice}</span>
                                            円
                                        </span>
                                        （税込）で
                                        <span className={styles.freeNotion}>送料無料</span>
                                    </p>
                                    <p className={styles.freeDeliveryNotion}>大型家具除く</p>
                                </div>
                            ) : null}
                            <div className={styles.btnContainer}>
                                <button className={styles.purchaseBtn}>
                                    レジへ進む
                                </button>
                                <button className={styles.keepShopBtn}>
                                    ショッピングを続ける
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}