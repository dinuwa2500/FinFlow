"use client";
import { Search, Bell, Clock } from "lucide-react";
import { useEffect, useState } from "react";

export const DashboardHeader = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Get user info from localStorage
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        if (user && user.name) {
          setUserName(user.name);
        }
      } catch (e) {
        console.error("Failed to parse user info", e);
      }
    }

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };
    const dateOptions: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    };

    const timeString = date.toLocaleTimeString('en-US', timeOptions);
    const dateString = date.toLocaleDateString('en-US', dateOptions);

    return `${timeString} | ${dateString}`;
  };

  return (
    <header className='flex justify-between items-start mb-8'>
      <div>
        <h1 className='text-2xl font-bold text-foreground flex items-center gap-2'>
          Hi, {userName} 👋
        </h1>
        <p className='text-sm text-muted-foreground mt-1'>
          Track your all expense and transactions
        </p>
      </div>
      <div className='flex items-center gap-6'>
        <div className='flex items-center gap-2 text-sm text-muted-foreground'>
          <Clock size={16} />
          <span>{formatTime(currentTime)}</span>
        </div>
        <div className='relative'>
          <Search
            className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground'
            size={16}
          />
          <input
            type='text'
            placeholder='Search expenses, transaction, cards'
            className='w-80 h-10 bg-white border border-border rounded-full pl-4 pr-10 text-sm outline-none shadow-sm'
          />
        </div>
        <div className='relative cursor-pointer'>
          <Bell size={24} />
          <span className='absolute -top-1 -right-1 w-4 h-4 bg-danger rounded-full text-[10px] text-white flex items-center justify-center font-bold'>
            2
          </span>
        </div>
        <img
          src='https://storage.googleapis.com/banani-avatars/avatar/male/18-25/European/4'
          className='w-10 h-10 rounded-lg'
          alt='Avatar'
        />
      </div>
    </header>
  );
};
