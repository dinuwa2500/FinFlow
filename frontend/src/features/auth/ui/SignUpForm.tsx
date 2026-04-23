"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { User, Mail, Lock } from "lucide-react";
import { Input } from "@/shared/ui/Input";
import { Button } from "@/shared/ui/Button";
import { userApi } from "@/entities/user/api/userApi";
import { UserSignUpData } from "@/entities/user/model/types";

export const SignUpForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<UserSignUpData>({
    mode: "onTouched",
  });

  const password = watch("password");

  const onSubmit = async (data: UserSignUpData) => {
    setIsLoading(true);
    setApiError(null);
    try {
      const response = await userApi.signUp({
        ...data,
        name: `${data.firstName} ${data.lastName}`,
      });

      if (response.token) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        router.push("/login");
      }
    } catch (error: any) {
      setApiError(
        error.response?.data?.error || "Registration failed. Please try again.",
      );
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
      <div className='grid grid-cols-2 gap-4'>
        <Input
          label='First name'
          placeholder='John'
          {...register("firstName", { required: "First name is required" })}
          error={errors.firstName?.message}
          icon={<User size={18} />}
        />
        <Input
          label='Last name'
          placeholder='Doe'
          {...register("lastName", { required: "Last name is required" })}
          error={errors.lastName?.message}
          icon={<User size={18} />}
        />
      </div>

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

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <Input
          label='Password'
          placeholder='Create a password'
          type='password'
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
          })}
          error={errors.password?.message}
          icon={<Lock size={18} />}
        />
        <Input
          label='Confirm password'
          placeholder='Confirm password'
          type='password'
          {...register("confirmPassword", {
            required: "Please confirm your password",
            validate: (value) => value === password || "Passwords do not match",
          })}
          error={errors.confirmPassword?.message}
          icon={<Lock size={18} />}
        />
      </div>

      <div className='py-2'>
        <div className='flex items-center gap-2'>
          <input
            type='checkbox'
            className={`w-4 h-4 text-indigo-600 rounded cursor-pointer ${errors.acceptTerms ? "border-red-500" : "border-gray-300"}`}
            id='terms'
            {...register("acceptTerms", {
              required: "You must accept the terms",
            })}
          />
          <label
            htmlFor='terms'
            className='text-sm text-gray-600 cursor-pointer'
          >
            I agree to the{" "}
            <a href='#' className='text-indigo-600 underline'>
              Terms of Service
            </a>{" "}
            and{" "}
            <a href='#' className='text-indigo-600 underline'>
              Privacy Policy
            </a>
          </label>
        </div>
        {errors.acceptTerms && (
          <p className='text-xs text-red-500 mt-1 font-medium'>
            {errors.acceptTerms.message}
          </p>
        )}
      </div>

      <Button type='submit' isLoading={isLoading}>
        Create Account
      </Button>
    </form>
  );
};
