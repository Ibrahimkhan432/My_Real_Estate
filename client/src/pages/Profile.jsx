import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectUser } from '../redux/user/userSlice'
import { getStorage } from "firebase/storage";
import { app } from '../../firebase';
import { set } from 'mongoose';

const Profile = () => {
  const currentUser = useSelector(selectUser)

  const fileRef = useRef();
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadErrror, setFileUploadErrror] = useState(null);
  const [formData, setFormData] = useState({});
  console.log(file);


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

  return (
    <div>
      <h1 className='text-3xl font-bold text-slate-500 text-center '>Profile</h1>
      <form className='max-w-md mx-auto mt-8 p-4 border border-gray-300 rounded-lg shadow-md'>
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
          <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 rounded w-full cursor-pointer'>Update</button>
        </div>
        <div className='flex justify-between items-center'>
          <span className=' text-red-600 cursor-pointer'>Delete Account</span>
          <span className=' text-red-600 cursor-pointer ml-4'>Signout</span>
        </div>
      </form>
    </div>
  )
}

export default Profile
