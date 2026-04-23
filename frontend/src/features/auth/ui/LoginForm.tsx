"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { Input } from "@/shared/ui/Input";
import { Button } from "@/shared/ui/Button";
import { userApi } from "@/entities/user/api/userApi";

export const LoginForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setApiError(null);
    try {
      const response = await userApi.login(data);

      if (response.token) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        router.push("/overview");
      }
    } catch (error: any) {
      setApiError(error.response?.data?.error || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      {apiError && (
        <div className='p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl font-medium animate-in fade-in slide-in-from-top-1'>
          {apiError}
        </div>
      )}
      <Input
        label='Email address'
        placeholder='name@example.com'
        type='email'
        {...register("email", {
          required: "Email is required",
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Invalid email address",
          },
        })}
        error={errors.email?.message}
        icon={<Mail size={18} />}
      />

      <Input
        label='Password'
        placeholder='••••••••'
        type='password'
        {...register("password", { required: "Password is required" })}
        error={errors.password?.message}
        icon={<Lock size={18} />}
      />

      <div className='flex items-center justify-between py-2'>
        <div className='flex items-center gap-2'>
          <input
            type='checkbox'
            className='w-4 h-4 text-indigo-600'
            id='remember'
          />
          <label htmlFor='remember' className='text-sm text-gray-600'>
            Remember me
          </label>
        </div>
        <Link
          href='/forgot-password'
          className='text-sm text-indigo-600 hover:underline font-medium'
        >
          Forgot password?
        </Link>
      </div>

      <Button type='submit' isLoading={isLoading}>Sign In</Button>
    </form>
  );
};
