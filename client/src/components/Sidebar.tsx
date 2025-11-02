/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    CreditCard,
    PiggyBank,
    TrendingUp,
    Calculator,
    Settings,
    User,
    Plus,
    MoreHorizontal,
    ChevronLeft,
    Bitcoin,
    Landmark,
    BarChart
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ACCOUNT_PATH, BUDGET_PATH, CRYPTO_PATH, DASHBOARD_PATH, DEBT_PATH, STOCK_PATH, TRANSACTION_PATH } from '../consts/common';

// Types
interface NavigationItem {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    path: string;
}

// Components
export const Sidebar = ({ currentPage, onNavigate }: { currentPage: string; onNavigate: (page: string) => void }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { t } = useTranslation();

    const menuItems: NavigationItem[] = [
        { icon: LayoutDashboard, label: t('sidebar.dashboard'), path: DASHBOARD_PATH },
        { icon: CreditCard, label: t('sidebar.accounts'), path: ACCOUNT_PATH },
        { icon: PiggyBank, label: t('sidebar.budgets'), path: BUDGET_PATH },
        { icon: TrendingUp, label: t('sidebar.transactions'), path: TRANSACTION_PATH },
        { icon: Bitcoin, label: t('sidebar.crypto'), path: CRYPTO_PATH },
        { icon: Landmark, label: t('sidebar.debt'), path: DEBT_PATH },
        { icon: BarChart, label: t('sidebar.stock'), path: STOCK_PATH },
    ];

    const toolItems: NavigationItem[] = [
        { icon: Calculator, label: t('sidebar.calculators'), path: 'calculators' }
    ];

    const settingItems: NavigationItem[] = [
        { icon: Settings, label: t('sidebar.settings'), path: 'settings' }
    ];

    return (
        <motion.div
            className={`bg-blue-800 h-screen text-white transition-all duration-300 ${isCollapsed ? 'w-32' : 'w-64'
                }`}
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
        >
            <div className="p-6 border-b border-indigo-800">
                <div className="flex items-center justify-between">
                    
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-1 rounded hover:bg-indigo-800 transition-colors"
                    >
                        <ChevronLeft className={`w-4 h-4 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
                    </button>
                </div>
            </div>

            <nav className="flex-1 px-4 py-6">
                <div className="space-y-6">
                    <div>
                        {!isCollapsed && <div className="text-xs font-semibold text-indigo-300 mb-3 px-2">MAIN</div>}
                        <div className="space-y-1">
                            {menuItems.map((item) => (
                                <button
                                    key={item.path}
                                    onClick={() => onNavigate(item.path)}
                                    className="w-full"
                                >
                                    <motion.div
                                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${currentPage === item.path
                                            ? 'bg-blue-800 text-white'
                                            : 'text-black hover:bg-indigo-800/50'
                                            }`}
                                        whileHover={{ x: 4 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <item.icon className="w-5 h-5" />
                                        {!isCollapsed && <span>{item.label}</span>}
                                    </motion.div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        {!isCollapsed && <div className="text-xs font-semibold text-indigo-300 mb-3 px-2">TOOLS</div>}
                        <div className="space-y-1">
                            {toolItems.map((item) => (
                                <button
                                    key={item.path}
                                    onClick={() => onNavigate(item.path)}
                                    className="w-full"
                                >
                                    <motion.div
                                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${currentPage === item.path
                                            ? 'bg-indigo-800 text-white'
                                            : 'text-black hover:bg-indigo-800/50'
                                            }`}
                                        whileHover={{ x: 4 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <item.icon className="w-5 h-5" />
                                        {!isCollapsed && <span>{item.label}</span>}
                                    </motion.div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        {!isCollapsed && <div className="text-xs font-semibold text-indigo-300 mb-3 px-2">SETTINGS</div>}
                        <div className="space-y-1">
                            {settingItems.map((item) => (
                                <button
                                    key={item.path}
                                    onClick={() => onNavigate(item.path)}
                                    className="w-full"
                                >
                                    <motion.div
                                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${currentPage === item.path
                                            ? 'bg-indigo-800 text-white'
                                            : 'text-black hover:bg-indigo-800/50'
                                            }`}
                                        whileHover={{ x: 4 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <item.icon className="w-5 h-5" />
                                        {!isCollapsed && <span>{item.label}</span>}
                                    </motion.div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </nav>
        </motion.div>
    );
};
