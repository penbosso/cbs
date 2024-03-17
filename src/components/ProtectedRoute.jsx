import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from "react-redux"
import { selectCurrentToken, selectCurrentUser } from '../services/authSlice'
const ProtectedRoute = ({ children }) => {

   const token = useSelector(selectCurrentToken)
   const currentUser = useSelector(selectCurrentUser)
   if (!token) {
      return <Navigate to="/signin" />
   }
   if (!currentUser.is_approved) {
      return <Navigate to="/unauthorized" />
   }

   return children
}

export default ProtectedRoute