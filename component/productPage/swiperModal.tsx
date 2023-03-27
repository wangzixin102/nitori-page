import React, { useState, useContext } from 'react';
import { FreeMode, Navigation, Thumbs } from "swiper";
import { Swiper, SwiperSlide } from 'swiper/react';

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

import { SlideContext } from '../../contexts/SlideContext';
import styles from './swiperModal.module.css';

interface SwiperModalProps {
    isOpen: boolean;
    onClose: () => void;
    imageUrl: string;
}

const SwiperModal: React.FC<SwiperModalProps> = ({ isOpen, onClose, imageUrl }) => {    
    if (!isOpen) return null;
    const currentImgs = useContext(SlideContext);
    const [thumbsSwiper, setThumbsSwiper] = useState(null);

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <Swiper
                    style={{
                        "--swiper-navigation-color": "#009e96",
                        "--swiper-pagination-color": "#009e96",
                    } as React.CSSProperties}
                    loop={true}
                    spaceBetween={10}
                    navigation={true}
                    thumbs={thumbsSwiper ? { swiper: thumbsSwiper } : null}
                    modules={[FreeMode, Navigation, Thumbs]}
                    className={styles.modalSwiper}
                >
                    {currentImgs.map((imgUrl, index) => (
                        <SwiperSlide key={index}>
                            <img 
                                src={imgUrl.imgUrl} 
                                alt='slides img' 
                                className={styles.modalImage}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>

                <Swiper
                    onSwiper={swiper => setThumbsSwiper(swiper)}
                    loop={true}
                    spaceBetween={10}
                    slidesPerView={6}
                    freeMode={true}
                    watchSlidesProgress={true}
                    modules={[FreeMode, Navigation, Thumbs]}
                    className={styles.pagination}
                >
                    {currentImgs.map((imgUrl, idx) => (
                        <SwiperSlide key={idx}>
                            <img
                                src={imgUrl.imgUrl}
                                alt="slides img"
                                width={120}
                                height={120}
                                className={styles.paginationImage}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>

                <button onClick={onClose} className={styles.closeButton}>
                    X
                </button>
            </div>
        </div>
    );
}

export default SwiperModal;
