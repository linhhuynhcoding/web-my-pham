import { motion } from "framer-motion";
import { Search, User, ShoppingCart, MapPin, Phone, ShieldCheck, Store } from "lucide-react";
import { useTranslation } from "react-i18next";

export const Header = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-red-400 text-white"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-3">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="bg-white text-green-800 rounded-full w-9 h-9 flex items-center justify-center font-bold text-lg">
            L
          </div>
          <div>
            <p className="text-xl font-semibold tracking-wide">LASAKI.VN</p>
            <p className="text-xs text-gray-100">Chất lượng thật - Giá trị thật!</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 mx-8">
          <div className="flex items-center bg-white rounded-full overflow-hidden px-4 py-2">
            <input
              type="text"
              placeholder="Tìm sản phẩm, thương hiệu bạn mong muốn..."
              className="flex-1 text-sm text-gray-800 outline-none"
            />
            <Search className="text-green-700" size={20} />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-1">
            <User size={20} />
            <span>Đăng nhập / Đăng ký</span>
          </div>
          <div className="flex items-center gap-1">
            <Store size={20} />
            <span>Hệ thống cửa hàng</span>
          </div>
          <div className="flex items-center gap-1">
            <ShieldCheck size={20} />
            <span>Bảo hành</span>
          </div>
          <div className="flex items-center gap-1">
            <Phone size={20} />
            <span>Hỗ trợ</span>
          </div>
          <div className="relative">
            <ShoppingCart size={22} />
            <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">0</span>
          </div>
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="bg-red-100 text-green-900 text-sm px-8 py-2 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button className="font-medium">DANH MỤC</button>
          <button>HASAKI DEALS</button>
          <button>HOT DEALS</button>
          <button>THƯƠNG HIỆU</button>
          <button>HÀNG MỚI VỀ</button>
          <button>BÁN CHẠY</button>
          <button>CLINIC & SPA</button>
          <button>DERMAHAIR</button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-gray-700">Tải ứng dụng</span>
          <div className="flex items-center gap-1 text-green-800 font-semibold">
            <MapPin size={16} />
            <span>Chọn khu vực của bạn</span>
          </div>
          <select
            id="language-select"
            value={i18n.language}
            onChange={handleLanguageChange}
            className="ml-4 text-sm border border-green-400 bg-white text-green-800 rounded-md px-2 py-1 focus:outline-none"
          >
            <option value="vi">VN</option>
            <option value="en">EN</option>
          </select>
        </div>
      </div>
    </motion.header>
  );
};
