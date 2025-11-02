import { Outlet, useLocation, useNavigate, useOutlet } from 'react-router-dom';
import './App.css';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { AnimatePresence, motion } from 'framer-motion';

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPage = location.pathname === '/' || location.pathname === '' ? 'dashboard' : location.pathname.split('/').filter(Boolean)[0];
  const outlet = useOutlet();

  const getPageTitle = (page: string) => {
    return page.charAt(0).toUpperCase() + page.slice(1);
  };

  return (
    <div className="h-full w-full flex flex-1 h-screen bg-gray-50 min-h-screen">
      <Sidebar currentPage={currentPage} onNavigate={(page) => navigate(`/${page}`)} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header title={getPageTitle(currentPage)} />
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            // className="absolute inset-0"
            >
              <Outlet />
            </motion.div>
            )
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default App;