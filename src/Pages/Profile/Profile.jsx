import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { logout, setCredentials } from "../../Redux/Slice/authSlice";
import { useLogoutMutation, useUpdateUserMutation } from "../../Redux/Slice/userApiSlice";

const Profile = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [photo, setphoto] = useState(""); // State for profile photo

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();
  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/login');
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await updateUser({
          _id: userInfo._id,
          name,
          email,
          password,
        }).unwrap();

        dispatch(setCredentials({ ...res }));
        toast.success("Profile updated successfully");
        setPassword('');
        setConfirmPassword('');
        navigate("/");
      } catch (error) {
        toast.error(error.data.message || error.message);
      }
    }
  };

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
      setphoto(userInfo.photo); // Set the profile photo from user info
    }
  }, [userInfo]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between mb-6">
        <button onClick={() => navigate("/dashboard")} className="text-blue-500 hover:text-blue-700">Geri</button>
        <button onClick={handleLogout} className="text-red-500 hover:text-red-700">Çıxış</button>
      </div>
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-semibold mb-4">Profil</h1>
        {photo && (
          <img 
            src={`data:image/jpeg;base64,${photo}`} 
            alt="Profile" 
            className="w-32 h-32 rounded-full mx-auto mb-6" 
          />
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Ad</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Şifrə</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Şifrəyi yeniden gir</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>
          <button 
            type="submit" 
            className={`w-full py-2 text-white rounded-md ${isLoading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`} 
            disabled={isLoading}
          >
            {isLoading ? "Dəyişikliklər göndərilir..." : "Dəyişdir"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
