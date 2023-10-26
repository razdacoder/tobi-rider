import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { selectSession, setSession } from "../slices/authSlice";
import { supabase } from "../utils/supabase";

const RequireAuth = () => {
  const dispatch = useDispatch();
  const session = useSelector(selectSession);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      dispatch(setSession(session));
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      dispatch(setSession(session));
    });
    return () => subscription.unsubscribe();
  }, []);

  return session ? <Outlet /> : <Navigate to="/welcome" />;
};

export default RequireAuth;
