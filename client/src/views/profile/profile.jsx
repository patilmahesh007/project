import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import api from '../../utils/api';
import { Toaster, toast } from 'react-hot-toast';

function Profile() {
  const navigate = useNavigate();
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [membershipExpiry, setMembershipExpiry] = useState('');
  const [uploading, setUploading] = useState(false);
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
  const [changePassword, setChangePassword] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const res = await api.get('auth/profile', { withCredentials: true });
        if (res.data.success) {
          setProfilePhoto(res.data.data.user.profilePhoto);
          setMembershipExpiry(res.data.data.user.membershipExpiry);
        }
      } catch (err) {
        console.error('Error fetching profile data:', err);
        toast.error('Failed to fetch profile data.');
      }
    };
    fetchProfileData();
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
      const imageUrl = response.data.data.profilePhoto;
      setProfilePhoto(imageUrl);
      toast.success('Profile photo updated successfully.');
    } catch (err) {
      console.error("Error uploading profile photo:", err.response ? err.response.data : err.message);
      toast.error('Failed to update profile photo.');
    }
    setUploading(false);
  };

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    if (changePassword.new !== changePassword.confirm) {
      toast.error('New passwords do not match.');
      return;
    }
    try {
      const res = await api.put(
        'user/changePassword',
        {
          currentPassword: changePassword.current,
          newPassword: changePassword.new,
        },
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success('Password changed successfully.');
        setShowChangePasswordForm(false);
        setChangePassword({ current: '', new: '', confirm: '' });
      } else {
        toast.error(res.data.message || 'Failed to change password.');
      }
    } catch (err) {
      console.error('Error changing password:', err);
      toast.error('Error changing password.');
    }
  };

  return (
    <div>
      <Navbar bg="orange-100" />
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-6">My Profile</h1>
          <div className="flex flex-col md:flex-row items-center mb-8">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-300">
              {profilePhoto ? (
                <img
                  src={profilePhoto}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <span className="text-gray-500">No Photo</span>
                </div>
              )}
            </div>
            <div className="mt-4 md:mt-0 md:ml-8">
              <label className="block text-sm font-medium text-gray-700">
                Upload Profile Photo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="mt-2 block"
              />
              {uploading && (
                <p className="text-sm text-blue-500 mt-1">Uploading...</p>
              )}
            </div>
          </div>
          <div className="mb-8">
            <p className="text-lg">
              <span className="font-semibold">Membership Expiry Date: </span>
              {membershipExpiry
                ? new Date(membershipExpiry).toLocaleDateString()
                : 'Not Available'}
            </p>
            <button
              onClick={() => navigate('/membership')}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
            >
              Renew Membership
            </button>
          </div>
          <div className="mb-8">
            <button
              onClick={() => setShowChangePasswordForm(!showChangePasswordForm)}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200"
            >
              {showChangePasswordForm ? 'Cancel' : 'Change Password'}
            </button>
            {showChangePasswordForm && (
              <form onSubmit={handleChangePasswordSubmit} className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={changePassword.current}
                    onChange={(e) =>
                      setChangePassword({ ...changePassword, current: e.target.value })
                    }
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={changePassword.new}
                    onChange={(e) =>
                      setChangePassword({ ...changePassword, new: e.target.value })
                    }
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={changePassword.confirm}
                    onChange={(e) =>
                      setChangePassword({ ...changePassword, confirm: e.target.value })
                    }
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
                >
                  Update Password
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      <Footer />
      <Toaster position="top-right" />
    </div>
  );
}

export default Profile;
