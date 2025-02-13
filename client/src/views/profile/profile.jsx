import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './../../components/profileComponents.jsx';
import { Loader2 } from "lucide-react";
import { toast } from 'react-hot-toast';
import api from '../../utils/api';
import Footer from '../../components/Footer.jsx';
import Navbar from '../../components/Navbar.jsx';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [membershipExpiry, setMembershipExpiry] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const res = await api.get('auth/profile', { withCredentials: true });
        if (res.data.success) {
          setProfilePhoto(res.data.data.user.profilePhoto);
        }
      } catch (err) {
        console.error('Error fetching profile data:', err);
        toast.error('Failed to fetch profile data.');
      }
    };
    fetchProfileData();
    const localExpiry = localStorage.getItem("membershipExpiry");
    if (localExpiry) {
      setMembershipExpiry(localExpiry);
    }
  }, []);

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await api.post("upload/uploadProfilePhoto", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProfilePhoto(response.data.data.profilePhoto);
      toast.success('Profile photo updated successfully.');
    } catch (err) {
      console.error("Error uploading profile photo:", err);
      toast.error('Failed to update profile photo.');
    }
    setUploading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Navbar bg="gray-900" />
      <div className='bg-gray-900 h-10'></div>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-100">My Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-600 bg-gray-700">
                    {profilePhoto ? (
                      <img
                        src={profilePhoto}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-gray-400">No Photo</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-300">
                      Update Profile Photo
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="mt-2 block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-gray-200 hover:file:bg-gray-600"
                    />
                    {uploading && (
                      <div className="flex items-center gap-2 mt-2 text-blue-400">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Uploading...</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="p-6 bg-gray-700 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-100 mb-4">Membership Details</h3>
                <p className="text-gray-300 mb-4">
                  <span className="font-medium">Expiry Date: </span>
                  {membershipExpiry ? new Date(membershipExpiry).toLocaleDateString() : 'Not Available'}
                </p>
                <button
                  onClick={() => navigate('/membership')}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md"
                >
                  Renew Membership
                </button>
              </div>
              <div className="p-6 bg-gray-700 rounded-lg">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-100">Password Settings</h3>
                  <button
                    onClick={() => navigate('/forgotpassword')}
                    className="px-4 mt-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md transition-colors"
                  >
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;
