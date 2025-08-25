import React from 'react'

const PrivateRoute = () => {
    const { currentUser } = useSelector((state) => state.user);
    return currentUser ? <Outlet /> : <Navigate to="/sign-in" />;
}

export default PrivateRoute
