interface SaveAndExitButtonProps {
  children: React.ReactNode;
  className?: string;
  redirectTo?: string;
  onClick?: () => void;
}

function SaveAndExitButton({
  children,
  className,
  onClick,
}: SaveAndExitButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`'hidden md:block text-dviaprimary-40 text-label-large leading-label-large tracking-label-large bg-transparent px-6 py-1  border rounded-8px border-dvianeutral-50 text-sm font-medium
         hover:shadow-sm transition-shadow duration-300 cursor-pointer max-w-[260px]  min-h-[40px] max-h-[40px]' ${className}`}
    >
      {children}
    </button>
  );
}

export default SaveAndExitButton;
