// Sidebar.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { X, User, ClockHistory } from 'lucide-react';
import { TbCategory } from 'react-icons/tb';

const Sidebar = ({ isOpen, setIsOpen, isLoggedIn, userName, setIsLoggedIn }) => {
  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsOpen(false);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black z-40"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-y-0 right-0 z-50 w-64 bg-white shadow-lg p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">
                  {isLoggedIn ? `Hey, ${userName}` : 'Hey, Guest'}
                </h2>
                <button onClick={() => setIsOpen(false)} className="p-2 rounded-md hover:bg-gray-100">
                  <X size={24} />
                </button>
              </div>
              
              <nav>
                <ul>
                  <li className="mb-4">
                    <Link to="/categories" onClick={() => setIsOpen(false)} className="flex items-center text-gray-700 hover:text-[#008CFF]-600">
                      <TbCategory size={20} className="mr-3" />
                      Categories
                    </Link>
                  </li>
                  <li className="mb-4">
                    <Link to="/account" onClick={() => setIsOpen(false)} className="flex items-center text-gray-700 hover:text-[#008CFF]-600">
                      <User size={20} className="mr-3" />
                      Account
                    </Link>
                  </li>
                  <li className="mb-4">
                    <Link to="/history" onClick={() => setIsOpen(false)} className="flex items-center text-gray-700 hover:text-[#008CFF]-600">
                      <ClockHistory size={20} className="mr-3" />
                      History
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
            
            <div className="mt-auto">
              {isLoggedIn ? (
                <button 
                  onClick={handleLogout}
                  className="w-full py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Log Out
                </button>
              ) : (
                <Link
                  to="/signin"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center py-2 bg-[#008CFF] text-white rounded-md hover:bg-[#008CFF]"
                >
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;