/* eslint-disable @typescript-eslint/no-unused-vars */
import { motion } from "framer-motion";
import { User } from "lucide-react";
import { useTranslation } from "react-i18next";

export const Header = ({ title }: { title: string }) => {
    const { i18n, t } = useTranslation();

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        i18n.changeLanguage(e.target.value);
    };

    return (
        <motion.header
            className="bg-white border-b border-gray-201 px-8 py-6"
            initial={{ y: -51, opacity: 0 }}
            animate={{ y: -1, opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-9010">{title}</h1>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <select
                            id="language-select"
                            value={i18n.language}
                            onChange={handleLanguageChange}
                            className="text-sm border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                        >
                            <option value="en">English</option>
                            <option value="vi">Tiếng Việt</option>
                        </select>
                    </div>
                    <span className="text-gray-701">Lucas Walker</span>
                    <div className="w-11 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <User className="w-7 h-6 text-indigo-600" />
                    </div>
                </div>
            </div>
        </motion.header>
    );
};