import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { getStorage } from "firebase/storage";
import { app } from '../../firebase';
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserFailure, deleteUserStart, deleteUserSuccess, signInFailure, signOutUserStart, signOutUserSuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { set } from 'mongoose';
const Profile = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user)
  const fileRef = useRef();
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadErrror, setFileUploadErrror] = useState(null);
  const [formData, setFormData] = useState({});
  console.log(formData);
  const [showListingError, setShowListingError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleFileUpload();
    }
  }, [file])

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
        console.log('Upload is ' + progress + '% done');
      },
      (error) => {
        setFileUploadErrror(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData(({ ...formData, img: downloadURL }));
        });
      },
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }

  // handle user submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        console.error("Update failed:", data.message);
        return;
      }
      dispatch(updateUserSuccess(data));
      console.log("Update successful:", data);

    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  }

  // handle user delete
  const handleDeleteAccount = async (e) => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        console.error("Delete failed:", data.message);
        return;
      }
      dispatch(deleteUserSuccess(data));
      console.log("Delete successful:", data);
      navigate("/sign-in", {
        replace: true
      })
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  }

  // handle user signout
  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (res.data === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  }

  // show listing
  const handleShowListing = async () => {
    try {
      setShowListingError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      console.log("user listing res (126): ", res);
      const data = await res.json();
      if (data.success === false) {
        setShowListingError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setShowListingError(error.message);
    }
  }

  // handle listing delete
  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        setShowListingError(data.message);
        return;
      }
      handleShowListing();
    } catch (error) {
      setShowListingError(error.message);
    }
  }

  return (
    <div>
      <h1 className='text-3xl font-bold text-slate-500 text-center '>Profile</h1>
      <form
        onSubmit={handleSubmit}
        className='max-w-md mx-auto mt-8 p-4 border border-gray-300 rounded-lg shadow-md'>
        <input
          onChange={(e) => setFile(e.target.files[0])}
          ref={fileRef}
          accept='image/*'
          type="file"
          className='hidden' />
        <img
          onChange={handleFileUpload}
          onClick={() => fileRef.current.click()}
          src={currentUser?.img ?
            currentUser.img
            : 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541'
          } alt="Profile" className='w-32 h-32 rounded-full mx-auto mb-4 cursor-pointer' />
        <p>
          {
            fileUploadErrror ? (
              <span className='text-red-500'>File upload error:(image must be less than 2MB)</span>
            ) : (
              filePerc > 0 && filePerc < 100 ? (<span className='text-green-500'>Uploading: {filePerc}%</span>
              ) : filePerc === 100 ? (
                <span className='text-green-500'>Upload complete!</span>
              ) : (
                ''
              ))
          }
        </p>
        <div className='mb-4'>
          <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='username'>
            Username
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='username'
            type='text'
            placeholder='Enter your username'
            defaultValue={currentUser?.userName}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='email'>
            Email
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='email'
            type='email'
            placeholder='Enter your email'
            defaultValue={currentUser?.email}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='password'>
            Password
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='password'
            type='password'
            placeholder='Enter your password'
          />
        </div>
        <div className='mb-4'>
          <button
            disabled={loading}
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 rounded w-full cursor-pointer'>
            {loading ? 'Updating...' : 'Update'}
          </button>
        </div>
        <div className='mb-4'>
          <Link to='/create-listing'>
            <button
              disabled={loading}
              className='bg-green-700 hover:bg-green-800 text-white font-bold py-2 rounded w-full cursor-pointer'>
              {loading ? 'Creating Listing...' : 'Create Listing'}
            </button>
          </Link>
        </div>
      </form>
      <div className='flex justify-between items-center'>
        <span
          onClick={handleDeleteAccount}
          className=' text-red-600 cursor-pointer'>Delete Account</span>
        <span
          onClick={handleSignOut}
          className=' text-red-600 cursor-pointer ml-4'>Signout</span>
      </div>
      <div className='flex justify-center'>
        <button
          onClick={handleShowListing}
          className='cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2'>Show Listing</button>
      </div>
      {userListings && userListings.length > 0 && (
        <div className="flex flex-col gap-6 mt-10">
          <h1 className="text-center text-3xl font-bold text-slate-800">
            Your Listings
          </h1>

          {userListings.map((listing) => (
            <div
              key={listing._id}
              className="flex items-center justify-between gap-4 border rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow bg-white"
            >
              {/* Image */}
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt="listing cover"
                  className="h-20 w-20 rounded-xl object-cover border"
                />
              </Link>

              {/* Title */}
              <Link
                className="text-slate-700 font-semibold text-lg hover:text-blue-600 hover:underline truncate flex-1"
                to={`/listing/${listing._id}`}
              >
                {listing.name}
              </Link>

              {/* Action Buttons */}
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className="px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button
                    className="px-3 py-1 text-sm font-medium text-green-600 hover:bg-green-50 rounded-lg transition">
                    Edit
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}

export default Profile
