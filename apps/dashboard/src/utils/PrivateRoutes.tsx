import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Navigate, Outlet } from "react-router-dom";
import trpc from "./trpc";

export const PrivateRoutes = () => {
  // TODO: CREATE a TRPC request to check if the cookie is set and ssend true
  //TODO: Think also how to catch tos accepted, plan accepted, email veryfied or not etc....
  // const [auth, setAuth] = useState();
  const { data, isFetched } =
    trpc.signin.sendCookie.useQuery();



  if (!data && isFetched) return <Navigate to="/login" />;
  if (data && isFetched) return <Outlet />;

  return null;
};
