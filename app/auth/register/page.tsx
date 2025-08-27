import RegisterForm from "@/components/auth/RegisterForm";
import React from "react";
import { Suspense } from 'react'


const RegisterPage = () => {
  return (
    <div className="flex w-4xl h-screen items-center justify-centertext-center rounded-lg">
    <Suspense>
    
    <RegisterForm />
    </Suspense>
    
    </div>
  );
};

export default RegisterPage;
