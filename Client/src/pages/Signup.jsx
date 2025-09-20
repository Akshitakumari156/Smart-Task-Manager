import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
import {ToastContainer} from "react-toastify"
import { handleError, handleSuccess } from "../utils/utils";
import { Briefcase, Users } from "lucide-react"; // For role icons
function Signup() {
    const navigate=useNavigate();
    const [SignupInfo,SetSignupInfo]=useState({
        name:"",
        email:"",
        password:"",
        role:""
    })
    useEffect(() => {
    console.log("SignupInfo updated:", SignupInfo);
  }, [SignupInfo]);
    const handlechange=(e)=>{
       const {name,value}=e.target;
       console.log(name,value);
       const copySignupInfo={...SignupInfo};
       copySignupInfo[name]=value;
       SetSignupInfo(copySignupInfo)
       console.log(SignupInfo);
    }
    const handleSignup=async (e)=>{
          e.preventDefault();
          const{name,email,password,role}=SignupInfo;
          if(!name || !email || !password || !role){
            return handleError("All fields are required");
          }
          try{
             const url=`${import.meta.env.VITE_API_URL}/auth/signup`
             const response=await fetch(url,{
                method:"POST",
                headers:{
                    'Content-type':'application/json'
                },
                body:JSON.stringify(SignupInfo)
             })
             const result=await response.json();
             const {success,message,error}=result;
             if(success){
                handleSuccess(message);
                // localStorage.setItem("token",jwtToken);
                // localStorage.setItem('name',name);
                setTimeout(()=>{
                    navigate("/login");
                },1000);
             }else if(error){
                const details=error?.details[0].message;
                handleError(details)
             }else if(!success){
                handleError(message);
             }
             console.log(result);
          }catch(err){
              console.log(err);
          }
    }
  return (
    <div className="flex min-h-screen bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white">
     {/* Left Side 3D Panel */}
<div className="hidden md:flex w-1/2 items-center justify-center relative overflow-hidden">
  <div className="absolute -top-20 -left-20 w-96 h-96 bg-purple-700 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-pulse"></div>
  <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-700 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-bounce"></div>

  <div className="text-center z-10 p-8 transform transition duration-500 hover:scale-110 hover:rotate-2">
    <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent drop-shadow-2xl animate-pulse">
      Smart Team <br /> Task Management
    </h1>
    <p className="mt-6 text-lg text-gray-300 tracking-wide animate-bounce">
      The <span className="text-purple-400 font-semibold">Future</span> of Collaboration 🚀
    </p>
    <p className="mt-3 text-sm text-gray-400 italic animate-pulse">
      Manage tasks, boost teamwork, and achieve more with style ✨
    </p>
  </div>
</div>

      {/* Right Side Signup Form */}
      <div className="flex w-full md:w-1/2 items-center justify-center p-6">
        <div className="w-full max-w-md p-8 bg-gray-800/40 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-700 transform transition duration-500 hover:scale-105 hover:rotate-1">
          <h2 className="text-4xl font-extrabold text-center mb-6 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Create Account
          </h2>
          <form className="space-y-5" onSubmit={handleSignup}>
            <div className="group">
              <label className="block text-sm mb-1">Name</label>
              <input
              onChange={handlechange}
                type="text"
                name="name"
                className="w-full p-3 rounded-lg bg-gray-900/60 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 group-hover:shadow-lg group-hover:shadow-purple-500/30"
                placeholder="Enter your name"
                value={SignupInfo.name}
              />
            </div>
            <div className="group">
              <label className="block text-sm mb-1">Email</label>
              <input
                onChange={handlechange}
                type="email"
                name="email"
                className="w-full p-3 rounded-lg bg-gray-900/60 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 group-hover:shadow-lg group-hover:shadow-purple-500/30"
                placeholder="Enter your email"
                value={SignupInfo.email}
              />
            </div>
            <div className="group">
              <label className="block text-sm mb-1">Password</label>
              <input
                onChange={handlechange}
                type="password"
                name="password"
                className="w-full p-3 rounded-lg bg-gray-900/60 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 group-hover:shadow-lg group-hover:shadow-purple-500/30"
                placeholder="Set your password"
                value={SignupInfo.password}
              />
            </div>
            <div className="group">
              <label className="block text-sm mb-2">Role</label>
              <div className="grid grid-cols-2 gap-4">
                {/* Manager Card */}
                <div
                  onClick={() => SetSignupInfo({ ...SignupInfo, role: "manager" })} name="role"
                  className={`cursor-pointer p-4 rounded-xl border transition-all duration-300 
                    ${
                      SignupInfo.role === "manager"
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white border-transparent shadow-lg scale-105"
                        : "bg-gray-900/60 border-gray-600 hover:border-purple-500 hover:shadow-md"
                    }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <Briefcase className="w-8 h-8" />
                    <p className="font-medium">Manager</p>
                  </div>
                </div>

                {/* Employee Card */}
                <div
                  onClick={() => SetSignupInfo({ ...SignupInfo, role: "employee" })}name="role"
                  className={`cursor-pointer p-4 rounded-xl border transition-all duration-300 
                    ${
                      SignupInfo.role === "employee"
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white border-transparent shadow-lg scale-105"
                        : "bg-gray-900/60 border-gray-600 hover:border-purple-500 hover:shadow-md"
                    }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <Users className="w-8 h-8" />
                    <p className="font-medium">Employee</p>
                  </div>
                </div>
              </div>
              {SignupInfo.role && (
                <p className="mt-2 text-xs text-purple-400">
                  Selected Role: <span className="font-semibold">{SignupInfo.role}</span>
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-full p-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-pink-600 hover:to-purple-600 rounded-xl font-semibold shadow-lg shadow-purple-800/50 transform transition hover:scale-105"
            >
              Sign Up
            </button>
          </form>
          <p className="text-center text-gray-400 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-purple-400 hover:text-pink-400">
              Login
            </Link>
          </p>
        </div>
      </div>
       <ToastContainer />
    </div>
  );
}

export default Signup;
