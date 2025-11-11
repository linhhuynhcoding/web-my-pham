import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { CardMotion } from '../components/Card';
import { CardSolid } from '../components/CardSolid';

export const HomePage = () => {
  const banners = [
    'https://placehold.co/846x250',
    'https://placehold.co/846x250',
    'https://placehold.co/846x250',
  ];

  const features = [
    { label: "Hasaki Rẻ Hơn", img: "https://via.placeholder.com/64", bg: "bg-pink-100" },
    { label: "Giao 2H", img: "https://via.placeholder.com/64", bg: "bg-orange-100" },
    { label: "Nước Hoa Chính Hãng", img: "https://via.placeholder.com/64", bg: "bg-blue-100" },
    { label: "Clinic & S.P.A", img: "https://via.placeholder.com/64", bg: "bg-green-100" },
    { label: "Clinic Deals", img: "https://via.placeholder.com/64", bg: "bg-red-100" },
    { label: "Độc Quyền Hasaki", img: "https://via.placeholder.com/64", bg: "bg-yellow-100" },
    { label: "Đặt Hẹn", img: "https://via.placeholder.com/64", bg: "bg-purple-100" },
    { label: "Cẩm Nang", img: "https://via.placeholder.com/64", bg: "bg-blue-50" },
  ];

  const brands = [
    [
      {
        bg: "https://placehold.co/190x190",
        logo: "https://media.hcdn.vn/brand/1593168007the-coc.jpg"
      },
      {
        bg: "https://placehold.co/190x190",
        logo: "https://media.hcdn.vn/brand/1593168007the-coc.jpg"
      },
    ],
    [
      {
        bg: "https://placehold.co/190x190",
        logo: "https://media.hcdn.vn/brand/1593168007the-coc.jpg"
      },
      {
        bg: "https://placehold.co/190x190",
        logo: "https://media.hcdn.vn/brand/1593168007the-coc.jpg"
      },
    ],
    [
      {
        bg: "https://placehold.co/190x190",
        logo: "https://media.hcdn.vn/brand/1593168007the-coc.jpg"
      },
      {
        bg: "https://placehold.co/190x190",
        logo: "https://media.hcdn.vn/brand/1593168007the-coc.jpg"
      },
    ],
    [
      {
        bg: "https://placehold.co/190x190",
        logo: "https://media.hcdn.vn/brand/1593168007the-coc.jpg"
      },
      {
        bg: "https://placehold.co/190x190",
        logo: "https://media.hcdn.vn/brand/1593168007the-coc.jpg"
      },
    ],
    [
      {
        bg: "https://placehold.co/190x190",
        logo: "https://media.hcdn.vn/brand/1593168007the-coc.jpg"
      },
      {
        bg: "https://placehold.co/190x190",
        logo: "https://media.hcdn.vn/brand/1593168007the-coc.jpg"
      },
    ],
    [
      {
        bg: "https://placehold.co/190x190",
        logo: "https://media.hcdn.vn/brand/1593168007the-coc.jpg"
      },
      {
        bg: "https://placehold.co/190x190",
        logo: "https://media.hcdn.vn/brand/1593168007the-coc.jpg"
      },
    ],
    [
      {
        bg: "https://placehold.co/190x190",
        logo: "https://media.hcdn.vn/brand/1593168007the-coc.jpg"
      },
      {
        bg: "https://placehold.co/190x190",
        logo: "https://media.hcdn.vn/brand/1593168007the-coc.jpg"
      },
    ],
    [
      {
        bg: "https://placehold.co/190x190",
        logo: "https://media.hcdn.vn/brand/1593168007the-coc.jpg"
      },
      {
        bg: "https://placehold.co/190x190",
        logo: "https://media.hcdn.vn/brand/1593168007the-coc.jpg"
      },
    ],
    [
      {
        bg: "https://placehold.co/190x190",
        logo: "https://media.hcdn.vn/brand/1593168007the-coc.jpg"
      },
      {
        bg: "https://placehold.co/190x190",
        logo: "https://media.hcdn.vn/brand/1593168007the-coc.jpg"
      },
    ],
  ]

  const categories = [
    {
      img: "https://placehold.co/120x120",
      name: "Dầu gội cực mạnh"
    },
    {
      img: "https://placehold.co/120x120",
      name: "Dầu gội cực mạnh"
    },
    {
      img: "https://placehold.co/120x120",
      name: "Dầu gội cực mạnh"
    },
    {
      img: "https://placehold.co/120x120",
      name: "Dầu gội cực mạnh"
    },
    {
      img: "https://placehold.co/120x120",
      name: "Dầu gội cực mạnh"
    },
    {
      img: "https://placehold.co/120x120",
      name: "Dầu gội cực mạnh"
    },
    {
      img: "https://placehold.co/120x120",
      name: "Dầu gội cực mạnh"
    },
    {
      img: "https://placehold.co/120x120",
      name: "Dầu gội cực mạnh"
    },
  ]

  return (
    <div className='flex flex-col gap-4'>
      {/* Banner */}
      <CardMotion>
        <div className=" flex flex-col w-full bg-white">
          {/* Banner Swiper */}
          <div className="max-w-[60%] mx-auto grid grid-flow-col-dense grid-cols-5 grid-rows-2 gap-2 items-center">
            <Swiper
              spaceBetween={30}
              centeredSlides={true}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              pagination={{
                clickable: true,
              }}
              navigation={true}
              modules={[Autoplay, Pagination, Navigation]}
              className="w-full row-span-2 col-span-3 h-full"
            >
              {banners.map((banner, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={banner}
                    alt={`Banner ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
            <div className='col-span-2 bg-amber-500'><img src="https://placehold.co/846x250" alt="" /></div>
            <div className='col-span-2 bg-amber-500'><img src="https://placehold.co/846x250" alt="" /></div>
          </div>

          {/* Icon section */}
          <div className="flex justify-center items-center flex-wrap gap-6 px-4 py-6 bg-white shadow-sm">
            {features.map((item, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center cursor-pointer hover:scale-105 transition-transform"
              >
                <div
                  className={`w-16 h-16 flex items-center justify-center rounded-full ${item.bg}`}
                >
                  <img src={item.img} alt={item.label} className="w-10 h-10 rounded-full" />
                </div>
                <p className="mt-2 text-sm font-medium text-gray-700">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </CardMotion>

      {/* Categories */}
      <CardSolid className='flex flex-col max-w-[60%] w-full h-full mx-auto rounded-none p-4 gap-2'>
        <h2 className='font-bold text-red-700 text-2xl'>Danh mục</h2>
        <div className='w-full h-full  overflow-visible'>
          <div className='col-span-2 overflow-visible'>
            <Swiper
              spaceBetween={20}
              slidesPerView={7}
              centeredSlides={false}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              pagination={{
                clickable: true,
              }}
              navigation={true}
              modules={[Autoplay]}
              className="w-full h-full "
            >
              {categories.map((cate, index) => (
                <SwiperSlide
                  key={index}
                  className="flex h-full w-auto items-stretch justify-center overflow-visible m-1"
                >
                  <CardSolid className="rounded-2xl flex-1 flex flex-col gap-2 p-2 items-center justify-center overflow-hidden">
                    <img
                      src={cate.img}
                      alt=""
                      className="rounded-2xl h-auto w-full object-contain overflow-hidden !max-h-none"
                    />
                    <div className=''>
                      <a href="" className=''>
                        {cate.name}
                      </a>
                    </div>
                  </CardSolid>
                </SwiperSlide>
              ))}
            </Swiper>

          </div>
        </div>
      </CardSolid>

      {/* Brand */}
      <CardSolid className='flex flex-col max-w-[60%] w-full h-full mx-auto rounded-none p-4 gap-2'>
        <h2 className='font-bold text-red-700 text-2xl'>Thương hiệu</h2>
        <div className='w-full h-full grid grid-flow-col-dense grid-cols-3 grid-rows-1 gap-4 overflow-visible'>
          <CardSolid className='bg-amber-800 h-full overflow-hidden'>
            <img src="https://placehold.co/410" alt="" />
          </CardSolid>
          <div className='col-span-2   overflow-visible'>
            <Swiper
              spaceBetween={20}
              slidesPerView={4}
              centeredSlides={false}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              pagination={{
                clickable: true,
              }}
              navigation={true}
              modules={[Autoplay]}
              className="w-full h-full"
            >
              {brands.map((brand, index) => (
                <SwiperSlide
                  key={index}
                  className="flex h-full w-auto items-stretch justify-center overflow-visible"
                >
                  <div className="flex flex-col gap-[20px] w-full h-full items-center justify-center overflow-visible">
                    <CardSolid className="shadow-none rounded-2xl flex-1 flex items-center justify-center  overflow-hidden">
                      <a href="" className='no-underline'>
                        <img
                          src={brand[0].bg}
                          alt=""
                          className="h-full w-auto object-contain overflow-visible !max-w-none"
                        />
                      </a>
                      <div className='absolute pr-10 pl-10 pt-40 pb-15'>
                        <a href="" className=''>
                          <img
                            src={brand[0].logo}
                            alt=""
                            className="h-auto w-auto object-fit rounded-2xl shadow-xl"
                          />
                        </a>
                      </div>
                    </CardSolid>
                    <CardSolid className="rounded-2xl flex-1 flex items-center justify-center  overflow-hidden">
                      <a href="" className='no-underline'>
                        <img
                          src={brand[1].bg}
                          alt=""
                          className="h-full w-auto object-contain overflow-visible !max-w-none"
                        />
                      </a>
                      <div className='absolute pr-10 pl-10 pt-40 pb-15'>
                        <a href="" className=''>
                          <img
                            src={brand[1].logo}
                            alt=""
                            className="h-auto w-auto object-fit rounded-2xl shadow-xl"
                          />
                        </a>
                      </div>
                    </CardSolid>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

          </div>
        </div>
      </CardSolid>
    </div>
  );
};
