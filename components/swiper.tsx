
"use client";
import Image from "next/image"
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

export default function swiper(){
    return (
        <>
            <Swiper
                slidesPerView={1}
                spaceBetween={30}
                loop={true}
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                }}
                navigation={true}
                modules={[Autoplay, Pagination, Navigation]}
                className="mySwiper"
            >
                <SwiperSlide>
                    <Image
                        src="/moto_brf.jpg"
                        alt="Productos de la rifa 1"
                        className="w-full h-80 md:h-80"
                        width={500}
                        height={600}
                    />
                </SwiperSlide>
                <SwiperSlide>
                    <Image
                        src="/iphone16.jpg"
                        alt="Productos de la rifa 2"
                        className="w-full h-80 md:h-80"
                        width={500}
                        height={600}
                    />
                </SwiperSlide>
                <SwiperSlide>
                    <Image
                        src="/kbr.png"
                        alt="Productos de la rifa 3"
                        className="w-full h-80 md:h-80"
                        width={500}
                        height={600}
                    />
                </SwiperSlide>
            </Swiper>
        </>
    )
}