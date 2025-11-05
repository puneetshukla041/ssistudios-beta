// components/dashboard/AccountNav.tsx
import { Settings, Bell } from "lucide-react";
import React from 'react';

// Assuming user information is passed down or fetched here
interface AccountNavProps {
  initial: string;
  name: string;
  email: string;
}

export default function AccountNav({ initial, name, email }: AccountNavProps) {
  // Replace the placeholder div with your actual component logic 
  // and styling (e.g., using Tailwind CSS) to match the image precisely.

  return (
    <div className="flex items-center space-x-4">
      {/* Settings Icon */}
      <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
        <Settings size={24} />
      </button>

      {/* Notification Icon */}
      <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
        <Bell size={24} />
      </button>

      {/* User Avatar and Info */}
      <div className="flex items-center space-x-2 cursor-pointer p-1 rounded-full hover:bg-gray-100 transition-colors">
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-sm">
          {initial} {/* J */}
        </div>
        
        {/* Name and Email */}
        <div className="hidden sm:block"> {/* Hide on small screens if desired */}
          <p className="text-sm font-medium text-gray-900 leading-none">{name}</p> {/* Personal */}
          <p className="text-xs text-gray-500 leading-none">{email}</p> {/* jessica.lau */}
        </div>

        {/* Dropdown Indicator (Optional, but often included) */}
        <svg className="w-4 h-4 text-gray-500 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </div>
    </div>
  );
}