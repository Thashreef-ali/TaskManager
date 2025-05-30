import { ChevronLeft, UserCircle, User, Mail, Save, Shield, LogOut,Lock } from "lucide-react";
import React, { useEffect, useState } from "react";
import { data, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from 'axios'

const API_URl = "https://taskmanager-backend-v5cr.onrender.com";

function Profile({ setcurrentUser, onLogout }) {
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const navigate = useNavigate();
  const BACK_BUTTON =
    "flex items-center text-gray-600 hover:text-purple-600 mb-8 transition-colors duration-200";
  const SECTION_WRAPPER =
    "bg-white rounded-xl shadow-sm border border-purple-100 p-6";
  const personalFields = [
    { name: "name", type: "text", placeholder: "Full Name", icon: User },
    { name: "email", type: "email", placeholder: "Email", icon: Mail },
  ];
  const INPUT_WRAPPER =
  "flex items-center border border-purple-100 rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-purple-500 transition-all duration-200";
  const FULL_BUTTON =
    "w-full bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white py-2.5 rounded-lg hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2"
  useEffect(()=>{
    const token = localStorage.getItem('token')
    if(!token) return 
    axios.get(`${API_URl}/api/me`,{
      headers:{Authorization:`Bearer ${token}`},
      withCredentials:true
    })
    .then(({data})=>{
      if(data.success)
        setProfile({name:data.user.name, email:data.user.email})
      else toast.error(data.message)
    })
    .catch(()=>toast.error("UNABLE TO LOAD PROFILE."))
  },[])

  const saveProfile = async (e)=>{
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const {data} =await axios.put(
        `${API_URl}/api/profile`,
        {name:profile.name,email:profile.email},
        {headers:{Authorization: `Bearer ${token}`}},
      )
      if(data.success){
        setcurrentUser((prev)=>({
          ...prev,
          name:profile.name,
          avatar : `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=random`

        }))
        toast.success('Profile Updated')
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Profile Update failed')
    }
  }
  const securityFields = [
    { name: "current", placeholder: "Current Password" },
    { name: "new", placeholder: "New Password" },
    { name: "confirm", placeholder: "Confirm Password" },
];
const changePassword = async(e)=>{
  e.preventDefault()
  if(password.new !== password.confirm){
    return toast.error('Password do not match')
  }
  try {
    const token = localStorage.getItem('token')
    const {data} = await axios.put(
      `${API_URl}/api/password`,
      {currentPassword:password.current,newPassword:password.new},
      {headers:{Authorization: `Bearer ${token}`}}
    )
    if(data.success){
      toast.success('Password Changed')
      setPassword({current:"",new:"",confirm:""})
    }else toast.error(data.message)
  } catch (error) {
      toast.error(error.response?.data?.message || 'Profile change failed')
    }
}
    return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="max-w-4xl mx-auto p-6">
        <button onClick={() => navigate(-1)} className={BACK_BUTTON}>
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to Dashboard
        </button>
        <div className=" flex items-center gap-4 mb-8">
          <div
            className="w-16 h-16 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600
            flex items-center justify-center text-white text-2xl font-bold shadow-md"
          >
            {profile.name ? profile.name[0].toUpperCase() : "U"}
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800 ">
              Account Setting
            </h2>
            <p className="text-gray-500 text-sm">
              Manage your profile and security settings
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <section className={SECTION_WRAPPER}>
            <div className="flex items-center gap-2 mb-6">
              <UserCircle className="text-purple-500 w-5 h-5" />
              <h2 className="text-xl font-semibold text-gray-800">
                Personal Information
              </h2>
            </div>

            <form onSubmit={saveProfile} className="space-y-6">
              {personalFields.map(({ name, type, placeholder, icon: Icon }) => (
                <div key={name} className={INPUT_WRAPPER}>
                  <Icon className="w-5 h-5 text-purple-500 mr-2" />
                  <input
                    type={type}
                    placeholder={placeholder}
                    value={profile[name]}
                    onChange={(e) =>
                      setProfile({ ...profile, [name]: e.target.value })
                    }
                    className="w-full focus:outline-none text-sm"
                    required
                  />
                </div>
              ))}
           
             <button className={FULL_BUTTON}>
              <Save className="w-4 h-4"/> Save changes
             </button>

            </form>
          </section>
          <section className={SECTION_WRAPPER}>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-purple-500"/>
              <h2 className="text-xl font-semibold text-gray-800">Security</h2>
            </div>
            <form onSubmit={changePassword} className="space-y-4">
              {securityFields.map(({name,placeholder})=>(
                <div key={name} className={INPUT_WRAPPER}>
                  <Lock className="w-5 h-5 text-purple-500 mr-2" />
                  <input
                    type='password'
                    placeholder={placeholder}
                    value={password[name]}
                    onChange={(e) =>
                      setPassword({ ...password, [name]: e.target.value })
                    }
                    className="w-full focus:outline-none text-sm"
                    required
                  />
                </div>
              ))}
              <button className={FULL_BUTTON}>
                 <Shield className="w-4 h-4"/> Change Password
              </button>
              <div className="mt-8 pt-8 border-t border-purple-100">
                <h3 className="text-red-600 font-semibold mb-4 flex items-center gap-2">
                  <LogOut className="w-4 h-4 "/>Danger Zone
                </h3>
                <button className='w-full text-red-600 border border-red-200 py-2.5 rounded-lg hover:bg-red-50 transition-colors 
                duration-200' onClick={onLogout}>
                  Logout
                </button>
              </div>

            </form>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Profile;
