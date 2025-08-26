import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
const PrivateRoute = () => {
    const currentUser  = useSelector((state) => state.user);
    console.log("PrivateRoute - Current User:", currentUser);
    return currentUser ? <Outlet /> : <Navigate to="/sign-in" />;
}

export default PrivateRoute
