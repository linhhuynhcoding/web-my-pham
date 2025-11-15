import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Link } from 'react-router-dom';
import { CardMotion } from '../components/Card';
import { CardSolid } from '../components/CardSolid';
import { useHomeScreen } from '../queries/product';
import { Loader2 } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';

export const HomePage = () => {
  const { data, isLoading, error } = useHomeScreen();

  const banners = [
    'https://media.hcdn.vn/hsk/1763115099846x250-37.jpg',
    'https://media.hcdn.vn/hsk/1763115514846x250-40.jpg',
    'https://media.hcdn.vn/hsk/1763032632home-30.jpg',
    'https://media.hcdn.vn/hsk/1763109782home-33.jpg',
    'https://media.hcdn.vn/hsk/1732069393web.jpg',
  ];

  const brandPairs = data?.brands?.reduce((result, value, index, array) => {
    if (index % 2 === 0) {
      const pair = array.slice(index, index + 2);
      result.push(pair);
    }
    return result;
  }, [] as (typeof data.brands)[]);


  const colors = [
    '!bg-orange-200',
    '!bg-yellow-200',
    '!bg-red-200',
    '!bg-green-200',
    '!bg-blue-200',
  ]

  // This seems to be static UI content, so I'll leave it as is.
  const features = [
    { label: "Hasaki Rẻ Hơn", img: "https://media.hcdn.vn/hsk/icon/hsk-icon-2025-11-15-1762941785.png", bg: "bg-pink-100" },
    { label: "Giao 2H", img: "https://media.hcdn.vn/hsk/icon/hsk-icon-nowfree-v2.png", bg: "bg-orange-100" },
    { label: "Nước Hoa Chính Hãng", img: "https://media.hcdn.vn/hsk/icon/hsk-icon-perfume-v2.png", bg: "bg-blue-100" },
    { label: "Clinic & S.P.A", img: "https://media.hcdn.vn/hsk/icon/hasaki-clinic.png", bg: "bg-green-100" },
    { label: "Clinic Deals", img: "https://media.hcdn.vn/hsk/icon/hsk-icon-clinic-deals-12-12-2024.png", bg: "bg-red-100" },
    { label: "Độc Quyền Hasaki", img: "https://media.hcdn.vn/hsk/icon/doc-quyen-hasaki.png", bg: "bg-yellow-100" },
    { label: "Đặt Hẹn", img: "https://media.hcdn.vn/hsk/icon/hasaki-dat-hen.png", bg: "bg-purple-100" },
    { label: "Cẩm Nang", img: "https://media.hcdn.vn/hsk/icon/hasaki-cam-nang.png", bg: "bg-blue-50" },
  ];

  const topSearches = [
    "kem chống nắng",
    "son",
    "tẩy trang",
    "La Roche-Posay",
    "serum",
    "sữa rửa mặt",
    "Obagi",
    "nước hoa",
    "mặt nạ",
    "kem dưỡng",
  ];


  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="animate-spin h-10 w-10" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">Error loading data: {error.message}</div>;
  }

  return (
    <div className='flex flex-col gap-4'>
      {/* Banner */}
      <CardMotion>
        <div className=" flex flex-col w-full bg-white">
          {/* Banner Swiper */}
          <div className="max-w-[60%] h-full mx-auto grid grid-flow-col-dense grid-cols-5 grid-rows-2 gap-2 items-center">
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
                    className="w-full h-full object-fit"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
            <div className='col-span-2 bg-amber-500'><img src="https://media.hcdn.vn/hsk/1739420045nowfree-4-846x250-13022025.jpg" alt="" /></div>
            <div className='col-span-2 bg-amber-500'><img src="https://media.hcdn.vn/hsk/1653555653banner-check-gia-web-v2-435x128.jpg" alt="" /></div>
          </div>

          {/* Icon section */}
          <div className="flex justify-center items-center flex-wrap gap-6 px-4 py-6 bg-white shadow-sm">
            {features.map((item, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center cursor-pointer hover:scale-105 transition-transform"
              >
                <div
                  className={`w-16 h-16 flex items-center justify-center rounded-full `}
                >
                  <img src={item.img} alt={item.label} className="w-12 h-12 rounded-xl" />
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
              {data?.categories?.map((cate, index) => (
                <SwiperSlide
                  key={index}
                  className="flex h-full w-auto items-stretch justify-center overflow-visible m-1"
                >
                  <Link to={`/category/${cate.id}`} className="no-underline w-full h-full">
                    <CardSolid className={`rounded-2xl flex-1 flex flex-col gap-2 p-2 items-center justify-center overflow-hidden ${colors[index % colors.length]}`} >
                      <img
                        src={cate.imageUrl}
                        alt=""
                        className="rounded-2xl h-auto w-full object-contain overflow-hidden !max-h-none"
                      />
                      <div className='text-center text-gray-800 font-medium'>{cate.name}</div>
                    </CardSolid>
                  </Link>
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
            <img src="https://media.hcdn.vn/hsk/1763019452popinnisfree1311_img_410x410_8c5088_fit_center.jpg" className='w-full h-full object-cover' alt="" />
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
              {brandPairs?.map((pair, index) => (
                <SwiperSlide
                  key={index}
                  className="flex h-full w-auto items-stretch justify-center overflow-visible"
                >
                  <div className="grid grid-cols-1 grid-rows-2 gap-[20px] w-full h-full  justify-between overflow-visible">
                    {pair.map((brand) => (
                      <CardSolid key={brand.id} className="shadow-none rounded-2xl flex-1 flex  overflow-hidden">
                        <Link to="/" >
                          <img
                            src={brand.bgUrl || "https://placehold.co/190x190"}
                            alt=""
                            className="h-full w-full object-cover overflow-visible"
                          />
                        </Link>
                        <div className='absolute pr-10 pl-10 pt-40 pb-15'>
                          <a href="#" className=''>
                            <img
                              src={brand.imageUrl}
                              alt=""
                              className="h-auto w-auto object-fit rounded-2xl shadow-xl"
                            />
                          </a>
                        </div>
                      </CardSolid>
                    ))}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

          </div>
        </div>
      </CardSolid>

      {/* Best Selling Products */}
      <CardSolid className='flex flex-col max-w-[60%] w-full h-full mx-auto rounded-none p-4 gap-2'>
        <h2 className='font-bold text-red-700 text-2xl'>Sản phẩm bán chạy</h2>
        <div className='w-full h-full overflow-visible items-stretch'>
          <Swiper
            spaceBetween={20}
            slidesPerView={4}
            navigation={true}

            modules={[Navigation]}
            className="w-full h-full justify-stretch items-stretch"
          >
            {data?.bestsellerProducts?.map((product) => (
              <SwiperSlide
                key={product.id}
                className="flex h-full w-auto items-stretch justify-center overflow-visible m-1"
              >
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </CardSolid>

      {/* Top Searches */}
      <CardSolid className='flex flex-col max-w-[60%] w-full h-full mx-auto rounded-none p-4 gap-4'>
        <h2 className='font-bold text-red-700 text-2xl'>Top tìm kiếm</h2>
        <div className='flex flex-wrap gap-3'>
          {topSearches.map((searchTerm, index) => (
            <a
              key={index}
              href="#"
              className="bg-gray-100 text-gray-800 text-sm font-medium px-4 py-2 rounded-full hover:bg-gray-200 transition-colors"
            >
              {searchTerm}
            </a>
          ))}
        </div>
      </CardSolid>
    </div>
  );
};
