import React from 'react';
import { ICONS } from "@/constants/icons";

interface AlertMessageProps {
  text: string;
}

export const AlertMessage = ({ text }: AlertMessageProps) => {
  return (
    <div className="flex bg-dvianeutral-98 border border-dvianeutral-90 text-dvianeutral-10 px-4 py-3 rounded-8px text-sm my-4 items-start gap-2">
        <img src="/icons/alert.svg" className="w-4 h-4 mt-0.5" alt="alert" />
        <span className="text-dvianeutral-10 text-xs w-full">{text}</span>
    </div>
  );
};

