import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Footer from '../components/Footer';
import { useAuthStore } from '../store/authStore';
import Navbar from "../components/Navbar";

const ProfilePage = () => {
    const { user, updateProfile, isLoading, error } = useAuthStore();
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [mobile, setMobile] = useState(user?.mobile || '');
    const [speciality, setSpeciality] = useState(user?.speciality || '');
    const [imageFile, setImageFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(user?.image || null);
    const [isEditMode, setIsEditMode] = useState(false);

    const isDoctor = user?.role === 1;

    useEffect(() => {
        if (imageFile) {
            const url = URL.createObjectURL(imageFile);
            setPreviewImage(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setPreviewImage(user?.image || null);
        }
    }, [imageFile, user]);

    const handleSave = async () => {
        const formData = new FormData();
        if (imageFile) formData.append('image', imageFile);
        formData.append('email', email);
        formData.append('mobile', mobile);
        formData.append('speciality', speciality);
        formData.append('name', name);
        try {
            await updateProfile(formData);
            setIsEditMode(false);
            setImageFile(null);
            toast.success('Profile updated successfully.');
        } catch {
            toast.error('Failed to update profile');
        }
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) setImageFile(file);
    };

    const initials = user?.name ? user.name.slice(0, 2).toUpperCase() : "MB";

    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16 min-h-screen bg-gradient-to-br from-indigo-50 to-slate-100 px-4">
                <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-extrabold text-slate-800">My Profile</h1>
                        <p className="text-slate-500 mt-1">Manage your account settings</p>
                    </div>

                    <div className="card-premium p-8">
                        {/* Avatar */}
                        <div className="flex flex-col items-center mb-8">
                            <div className="relative group">
                                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-indigo-200 shadow-lg">
                                    {previewImage ? (
                                        <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center text-white text-3xl font-bold">
                                            {initials}
                                        </div>
                                    )}
                                </div>
                                {isEditMode && (
                                    <label
                                        htmlFor="avatar-upload"
                                        className="absolute inset-0 rounded-full flex items-center justify-center bg-black/40 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <div className="text-center">
                                            <svg className="w-6 h-6 text-white mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span className="text-white text-xs font-medium">Change</span>
                                        </div>
                                    </label>
                                )}
                                {isEditMode && (
                                    <input id="avatar-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                )}
                            </div>

                            <div className="mt-4 text-center">
                                <h2 className="text-xl font-bold text-slate-800 capitalize">{user?.name}</h2>
                                <div className="flex items-center justify-center gap-2 mt-2">
                                    <span className={`text-xs px-3 py-1 rounded-full font-semibold ${isDoctor ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                        {isDoctor ? 'Doctor' : 'Patient'}
                                    </span>
                                    {user?.is_verified && (
                                        <span className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full font-semibold bg-indigo-100 text-indigo-700">
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                            Verified
                                        </span>
                                    )}
                                </div>
                                {user?.lastLogin && (
                                    <p className="text-xs text-slate-400 mt-2">
                                        Last login: {new Date(user.lastLogin).toLocaleDateString('en-IN', {
                                            day: 'numeric', month: 'short', year: 'numeric',
                                            hour: '2-digit', minute: '2-digit',
                                        })}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Fields */}
                        <div className="space-y-5">
                            <div>
                                <label className="input-label" htmlFor="profile-name">Full Name</label>
                                <input id="profile-name" type="text" value={name} onChange={(e) => setName(e.target.value)} disabled={!isEditMode} className={`input-field ${!isEditMode ? 'opacity-60 cursor-not-allowed' : ''}`} />
                            </div>
                            <div>
                                <label className="input-label" htmlFor="profile-email">Email Address</label>
                                <input id="profile-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={!isEditMode} className={`input-field ${!isEditMode ? 'opacity-60 cursor-not-allowed' : ''}`} />
                            </div>
                            <div>
                                <label className="input-label" htmlFor="profile-mobile">Mobile Number</label>
                                <input id="profile-mobile" type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} disabled={!isEditMode} className={`input-field ${!isEditMode ? 'opacity-60 cursor-not-allowed' : ''}`} />
                            </div>
                            {isDoctor && (
                                <div>
                                    <label className="input-label" htmlFor="profile-speciality">Speciality</label>
                                    <input id="profile-speciality" type="text" value={speciality} onChange={(e) => setSpeciality(e.target.value)} disabled={!isEditMode} className={`input-field ${!isEditMode ? 'opacity-60 cursor-not-allowed' : ''}`} />
                                </div>
                            )}

                            {error && (
                                <div className="bg-rose-50 border border-rose-200 rounded-xl px-4 py-3">
                                    <p className="text-rose-700 text-sm">{error}</p>
                                </div>
                            )}

                            <div className="flex gap-3 pt-2">
                                {isEditMode ? (
                                    <>
                                        <button id="profile-cancel-btn" onClick={() => { setIsEditMode(false); setImageFile(null); }} className="btn-ghost flex-1">Cancel</button>
                                        <button id="profile-save-btn" onClick={handleSave} className="btn-primary flex-1" disabled={isLoading}>
                                            {isLoading ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                    Saving...
                                                </span>
                                            ) : "Save Changes"}
                                        </button>
                                    </>
                                ) : (
                                    <button id="profile-edit-btn" onClick={() => setIsEditMode(true)} className="btn-primary w-full">Edit Profile</button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default ProfilePage;
