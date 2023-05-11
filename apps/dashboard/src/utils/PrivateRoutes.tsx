import React from "react";
import { useCookies } from "react-cookie";
import { Navigate, Outlet } from "react-router-dom";

export const PrivateRoutes = () => {
// TODO: CREATE a TRPC request to check if the cookie is set and ssend true 
    //TODO: Think also how to catch tos accepted, plan accepted, email veryfied or not etc....
    let auth = false;
  return auth ? <Outlet /> : <Navigate to="/login" />;
};
