import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Outlet, useNavigate } from "react-router-dom";
import { FiLogOut, FiMenu, FiX } from "react-icons/fi";
import {
  FaHome,
  FaTasks,
  FaUsers,
  FaChartBar,
  FaCog,
  FaUserCircle,
} from "react-icons/fa";
import axios from "axios";

function EmployeeLayout() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  const dropdownRef = useRef(null); // For dropdown
  const sidebarRef = useRef(null); // For sidebar

  const sidebarItems = [
    { name: "Dashboard", icon: <FaHome />, route: "/dashboard" },
    { name: "Tasks", icon: <FaTasks />, route: "/tasks-manager" },
    { name: "Create Teams", icon: <FaUsers />, route: "/teams" },
    { name: "Analytics", icon: <FaChartBar />, route: "/analytics" },
    { name: "Settings", icon: <FaCog />, route: "/settings" },
  ];

  const handleLogout = async() => {
         const token = localStorage.getItem("token");
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/getEmail`, {
          headers: {
            token: token, 
          },
        });
        const userEmail=res.data.email;
    localStorage.removeItem(`profileImage_${userEmail}`);
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };
  
  useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) return;

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/getProfile`, {
        headers: { token },
      });

      const email = res.data.data.email;

      if (email) {
        // Check LocalStorage first
        const cachedImage = localStorage.getItem(`profileImage_${email}`);
        if (cachedImage) {
          setProfileImage(cachedImage);
        }

        // Update localStorage if backend me latest image mili
        if (res.data.data.profileImage) {
          localStorage.setItem(`profileImage_${email}`, res.data.data.profileImage);
          setProfileImage(res.data.data.profileImage);
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  fetchProfile();

  // 🟢 Listen to profile image update event
  const handleProfileUpdate = () => {
    console.log("Profile image updated event triggered!");
    fetchProfile();
  };

  window.addEventListener("profileImageUpdated", handleProfileUpdate);

  return () => {
    window.removeEventListener("profileImageUpdated", handleProfileUpdate);
  };
}, []);




  // 🟢 Close dropdown on outside click (but ignore sidebar clicks)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !sidebarRef.current?.contains(event.target) // Ignore sidebar clicks
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-purple-900 to-black relative overflow-hidden text-white">
      {/* Floating glowing background shapes */}
      <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-purple-700 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute top-20 right-20 w-[300px] h-[300px] bg-pink-600 rounded-full blur-3xl opacity-30 animate-bounce"></div>
      <div className="absolute bottom-0 left-1/2 w-[500px] h-[500px] bg-indigo-700 rounded-full blur-3xl opacity-20 animate-spin-slow"></div>

      {/* Sidebar */}
      <motion.aside
        ref={sidebarRef} // 👈 Added ref here
        initial={{ x: -250, opacity: 0 }}
        animate={{ x: isSidebarOpen ? 0 : -250, opacity: 1 }}
        transition={{ type: "spring", stiffness: 80 }}
        className="h-screen w-64 bg-black/60 backdrop-blur-xl shadow-2xl border-r border-purple-800/30 fixed z-30 flex flex-col"
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-purple-700/40">
          <motion.h1
            className="text-2xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            SmartManager
          </motion.h1>
          <button
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setIsSidebarOpen(false)}
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-4">
          {sidebarItems.map((item, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05, x: 8 }}
              onClick={() => navigate(item.route)}
              className="group flex items-center w-full px-4 py-3 rounded-xl bg-gradient-to-r from-gray-800 to-gray-900 text-gray-300 hover:text-purple-300 transition relative overflow-hidden shadow-md"
            >
              <span className="text-lg mr-3">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </motion.button>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-4 py-6 border-t border-purple-700/40">
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg hover:shadow-2xl transition"
          >
            <FiLogOut className="mr-3 text-lg" /> Logout
          </motion.button>
        </div>
      </motion.aside>

      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="md:hidden absolute top-5 left-5 z-40 bg-purple-600 p-2 rounded-lg shadow-lg hover:scale-105 transition"
      >
        <FiMenu size={22} />
      </button>

      {/* Main Content */}
      <div className="flex-1 min-h-screen ml-0 md:ml-64 transition-all duration-300">
        {/* Top Navbar */}
        <header className="flex justify-between items-center px-8 py-5 bg-black/30 backdrop-blur-xl shadow-lg border-b border-purple-700/40 relative z-20">
          <h2 className="text-xl font-bold text-purple-300">Dashboard</h2>
          <div className="relative" ref={dropdownRef}>
            {/* Avatar Button */}
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg hover:scale-105 transition overflow-hidden"
            >
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <FaUserCircle size={28} className="text-white" />
              )}
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {isProfileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-3 w-40 bg-black/80 backdrop-blur-md rounded-lg shadow-lg border border-purple-700/40"
                >
                  <button
                    onClick={() => navigate("/profile-manager")}
                    className="block w-full text-left px-4 py-2 text-gray-300 hover:text-purple-300 hover:bg-purple-700/20 transition rounded-t-lg"
                  >
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-300 hover:text-red-400 hover:bg-red-700/20 transition rounded-b-lg"
                  >
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default EmployeeLayout;
