import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import { EffectCoverflow, Pagination } from 'swiper/modules';
import './style.css';
import { useSelector } from "react-redux";
const ProductCard = () => {
  const [pubgs, setpubgs] = useState([]);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchpubgs = async () => {
      try {
        const response = await axios.get('https://shope-smoky.vercel.app/api/pubg/');
        setpubgs(response.data.allPubges);
      } catch (error) {
        console.error('Notları getirirken hata oluştu:', error);
      }
    };

    fetchpubgs();
  }, []);




  return (
    <Swiper
      effect={'coverflow'}
      grabCursor={true}
      centeredSlides={true}
      slidesPerView={'auto'}
      coverflowEffect={{
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: true,
      }}
      pagination={false}
      modules={[EffectCoverflow, Pagination]}
      className="mySwiper"
    >
      {pubgs.map((pubg) => (
        <SwiperSlide key={pubg._id}>
          <div className="p-3 relative group flex flex-col items-center overflow-hidden bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg">
            <div className="w-full h-[250px] relative overflow-hidden rounded-lg">
              {pubg.thumbnail && (
                <img
                  src={pubg.thumbnail}
                  alt="thumbnail"
                  className="w-full h-full object-cover transition-transform duration-500 transform group-hover:scale-105"
                  style={{ backgroundColor: 'transparent' }}
                />
              )}
            </div>
            <div className="space-y-2 w-full text-center mt-3">
              <h1 className="text-primary dark:text-primary-light font-semibold text-lg">{pubg.title}</h1>
              <div className="flex justify-center items-center text-xl font-semibold space-x-2 text-gray-900 dark:text-gray-100">
                <p>${pubg.price}</p>
                <span className="text-sm text-gray-600 dark:text-gray-400">{pubg.description}</span>
              </div>
            </div>
            <p className="text-xl font-semibold absolute top-0 left-3 bg-white dark:bg-gray-800 px-2 py-1 rounded-lg shadow-lg text-gray-900 dark:text-gray-100">
              {pubg.distance}
            </p>
          

          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ProductCard;
