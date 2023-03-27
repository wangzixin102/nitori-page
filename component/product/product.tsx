import Image from "next/image";
import { Rating } from '@mui/material';

import styles from './product.module.css';

export default function ProductDisplay({ product }) {  
    
    return (
        <div className={styles.productContainer}>
            <div className={styles.productWrapper}>
                <Image 
                    className={styles.productImg}
                    src={product.imgUrl} 
                    alt='' 
                    width={180} 
                    height={180} 
                />
                <p className={styles.productName}>{product.name}</p>
            </div>
            <div className={styles.detailsContainer}>
                {product.lowestPrice === product.highestPrice ? (
                    <p className={styles.priceTag}>
                        <span className={styles.productPrice}>
                            {product.lowestPrice}
                        </span>
                        円（税込）
                    </p>
                ) : (
                    <p className={styles.priceTag}>
                        <span className={styles.productLowPrice}>
                            {product.lowestPrice}
                        </span> 
                        <span className={styles.splitSymbol}>
                            ~ 
                        </span>
                        <span className={styles.productHighPrice}>
                            {product.highestPrice}
                        </span>
                        円（税込）
                    </p>
                )}
                <div className={styles.ratingWrapper}>
                    <Rating 
                        className={styles.productRating} 
                        value={product.rating} 
                        size='small'
                        precision={0.1}
                        readOnly 
                    />
                    <p className={styles.productReview}>({product.review})</p>
                </div>
            </div>
        </div>
    )
}
