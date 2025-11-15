import { Outlet, useLocation } from 'react-router-dom';
import './App.css';
import { Header } from './components/Header';
import { AnimatePresence, motion } from 'framer-motion';
import Footer from './components/Footer';
// import { PrivateRoute } from './components/PrivateRoute';
function App() {
  const location = useLocation();
  const currentPage = location.pathname === '/' || location.pathname === '' ? 'dashboard' : location.pathname.split('/').filter(Boolean)[0];

  return (
    <div className="h-full w-full flex flex-1 h-screen bg-gray-50 min-h-screen">
      {/* <Sidebar currentPage={currentPage} onNavigate={(page) => navigate(`/${page}`)} /> */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            // className="absolute inset-0"
            >
              {/* <PrivateRoute> */}
              <Outlet />
              {/* </PrivateRoute> */}
            </motion.div>
          </AnimatePresence>
          <Footer></Footer>
        </main>
      </div>
    </div>
  );
}


export default App;