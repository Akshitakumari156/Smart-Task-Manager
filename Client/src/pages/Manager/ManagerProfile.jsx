import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, Upload, Save } from "lucide-react";
import axios from "axios";
import { handleError } from "../../utils/utils";
const ManagerProfile = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    description: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedName = localStorage.getItem("loggedInUser");
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("No token found!");
          return;
        }
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/getEmail`, {
          headers: {
            token: token, 
          },
        });
        setFormData({
          name: storedName || "",
          email: res.data.email || "",
          description: "",
        });
      } catch (error) {
        console.error("Error fetching email:", error.response?.data || error.message);
      }
    };

    fetchUserData();
  }, []);

  const HandleImageUpload=async (e)=>{
    try{
      if(!profileImage){
      return handleError("Select Any Image");
    }
    const token = localStorage.getItem("token");
    const formDataToSend = new FormData();
    formDataToSend.append("image",profileImage);
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/user/upload`,
      formDataToSend,
      {
        headers: {
          token: token,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (res.data.success) {
      alert("Image uploaded successfully!");
      console.log("Uploaded user:", res.data.data);

      // Update preview image with new URL from Cloudinary
      setPreviewImage(res.data.data.profileImage);
      const updatedProfile = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/getProfile`, {
         headers: { token: localStorage.getItem("token") },
      });
        const userEmail=updatedProfile.data.data.email;
        console.log(userEmail);
      localStorage.setItem(`profileImage_${userEmail}`, updatedProfile.data.data.profileImage);
      window.dispatchEvent(new Event("profileImageUpdated"));
    } else {
      handleError(res.data.message);
    }

    }catch(error){
      console.log(error);
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
     e.preventDefault();
     alert("Profile Saved Successfully!");
    window.dispatchEvent(new Event("profileImageUpdated"));
    console.log({
      ...formData,
      profileImage,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex justify-center items-center p-6">
      {/* Animated container */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-lg bg-white/10 backdrop-blur-xl shadow-2xl rounded-3xl p-8 border border-gray-700 relative overflow-hidden"
      >
        {/* Glowing orb background */}
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>

        {/* Header */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-extrabold text-center text-white mb-8 tracking-wide"
        >
          Manager Profile
        </motion.h2>

        {/* Profile Image Upload */}
        <motion.div whileHover={{ scale: 1.05 }} className="flex justify-center mb-8 relative">
  <label
    htmlFor="profileImage"
    className="cursor-pointer relative w-36 h-36 rounded-full overflow-hidden border-4 border-blue-400 shadow-xl group"
  >
    {previewImage ? (
      <img
        src={previewImage}
        alt="Profile Preview"
        className="object-cover w-full h-full group-hover:scale-105 transition duration-300"
      />
    ) : (
      <div className="flex flex-col justify-center items-center w-full h-full text-gray-300 bg-gray-800 group-hover:bg-gray-700 transition duration-300">
        <Upload size={28} className="mb-2" />
        <span className="text-xs">Choose File</span>
      </div>
    )}
    <input
      type="file"
      id="profileImage"
      accept="image/*"
      onChange={handleImageChange}
      className="hidden"
    />
  </label>
</motion.div>

{/* Upload Button */}
<button
  type="button"
  onClick={HandleImageUpload}
  className="w-full mt-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
>
  Upload Image
</button>


        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          {/* Name Field */}
          <motion.div whileFocus={{ scale: 1.02 }}>
            <label className="block text-gray-300 mb-2 flex items-center gap-2">
              <User size={18} /> Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              readOnly
              className="w-full px-4 py-2 rounded-xl border border-gray-700 bg-gray-900 text-white focus:ring-2 focus:ring-blue-500 cursor-not-allowed"
            />
          </motion.div>

          {/* Email Field */}
          <motion.div whileFocus={{ scale: 1.02 }}>
            <label className="block text-gray-300 mb-2 flex items-center gap-2">
              <Mail size={18} /> Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              readOnly
              className="w-full px-4 py-2 rounded-xl border border-gray-700 bg-gray-900 text-white focus:ring-2 focus:ring-purple-500 cursor-not-allowed"
            />
          </motion.div>

          {/* Description */}
          <motion.div whileFocus={{ scale: 1.02 }}>
            <label className="block text-gray-300 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Write something about yourself..."
              className="w-full px-4 py-2 rounded-xl border border-gray-700 bg-gray-900 text-white focus:ring-2 focus:ring-green-500 resize-none"
              rows="4"
              required
            />
          </motion.div>

          {/* Save Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full flex justify-center items-center gap-2 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:from-blue-600 hover:to-purple-700 transition duration-300"
          >
            <Save size={20} />
            Save Profile
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default ManagerProfile;
