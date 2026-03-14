"use client";

import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";

interface ComplexModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
  className?: string;
  mobileClassName?: string;
  isCloseButton?: boolean;
  backgroundModal?: string;
}

export const ComplexModal: React.FC<ComplexModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  className = "w-[350px] md:w-[450px]",
  mobileClassName = "w-full rounded-t-2xl max-h-[90dvh] md:max-h-[85dvh]",
  isCloseButton = true,
  backgroundModal = "bg-black/60",
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");

    const updateIsMobile = (event: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(event.matches);
    };

    updateIsMobile(mediaQuery);
    mediaQuery.addEventListener("change", updateIsMobile);

    return () => {
      mediaQuery.removeEventListener("change", updateIsMobile);
    };
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`fixed inset-0 z-[999999] flex justify-center ${isMobile ? "items-end" : "items-center"} ${backgroundModal}`}
          onClick={onClose}
        >
          <motion.div
            initial={isMobile ? { y: "100%", opacity: 1 } : { scale: 0.8, opacity: 0 }}
            animate={isMobile ? { y: 0, opacity: 1 } : { scale: 1, opacity: 1 }}
            exit={isMobile ? { y: "100%", opacity: 1 } : { scale: 0.8, opacity: 0 }}
            transition={isMobile ? { duration: 0.3, ease: "easeInOut" } : { type: "spring", stiffness: 120 }}
            className={`relative flex flex-col items-center overflow-hidden bg-dviaheader shadow-lg ${
              isMobile ? mobileClassName : `rounded-2xl ${className}`
            }`}
            onClick={(event) => event.stopPropagation()}
          >
            {isCloseButton && (
              <div className="border-dvianeutral-50 flex w-full flex-row items-center gap-4 border-b-1 p-4">
                <button
                  onClick={onClose}
                  className="flex h-9.5 w-9.5 cursor-pointer items-center justify-center bg-transparent"
                  aria-label="Fermer la modal"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
            )}

            <div className="w-full overflow-auto py-4">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
