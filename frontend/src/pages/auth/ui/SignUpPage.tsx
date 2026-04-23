import Link from "next/link";
import { SignUpForm } from "@/features/auth/ui/SignUpForm";

export const SignUpPage = () => {
  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center p-4'>
      <div className='bg-white p-8 rounded-3xl shadow-xl w-full max-w-md text-left'>
        {/* Logo Placeholder */}
        <div className='w-12 h-12 bg-indigo-600 rounded-xl mb-6' />

        <h1 className='text-2xl font-bold text-gray-900 mb-2'>
          Create an account
        </h1>
        <p className='text-gray-500 text-sm mb-8'>
          Enter your details below to get started with FinanceApp
        </p>

        <SignUpForm />

        <p className='mt-6 text-sm text-gray-600 text-center'>
          Already have an account?{" "}
          <Link
            href='/login'
            className='text-indigo-600 font-medium hover:underline'
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
