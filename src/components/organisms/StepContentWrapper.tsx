"use client";

import React, { ReactNode } from "react";

interface StepContentWrapperProps {
  children?: ReactNode;
  leftSection?: ReactNode;
  rightSection?: ReactNode;
  centered?: boolean;
  className?: string;
}

export default function StepContentWrapper({
  children,
  leftSection,
  rightSection,
  centered = false,
  className = "",
}: StepContentWrapperProps) {
  const shouldCenter = centered || (!leftSection && !rightSection);

  if (shouldCenter) {
    return (
      <div
        className={`flex flex-col items-center justify-center h-[calc(100vh-200px)] px-8 md:px-16  ${className}`}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col md:flex-row gap-12 h-[calc(100vh-200px)] px-8 md:px-16 ${className}`}
    >
      {leftSection && (
        <div className="w-full md:w-1/2 flex items-center justify-center">
          {leftSection}
        </div>
      )}
      {rightSection && (
        <div className="w-full md:w-1/2 flex items-center justify-center">
          {rightSection}
        </div>
      )}
      {children && !leftSection && !rightSection && (
        <div className="w-full flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}
