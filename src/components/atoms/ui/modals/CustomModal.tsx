"use client";
import { AnimatePresence, motion } from "framer-motion";
import React, { useRef, useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  title: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  className="w-[350px] md:w-[450px]"
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
              className={`bg-dvianeutral-90 rounded-2xl min-h-[508px] shadow-lg relative flex flex-col items-center overflow-hidden ${className}`}
            >
              <div className="border-dvianeutral-50 border-b-1 flex flex-row gap-4 p-4 items-center w-full">
                <button
                  onClick={onClose}
                  className=" flex h-9.5 w-9.5 items-center justify-center  bg-transparent cursor-pointer"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M6.04289 16.5413C5.65237 16.9318 5.65237 17.565 6.04289 17.9555C6.43342 18.346 7.06658 18.346 7.45711 17.9555L11.9987 13.4139L16.5408 17.956C16.9313 18.3466 17.5645 18.3466 17.955 17.956C18.3455 17.5655 18.3455 16.9323 17.955 16.5418L13.4129 11.9997L17.955 7.4576C18.3455 7.06707 18.3455 6.43391 17.955 6.04338C17.5645 5.65286 16.9313 5.65286 16.5408 6.04338L11.9987 10.5855L7.45711 6.0439C7.06658 5.65338 6.43342 5.65338 6.04289 6.0439C5.65237 6.43442 5.65237 7.06759 6.04289 7.45811L10.5845 11.9997L6.04289 16.5413Z"
                      fill="#3F2825"
                    />
                  </svg>
                </button>

                <p className="text-dvianeutral-10 text-title-medium-size leading-headline-medium tracking-headline-medium">
                  {title}
                </p>
              </div>

              <div className="overflow-auto py-4">{children}</div>
            </motion.div>
          </div>
        </AnimatePresence>
      )}
    </>
  );
};
