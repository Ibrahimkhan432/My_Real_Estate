import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { getStorage } from "firebase/storage";
import { app } from '../../firebase';
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserFailure, deleteUserStart, deleteUserSuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
const Profile = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user)
  console.log(currentUser);
  const fileRef = useRef();
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadErrror, setFileUploadErrror] = useState(null);
  const [formData, setFormData] = useState({});
  console.log(formData);
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
      </form>
      <div className='flex justify-between items-center'>
        <span
          onClick={handleDeleteAccount}
          className=' text-red-600 cursor-pointer'>Delete Account</span>
        <span className=' text-red-600 cursor-pointer ml-4'>Signout</span>
      </div>
    </div>
  )
}

export default Profile
