import React from 'react'
import { FaSearch } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
const Header = () => {
    const { currentUser } = useSelector((state) => state.user);
    return (
        <header className='bg-slate-200 shadow-md'>
            <div className='flex justify-between items-center max-w-6xl mx-auto '>
                <h1 className='text-xl font-bold text-white p-4 flex flex-wrap'>
                    <Link to='/'>
                        <span className='text-slate-700'>My Real</span>
                        <span className='text-slate-500'>Estate</span>
                    </Link>
                </h1>
                <form className='bg-white rounded-lg p-2 flex items-center'>
                    <input type="text" placeholder='Search' className='bg-transparent border-none outline-none focus:outline-none' />
                    <FaSearch />
                </form>
                <ul className='flex items-center gap-4'>
                    <Link to='/'>
                        <li className='hidden sm:inline text-slate-500 font-semibold hover:underline cursor-pointer'>Home</li>
                    </Link>
                    <Link to='/about'>
                        <li className='hidden sm:inline text-slate-500 font-semibold hover:underline cursor-pointer'>About</li>
                    </Link>
                    {
                        currentUser ? (
                            <Link to='/profile'>
                                <img src={currentUser.img} alt="profile" className='w-8 h-8 rounded-full object-cover' />
                            </Link>

                        ) : (
                            <Link to='/sign-up'>
                                <li className='hidden sm:inline text-slate-500 font-semibold hover:underline cursor-pointer'>Sign In</li>
                            </Link>
                        )
                    }
                </ul>
            </div>
        </header>
    )
}

export default Header
