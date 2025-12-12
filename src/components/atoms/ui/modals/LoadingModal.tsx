"use client";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";

interface LoadingModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
}

export const LoadingModal: React.FC<LoadingModalProps> = ({
  isOpen,
  title = "Inscription en cours...",
  message = "Nous créons votre compte artisan. Cela ne prendra que quelques instants.",
}) => {
  return (
    <>
      {isOpen && (
        <AnimatePresence>
          <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-[999999]">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 120 }}
              className="bg-dvianeutral-90 rounded-2xl shadow-lg relative flex flex-col items-center overflow-hidden w-[350px] md:w-[450px] p-6"
            >
              {/* Header avec titre */}
              <div className="flex flex-col gap-4 w-full items-center">
                <p className="text-dvianeutral-10 font-bold text-headline-small leading-headline-medium tracking-headline-medium text-center">
                  {title}
                </p>
                
                <p className="text-dvianeutralvariant-40 text-body-small leading-body-small tracking-body-small text-center">
                  {message}
                </p>

                {/* Skeleton Loader */}
                <div className="w-full flex flex-col gap-4 mt-4">
                  {/* Animated bars */}
                  <div className="animate-pulse flex flex-col gap-3">
                    {/* Profile skeleton */}
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-dvianeutral-94" />
                      <div className="flex-1">
                        <div className="h-4 bg-dvianeutral-94 rounded w-3/4 mb-2" />
                        <div className="h-3 bg-dvianeutral-94 rounded w-1/2" />
                      </div>
                    </div>

                    {/* Info lines skeleton */}
                    <div className="space-y-3 mt-4">
                      <div className="h-3 bg-dvianeutral-94 rounded w-full" />
                      <div className="h-3 bg-dvianeutral-94 rounded w-5/6" />
                      <div className="h-3 bg-dvianeutral-94 rounded w-4/6" />
                    </div>

                    {/* Cards skeleton */}
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <div className="h-20 bg-dvianeutral-94 rounded-xl" />
                      <div className="h-20 bg-dvianeutral-94 rounded-xl" />
                    </div>

                    {/* Button skeleton */}
                    <div className="mt-4">
                      <div className="h-12 bg-dvianeutral-94 rounded-lg w-full" />
                    </div>
                  </div>
                </div>

                {/* Spinning loader icon */}
             {/*    <div className="mt-6">
                  <svg
                    className="animate-spin h-8 w-8 text-dviaprimary-40"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div> */}
              </div>
            </motion.div>
          </div>
        </AnimatePresence>
      )}
    </>
  );
};

