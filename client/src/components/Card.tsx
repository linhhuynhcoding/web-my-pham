import { motion } from "framer-motion";

export const CardMotion = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
    return (
        <motion.div
            className={`bg-white rounded-xl shadow-sm border border-gray-100 ${className}`}
            initial={{ y: 20, opacity: 1 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
        >
            {children}
        </motion.div>
    );
};
