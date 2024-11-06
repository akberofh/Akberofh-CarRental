import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ children }) => {
  const { userInfo } = useSelector((state) => state.auth);

  // Eğer kullanıcı doğrulama tokenını onaylamamışsa, doğrulama sayfasına yönlendir
  if (!userInfo || !userInfo.isVerified) {
    return <Navigate to="/email-verification" />;
  }

  return children; // Kullanıcı doğrulama yapmışsa, ilgili bileşeni render et
};

export default PrivateRoute;
