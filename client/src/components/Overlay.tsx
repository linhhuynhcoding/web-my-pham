import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

interface OverlayProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export const Overlay = ({ isOpen, onClose, children }: OverlayProps) => {
    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
};
