import { useState, useEffect, useContext, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation, Pagination } from "swiper";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { SlideContext } from "../../contexts/SlideContext";
import SwiperModal from './swiperModal';

import styles from "../productPage/productSwiper.module.css";

SwiperCore.use([Navigation, Pagination]);

export default function MySwiper() {
  const currentImgs = useContext(SlideContext);
  const slideSize = 3;
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);
  const swiperRef = useRef(null);
  const [modalOpen, setModalOpen] = useState(false);
  

  const handleImageClick = (image, slideIndex) => {
    setSelectedImage(image);
    setSelectedSlideIndex(slideIndex);
  };

  useEffect(() => {
    if (currentImgs && currentImgs.length > 0) {
      setSelectedImage(currentImgs[0].imgUrl);
      setSelectedSlideIndex(0);

      if (swiperRef.current && swiperRef.current.swiper) {
        swiperRef.current.swiper.slideTo(0);
      }
    }
  }, [currentImgs]);

  if (!currentImgs || currentImgs.length === 0) {
    return null;
  }

  const slides = [];
  for (let i = 0; i < currentImgs.length; i += slideSize) {
    const slide = currentImgs.slice(i, i + slideSize);
    slides.push(slide);
  }

  const selectedSlide = slides.find((slide) =>
    slide.some((img) => img.imgUrl === selectedImage)
  );

  const selectedSlideIndexByImage =
    selectedSlide && slides.indexOf(selectedSlide);

  return (
    <div className={styles.container}>
      <div>
        {selectedImage && (
          <img
            src={selectedImage}
            alt="Selected Image"
            height={380}
            width={380}
            onClick={() => setModalOpen(!modalOpen)}
            className={styles.enlargedImg}
          />
        )}
        <SwiperModal isOpen={modalOpen} onClose={() => setModalOpen(false)} imageUrl={selectedImage} />
      </div>
      <div className={styles.swiperWrapper}>
      <Swiper
          style={{
            "--swiper-navigation-color": "#009e96",
            "--swiper-navigation-size": "22px",
            "--swiper-pagination-color": "#009e96"
          }}
          spaceBetween={10}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          modules={[Navigation, Pagination]}
          initialSlide={selectedSlideIndexByImage || 0}
          onSlideChange={(swiper) =>
            setSelectedImage(swiper.slides[swiper.activeIndex].querySelector("img").src)
          }
          className={styles.swiper}
          key={currentImgs.length} 
          ref={swiperRef} 
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index} className={styles.swiperSlide}>
              <div className={styles.row}>
                {slide.map((img, imgIndex) => (
                  <div className={styles.col} key={imgIndex}>
                    <img
                      src={img.imgUrl}
                      className={`${styles.img} ${
                        img.imgUrl === selectedImage ? styles.selected : ""
                      }`}
                      onClick={() => handleImageClick(img.imgUrl, index)}
                    />
                  </div>
                ))}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
