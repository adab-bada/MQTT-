import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { useUiStore } from '../../stores/useUiStore';
import { AnimatePresence, motion } from 'framer-motion';

/**
 * @description Komponen layout utama aplikasi dengan tema otomotif.
 * Mengelola responsivitas sidebar dan area konten utama.
 */
const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isSidebarOpen, toggleSidebar } = useUiStore();
  const AnyAnimatePresence = AnimatePresence as any;

  return (
    <div className="flex flex-col h-screen bg-dark-bg text-dark-text overflow-hidden font-sans antialiased">
      {/* Background Decorative Element */}
      <div className="fixed inset-0 bg-carbon-pattern opacity-50 pointer-events-none" />

      <Header />

      <div className="flex flex-1 overflow-hidden relative z-10">
        {/* Sidebar untuk Desktop */}
        <div className="hidden md:flex">
          <Sidebar />
        </div>

        {/* Sidebar untuk Mobile (Overlay) */}
        <AnyAnimatePresence>
          {isSidebarOpen ? (
            <div key="mobile-sidebar-container">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-30 md:hidden"
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
            </div>
          ) : null}
        </AnyAnimatePresence>

        <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
