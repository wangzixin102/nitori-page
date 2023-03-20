import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import useSWR from "swr";
import axios from 'axios';
import Cookies from 'universal-cookie';
import Head from "next/head";
import Image from "next/image";

import getUserData from '@/lib/userData';

import Navbar from "@/component/nav/navbar";

import switchIcon from '@/public/icon/switch.svg';
import closeIcon from '@/public/icon/close.svg';
import addCartIcon from '@/public/icon/add-cart.svg'
import styles from "@/styles/wishlist.module.css";

const cookies = new Cookies();

export default function wishlist () {
    const router = useRouter();
    const { userData } = getUserData();
    const token = cookies.get('token');
    const [listName, setListName] = useState('');
    const [makeListModal, setMakeListModal] = useState (false);
    const [mainList, setMainList] = useState('お気に入り商品');
    const [changeListNameModal, setChangeListNameModal] = useState(false);
    const [deleteListModal, setDeleteListModal] = useState(false);
    const [newListName, setNewListName] = useState(mainList);
    const [isChecked, setIsChecked] = useState(false);
    const [isAllChecked, setIsAllChecked] = useState(false);
    const [checkedProducts, setCheckedProducts] = useState([]);
    const [showSwitchModal, setShowSwitchModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const [productAmount, setProductAmount] = useState();

    const fetcher = async (url) => await axios.get(url).then((res) => res.data);
    const { data: likedProducts, error: likeProductsErr } = useSWR('/api/user/wishlist/liked-products', fetcher);
    const { data: likedLists, error: likedListsErr } = useSWR('/api/user/wishlist/makelist', fetcher);
    if (likeProductsErr || likedListsErr) return <div>An error occured.</div>;
    if (!likedProducts || !likedLists) return <div>Loading ...</div>;

    const filteredLists = likedLists.filter((product) => {
        if (userData && userData.email) {
            return product.user_email === userData.email;
        }
        return false;
    });

    const handleListChange = (e) => {
        setMainList(e.target.value);
        setIsChecked(false);
        setIsAllChecked(false);
        setCheckedProducts([]);
    }

    const filteredProducts = likedProducts.filter((product) => {
        if (userData && userData.email) {
            return product.user_email === userData.email && product.list_name === mainList;
        }
        return false;
    });
    
    const handleCheckboxChange = (index) => (event) => {
        const isChecked = event.target.checked;
        setIsChecked((prevState) => ({
            ...prevState,
            [index]: isChecked,
        }));
        setCheckedProducts((prevState) =>
            isChecked
                ? [...prevState, filteredProducts[index]]
                : prevState.filter((product) => product.id !== filteredProducts[index].id)
        );
    };

    const handleAllCheckboxChange = (e) => {
        setIsAllChecked(e.target.checked);
        const newIsChecked = {};
        filteredProducts.forEach((product, index) => {
            newIsChecked[index] = e.target.checked;
        });
        setIsChecked(newIsChecked);
        const selectedProducts = filteredProducts.filter((_, index) => newIsChecked[index]);
        setCheckedProducts(selectedProducts);        
    };

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const handleProductAmountChange = (product, quantity) => {
        const { sku_id } = product;
        setProductAmount((prevQuantities) => ({
            ...prevQuantities,
            [sku_id]: quantity,
        }));
    };

    const handleMakelist = async () => {
        try {
            const response = await axios.post('/api/user/wishlist/makelist', {
                user_email: userData.email,
                list_name: listName
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response.data);
            router.reload();
            setListName('');
        } catch (error) {
            setErrorMessage(error.response.data.error);
        }
    }

    const handleListNameChange = async() => {
        try {
            const response = await axios.post('/api/user/wishlist/switch-list', {
                user_email: userData.email,
                old_list_name: mainList,
                new_list_name: newListName
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

    const handleDeleteList = async() => {
        try {
            const response = await axios.post('/api/user/wishlist/delete-list', {
                user_email: userData.email,
                list_name: mainList,
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

    const handleSwitchProducts = async() => {
        try {
            const response = await axios.post('/api/user/wishlist/switch-products', {
                data: checkedProducts,
                listName: selectedOption
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

    const handleDeleteProducts = async() => {
        try {
            const response = await axios.post('/api/user/wishlist/delete-products', {
                data: checkedProducts,
                user_email: userData.email
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

    const handleAddProduct = async(product) => {
        const { product_id, sku_id, sku_subname, sku_price,
            sku_imgUrl, selection, order_method } = product;
            const quantity = productAmount && productAmount[sku_id] ? productAmount[sku_id] : 1;
        console.log('amount', quantity);
        try {
          const response = await axios.post('/api/user/cart/cart', {
            product_id: product_id,
            user_email: userData.email,
            sku_imgUrl: sku_imgUrl,
            sku_subname: sku_subname,
            sku_price: sku_price,
            sku_id: sku_id,
            selection: selection,
            order_method: order_method,
            amount: quantity
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
    
    return (
        <div className={styles.mainContainer}>
            <Head>
                <title>お気に入り商品</title>
            </Head>
            <Navbar />
            <div className={styles.mainContent}>
                <h1 className={styles.pageTitle}>お気に入り商品</h1>

                <div className={styles.makeList}>
                    <input
                        className={styles.makeListInput}
                        type='text'
                        placeholder="新規リスト名を入力"
                        value={listName}
                        onChange={(e) => setListName(e.target.value)}
                    />
                    <button 
                        className={styles.makeListBtn} 
                        onClick={() => {
                            handleMakelist()
                            setMakeListModal(!makeListModal)
                            setErrorMessage(null)
                        }}
                    >
                        リストを作成
                    </button>
                    {makeListModal && (
                        <div className={styles.modalContainer}>
                            <div className={styles.modalContent}>
                                <div className={styles.titleWrapper}>
                                    <p className={styles.titleText}>リストを作成</p>
                                    <button 
                                        onClick={() => {setMakeListModal(!makeListModal)}} 
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
                                <p className={styles.modalText}>お気に入り商品リストの新規作成は完了しました。</p>
                                {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
                            </div>
                        </div>
                    )}
                </div>

                <div className={styles.listsProductsContainer}>
                    <h2 className={styles.subTitle}>{mainList}</h2>
                    <div className={styles.listSelectionWrapper}>
                        <select className={styles.listSelection} onChange={handleListChange}>
                            {[...new Set(filteredLists.map((list) => list.list_name))].map((listname) => (
                                <option key={listname} value={listname}>{listname}</option>
                            ))}
                        </select>
                        {mainList !== "お気に入り商品" && (
                            <div className={styles.listOperationWrapper}>
                                <button 
                                    className={styles.listChange} 
                                    onClick={() => {
                                        setChangeListNameModal(!changeListNameModal)
                                        setNewListName(mainList)
                                        setErrorMessage(null)
                                    }}
                                >
                                    リスト名を変更
                                </button>
                                {changeListNameModal && (
                                    <div className={styles.modalContainer}>
                                        <div className={styles.modalContent}>
                                            <div className={styles.titleWrapper}>
                                                <p className={styles.titleText}>リスト名を変更</p>
                                                <button 
                                                    onClick={() => {setChangeListNameModal(!changeListNameModal)}} 
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
                                            {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
                                            <p className={styles.modalText}>
                                                リスト名を変更してください。
                                            </p>
                                            <div className={styles.changeListNameWrapper}>
                                                <input
                                                    className={styles.changeListNameInput}
                                                    type='text'
                                                    value={newListName}
                                                    onChange={(e) => setNewListName(e.target.value)}
                                                />
                                                <button className={styles.changeListNameBtn} onClick={handleListNameChange}>
                                                    変更する
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}                              
                                <div className={styles.listDelete} onClick={() => {setDeleteListModal(!deleteListModal)}}>
                                    <Image
                                        className={styles.listDeleteIcon}
                                        src={closeIcon}
                                        alt=''
                                        width={20}
                                        height={20}
                                    />
                                    <p className={styles.listDeleteText}>リストを削除</p>
                                </div>
                                {deleteListModal && (
                                    <div className={styles.modalContainer}>
                                        <div className={styles.modalContent}>
                                            <div className={styles.titleWrapper}>
                                                <p className={styles.titleText}>リストを削除</p>
                                                <button 
                                                    onClick={() => {setDeleteListModal(!deleteListModal)}} 
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
                                            <p className={styles.modalText}>
                                                "{mainList}"を削除しますか？
                                            </p>
                                            <button className={styles.modalDeleteBtn} onClick={handleDeleteList}>
                                                削除する
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {!filteredProducts || filteredProducts.length === 0 ? (
                        <div className={styles.notionContainer}>
                            <p className={styles.notionText}>お気に入り商品が登録されていません。</p>
                            <p className={styles.notionText}>各商品の紹介ページで「お気に入り」を押すと追加できます。</p>
                        </div>
                    ) : ( 
                        <div>               
                            <div className={styles.operationBar}>  
                                <label className={styles.checkAll}>
                                    <input
                                        className={styles.checkBox}
                                        type='checkbox'
                                        checked={isAllChecked}
                                        onChange={handleAllCheckboxChange}    
                                    />
                                    <p className={styles.checkAllText}>すべて選択</p>
                                </label>
                                <p className={styles.checkedItem}>チェックしたものを</p>
                                {filteredLists && filteredLists.length > 1 && (
                                    <div 
                                        className={styles.operation}
                                        onClick={() => {
                                            setShowSwitchModal(!showSwitchModal);
                                            const defaultList = filteredLists.find((list) => list.list_name !== mainList);
                                            setSelectedOption(defaultList.list_name);
                                            setErrorMessage(null);
                                        }}
                                    >
                                        <Image
                                            className={styles.operationIcon}
                                            src={switchIcon}
                                            alt=''
                                            width={20}
                                            height={20}
                                        />
                                        <p className={styles.operationText}>移動</p>
                                    </div>
                                )}
                                {showSwitchModal && (
                                    <div className={styles.modalContainer}>
                                        <div className={styles.modalContent}>
                                            <div className={styles.titleWrapper}>
                                                <p className={styles.titleText}>商品を別のリストへ移動</p>
                                                <button 
                                                    onClick={() => {setShowSwitchModal(!showSwitchModal)}} 
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
                                            {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
                                            <p className={styles.modalText}>
                                                商品を移動させるリストを選択してください。
                                            </p>
                                            <div className={styles.switchWrapper}>
                                                <select 
                                                    className={styles.modalSelections} 
                                                    value={selectedOption}
                                                    onChange={handleOptionChange}
                                                >                                                
                                                    {[...new Set(filteredLists.map((list) => list.list_name))].map((listname) => {
                                                        if (listname !== mainList) {
                                                            return <option key={listname} value={listname}>{listname}</option>
                                                        }
                                                    })}
                                                </select>
                                                <button className={styles.modalSwitchBtn}  onClick={() => {handleSwitchProducts();}}>
                                                    移動する
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div 
                                    className={styles.operation} 
                                    onClick={() => {checkedProducts.length > 0 && setShowDeleteModal(!showDeleteModal)}}
                                >
                                    <Image
                                        className={styles.operationIcon}
                                        src={closeIcon}
                                        alt=''
                                        width={20}
                                        height={20}
                                    />
                                    <p className={styles.operationText}>削除</p>
                                </div>
                                {showDeleteModal && (
                                    <div className={styles.modalContainer}>
                                        <div className={styles.modalContent}>
                                            <div className={styles.titleWrapper}>
                                                <p className={styles.titleText}>商品を削除</p>
                                                <button 
                                                    onClick={() => {setShowDeleteModal(!showDeleteModal)}} 
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
                                            <p className={styles.modalText}>
                                                チェックした商品 {checkedProducts.length} つを削除しますか？
                                            </p>
                                            <button className={styles.modalDeleteBtn} onClick={handleDeleteProducts}>
                                                削除する
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {filteredProducts && filteredProducts.map((product, index) => (
                                <div className={styles.products}>
                                    <div className={styles.imgWrapper}>
                                        <input 
                                            className={styles.checkProducts}
                                            type='checkbox'
                                            checked={isChecked[index]}
                                            onChange={handleCheckboxChange(index)}
                                        />
                                        <Image
                                            className={styles.productImg}
                                            src={product.sku_imgUrl}
                                            alt=''
                                            width={140}
                                            height={140}
                                        />
                                    </div>
                                    <div className={styles.detailWrapper}>
                                        <p className={styles.productSubname}>{product.sku_subname}</p>
                                        <p className={styles.productPrice}>
                                            <span className={styles.priceNum}>{product.sku_price}</span>
                                            円（税込）
                                        </p>
                                        <div className={styles.quantity}>
                                            <p className={styles.quantityText}>数量</p>
                                            <input
                                                className={styles.quantityInput}
                                                type='text'
                                                onChange={(e) => handleProductAmountChange(product, e.target.value)}
                                                defaultValue="1"
                                            />
                                        </div>
                                        <button 
                                            className={styles.addCartBtn} 
                                            onClick={() => {
                                                const { product_id, sku_id, sku_subname, sku_price,
                                                    sku_imgUrl, selection, order_method } = product;
                                                handleAddProduct({ product_id, sku_id, sku_subname, sku_price, 
                                                    sku_imgUrl, selection, order_method });
                                            }}
                                        >
                                            <Image
                                                className={styles.addCartIcon}
                                                src={addCartIcon}
                                                alt=''
                                                width={30}
                                                height={30}
                                            />
                                            <p className={styles.addCartText}>カートに入れる</p>
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <div className={styles.operationBarLower}>  
                                <label className={styles.checkAll}>
                                    <input
                                        className={styles.checkBox}
                                        type='checkbox'
                                        checked={isAllChecked}
                                        onChange={handleAllCheckboxChange}    
                                    />
                                    <p className={styles.checkAllText}>すべて選択</p>
                                </label>
                                <p className={styles.checkedItem}>チェックしたものを</p>
                                <div 
                                    className={styles.operation}
                                    onClick={() => {setShowSwitchModal(!showSwitchModal)}}
                                >
                                    <Image
                                        className={styles.operationIcon}
                                        src={switchIcon}
                                        alt=''
                                        width={20}
                                        height={20}
                                    />
                                    <p className={styles.operationText}>移動</p>
                                </div>

                                <div 
                                    className={styles.operation} 
                                    onClick={() => {checkedProducts.length > 0 && setShowDeleteModal(!showDeleteModal)}}
                                >
                                    <Image
                                        className={styles.operationIcon}
                                        src={closeIcon}
                                        alt=''
                                        width={20}
                                        height={20}
                                    />
                                    <p className={styles.operationText}>削除</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}