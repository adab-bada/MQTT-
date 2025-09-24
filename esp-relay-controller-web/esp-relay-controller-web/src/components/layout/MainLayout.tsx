import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { useUiStore } from '../../stores/useUiStore';
import { AnimatePresence, motion } from 'framer-motion';

/**
 * @description Komponen layout utama aplikasi.
 * Menggabungkan Header, Sidebar, dan area konten utama dengan perilaku responsif.
 * @param children - Komponen anak yang akan dirender di area konten utama.
 */
const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isSidebarOpen, toggleSidebar } = useUiStore();

  return (
    <div className="flex flex-col h-screen bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar untuk Desktop */}
        <div className="hidden md:flex">
          <Sidebar />
        </div>

        {/* Sidebar untuk Mobile (Overlay) */}
        <AnimatePresence>
          <>
            {isSidebarOpen ? (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                  onClick={toggleSidebar}
                />
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="fixed top-0 left-0 h-full z-40 md:hidden"
                >
                  <Sidebar />
                </motion.div>
              </>
            ) : null}
          </>
        </AnimatePresence>

        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
