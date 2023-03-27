import Link from "next/link";
import Image from "next/image";
import useSWR from "swr";
import axios from "axios";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Mousewheel, Keyboard } from "swiper";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import styles from '../banner/banner.module.css';

const Banner = () => {
    const fetcher = async (url: string) => await axios.get(url).then((res) => res.data);
    const { data, error } = useSWR('/api/banner', fetcher);
    if (error) return <div>An error occured.</div>;
    if (!data) return <div>Loading ...</div>;

    interface Banner {
        id: number;
        eventId: string;
        imgUrl: string;
    }

    return (
        <div className={styles.container}>
            <Swiper
                cssMode={true}
                navigation={true}
                pagination={true}
                mousewheel={true}
                keyboard={true}
                loop={true}
                modules={[Navigation, Pagination, Mousewheel, Keyboard]}
                className={styles.mySwiper}
                spaceBetween={30}
            >
                {data.map((banner: Banner) => (
                    <SwiperSlide key={banner.id} className={styles.imageSlide}>
                        <Link legacyBehavior href={`/promotion/${banner.eventId}`}>
                            <a id='link'>
                                <Image 
                                    className={styles.eventImage}
                                    alt='' 
                                    src={banner.imgUrl}
                                    width={600}
                                    height={400}
                                />
                            </a>
                        </Link>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}

export default Banner;
  