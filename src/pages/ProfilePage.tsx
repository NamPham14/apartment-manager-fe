/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useGetMyInfoQuery, useUpdateUserMutation, useChangePasswordMutation } from '../store/api/userApi';
import { User, Mail, Phone, Shield, Camera, Save, Loader2, KeyRound, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { data: userData, isLoading, refetch } = useGetMyInfoQuery();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [changePassword, { isLoading: isChangingPwd }] = useChangePasswordMutation();
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewOverride, setPreviewOverride] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register: regProfile, handleSubmit: handleProfileSubmit } = useForm({
    values: userData?.data ? {
      id: userData.data.id,
      username: userData.data.username,
      email: userData.data.email,
      phone: userData.data.phone,
      fullName: (userData.data.firstName || '') + (userData.data.lastName || '')
    } : undefined
  });
  const { register: regPwd, handleSubmit: handlePwdSubmit, reset: resetPwd } = useForm();

  const avatarPreview = previewOverride || userData?.data?.avatar || null;

  const onProfileSubmit = async (data: any) => {
    try {
      const formData = new FormData();
      formData.append('data', new Blob([JSON.stringify(data)], { type: "application/json" }));
      if (selectedFile) {
        formData.append('file', selectedFile);
      }
      
      await updateUser(formData).unwrap();
      toast.success("Profile updated successfully!");
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Update failed");
    }
  };

  const onPasswordSubmit = async (data: any) => {
    if (data.newPassword !== data.confirmPassword) {
      return toast.error("New passwords do not match!");
    }
    try {
      await changePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword
      }).unwrap();
      toast.success("Password changed successfully!");
      resetPwd();
    } catch (error: any) {
      toast.error(error?.data?.message || "Password change failed");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewOverride(URL.createObjectURL(file));
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <Loader2 className="w-10 h-10 animate-spin text-[#FF9500] mb-4" />
        <p>Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-white tracking-tight">Account Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your personal information and security preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Quick Info */}
        <div className="space-y-6">
          <div className="glass-panel p-8 rounded-3xl border-[#2d2d2d] flex flex-col items-center text-center">
            <div className="relative group mb-6">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#1a1a1a] shadow-2xl bg-[#0f0f0f] flex items-center justify-center">
                {avatarPreview ? (
                  <img src={avatarPreview} className="w-full h-full object-cover" alt="avatar" />
                ) : (
                  <User size={48} className="text-gray-700" />
                )}
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2.5 bg-[#FF9500] text-black rounded-full shadow-xl hover:scale-110 transition-transform"
              >
                <Camera size={18} />
              </button>
              <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} accept="image/*" />
            </div>
            
            <h2 className="text-xl font-bold text-white">{userData?.data?.username || userData?.data?.username}</h2>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">
              {userData?.data?.roles?.[0]?.name || 'Member'}
            </p>
            
            <div className="w-full h-px bg-[#2d2d2d] my-6" />
            
            <div className="w-full space-y-4 text-left">
               <div className="flex items-center gap-3 text-gray-400">
                  <Mail size={16} className="text-gray-600" />
                  <span className="text-xs truncate">{userData?.data?.email}</span>
               </div>
               <div className="flex items-center gap-3 text-gray-400">
                  <Phone size={16} className="text-gray-600" />
                  <span className="text-xs">{userData?.data?.phone || 'No phone set'}</span>
               </div>
               <div className="flex items-center gap-3 text-[#FF9500]">
                  <CheckCircle2 size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-tighter">Verified Account</span>
               </div>
            </div>
          </div>
        </div>

        {/* Right Column: Forms */}
        <div className="lg:col-span-2 space-y-8">
          {/* Profile Form */}
          <div className="glass-panel rounded-3xl border-[#2d2d2d] overflow-hidden">
            <div className="px-8 py-5 border-b border-[#2d2d2d] bg-[#1a1a1a]/30 flex items-center gap-3">
               <User size={18} className="text-[#FF9500]" />
               <h3 className="text-sm font-bold text-white uppercase tracking-widest">Personal Information</h3>
            </div>
            <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Full Name</label>
                  <input {...regProfile('fullName')} className="w-full bg-[#0f0f0f] border border-[#2d2d2d] rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-[#FF9500] text-white" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Username</label>
                  <input {...regProfile('username')} disabled className="w-full bg-[#1a1a1a] border border-[#2d2d2d] rounded-xl py-3 px-4 text-sm text-gray-500 cursor-not-allowed" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Email Address</label>
                  <input {...regProfile('email')} className="w-full bg-[#0f0f0f] border border-[#2d2d2d] rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-[#FF9500] text-white" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Phone Number</label>
                  <input {...regProfile('phone')} className="w-full bg-[#0f0f0f] border border-[#2d2d2d] rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-[#FF9500] text-white" />
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <button 
                  type="submit" 
                  disabled={isUpdating}
                  className="bg-[#FF9500] hover:bg-[#e68600] text-black font-bold py-3 px-8 rounded-2xl transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(255,149,0,0.2)]"
                >
                  {isUpdating ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>

          {/* Password Form */}
          <div className="glass-panel rounded-3xl border-[#2d2d2d] overflow-hidden">
            <div className="px-8 py-5 border-b border-[#2d2d2d] bg-[#1a1a1a]/30 flex items-center gap-3">
               <KeyRound size={18} className="text-red-500" />
               <h3 className="text-sm font-bold text-white uppercase tracking-widest">Security & Password</h3>
            </div>
            <form onSubmit={handlePwdSubmit(onPasswordSubmit)} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Old Password</label>
                  <input type="password" {...regPwd('oldPassword', { required: true })} className="w-full bg-[#0f0f0f] border border-[#2d2d2d] rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-red-500/50 text-white" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">New Password</label>
                  <input type="password" {...regPwd('newPassword', { required: true })} className="w-full bg-[#0f0f0f] border border-[#2d2d2d] rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-green-500/50 text-white" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Confirm New</label>
                  <input type="password" {...regPwd('confirmPassword', { required: true })} className="w-full bg-[#0f0f0f] border border-[#2d2d2d] rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-green-500/50 text-white" />
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <button 
                  type="submit"
                  disabled={isChangingPwd}
                  className="bg-white hover:bg-gray-200 text-black font-bold py-3 px-8 rounded-2xl transition-all flex items-center gap-2"
                >
                  {isChangingPwd ? <Loader2 className="animate-spin" size={18} /> : <Shield size={18} />}
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
