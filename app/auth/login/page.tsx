import LoginForm from "@/components/auth/LoginForm";
import React from "react";
import { Suspense } from 'react'


const LoginPage = () => {
  return (
    <>
    <Suspense>
    
    <div className="flex w-4xl h-screen items-center justify-center text-center rounded-lg">
    <LoginForm />
    </div>
    </Suspense>
    
    </>
  );
};

export default LoginPage;
