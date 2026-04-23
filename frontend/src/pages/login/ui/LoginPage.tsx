"use client";
import Link from "next/link";
import { LoginForm } from "@/features/auth/ui/LoginForm";

export const LoginPage = () => {
  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center p-4'>
      <div className='bg-white p-8 rounded-3xl shadow-xl w-full max-w-md text-left'>
        {/* Logo Placeholder */}
        <div className='w-12 h-12 bg-indigo-600 rounded-xl mb-6' />

        <h1 className='text-2xl font-bold text-gray-900 mb-2'>Welcome back</h1>
        <p className='text-gray-500 text-sm mb-8'>
          Enter your credentials to access your account
        </p>

        <LoginForm />

        <p className='mt-6 text-sm text-gray-600 text-center'>
          Don't have an account?
          <Link
            href='/sign-up'
            className='text-indigo-600 font-medium hover:underline ml-1'
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};
