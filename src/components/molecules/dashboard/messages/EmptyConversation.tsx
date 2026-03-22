export default function EmptyConversation() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-8">
      <div className="w-14 h-14 rounded-full bg-dvianeutral-94 flex items-center justify-center">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D0B8A2" strokeWidth="1.5">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </div>
      <p className="text-sm font-medium text-dvianeutralvariant-40">Sélectionnez une conversation</p>
      <p className="text-xs text-dvianeutralvariant-60">Cliquez sur un contact pour voir l&apos;échange</p>
    </div>
  );
}
