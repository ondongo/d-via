"use client";

import { useState, useEffect } from "react";
import ConversationList from "@/components/molecules/dashboard/messages/ConversationList";
import EmptyConversation from "@/components/molecules/dashboard/messages/EmptyConversation";
import ConversationPanelArtisan from "@/components/molecules/dashboard/artisan/ConversationPanelArtisan";
import { ConversationFull, ConversationSummary } from "@/types/conversation";
import { useSearchParams, useRouter } from "next/navigation";

export default function ArtisanMessagesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialId = searchParams.get("id");

  const [selectedId, setSelectedId] = useState<string | null>(initialId);
  const [mobileView, setMobileView] = useState<"list" | "conversation">(initialId ? "conversation" : "list");

  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  const [activeConversation, setActiveConversation] = useState<ConversationFull | null>(null);
  const [loadingActive, setLoadingActive] = useState(false);

  // Fetch list on mount
  useEffect(() => {
    async function fetchConversations() {
      try {
        const res = await fetch("/api/conversations");
        if (res.ok) {
          const data = await res.json();
          setConversations(data);
        }
      } catch (error) {
        console.error("Failed to fetch conversations", error);
      } finally {
        setLoadingList(false);
      }
    }
    fetchConversations();
  }, []);

  // Sync state with URL param
  useEffect(() => {
    const id = searchParams.get("id");
    if (id && id !== selectedId) {
        setSelectedId(id);
        setMobileView("conversation");
    }
  }, [searchParams]);

  // Fetch active conversation details when selectedId changes
  useEffect(() => {
    if (!selectedId) {
      setActiveConversation(null);
      return;
    }

    async function fetchConversationDetails() {
      setLoadingActive(true);
      try {
        const res = await fetch(`/api/conversations/${selectedId}`);
        if (res.ok) {
          const data = await res.json();
          setActiveConversation(data);
        }
      } catch (error) {
        console.error("Failed to fetch conversation details", error);
      } finally {
        setLoadingActive(false);
      }
    }

    fetchConversationDetails();
  }, [selectedId]);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setMobileView("conversation");
    router.push(`/dashboard/artisan/messages?id=${id}`);
  };

  const handleSendMessage = async (text: string, type: "TEXT" | "QUOTE" = "TEXT", payload?: any) => {
    if (!selectedId) return;

    // Optimistic update
    const tempId = Date.now().toString();
    const optimisticMessage: any = {
        id: tempId,
        conversationId: selectedId,
        from: "ARTISAN",
        contentType: type,
        text: text,
        payload: payload,
        createdAt: new Date().toISOString(),
    };

    setActiveConversation(prev => {
        if (!prev) return null;
        return {
            ...prev,
            messages: [...prev.messages, optimisticMessage]
        };
    });

    try {
        const res = await fetch(`/api/conversations/${selectedId}/messages`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text, type, payload }),
        });

        if (res.ok) {
            const newMessage = await res.json();
            // Replace optimistic message with real one
             setActiveConversation(prev => {
                if (!prev) return null;
                const filtered = prev.messages.filter(m => m.id !== tempId);
                return {
                    ...prev,
                    messages: [...filtered, newMessage]
                };
            });
            // Update list last message
            setConversations(prev => prev.map(c => {
                if (c.id === selectedId) {
                    return {
                        ...c,
                        messages: [newMessage],
                        updatedAt: newMessage.createdAt,
                    }
                }
                return c;
            }));
        } else {
             // Rollback
             setActiveConversation(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    messages: prev.messages.filter(m => m.id !== tempId)
                };
            });
            alert("Erreur lors de l'envoi du message");
        }
    } catch (e) {
        console.error(e);
        // Rollback
             setActiveConversation(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    messages: prev.messages.filter(m => m.id !== tempId)
                };
            });
    }
  };


  return (
    <div className="flex h-[calc(100dvh-80px)] max-h-[calc(100dvh-80px)] w-full shrink-0 overflow-hidden max-md:h-[calc(100dvh-80px-5.5rem)] max-md:max-h-[calc(100dvh-80px-5.5rem)]">
      {/* Left panel — conversation list */}
      <div
        className={`flex w-full shrink-0 flex-col border-r border-dvianeutral-50 md:w-[320px] md:flex ${
          mobileView === "conversation" ? "hidden md:flex" : "flex"
        } min-h-0`}
      >
        <ConversationList
            conversations={conversations}
            selectedId={selectedId}
            onSelect={handleSelect}
            isLoading={loadingList}
            viewerRole="ARTISAN"
        />
      </div>

      {/* Right panel — active conversation */}
      <div
        className={`flex min-h-0 min-w-0 flex-1 flex-col ${
          mobileView === "list" ? "hidden md:flex" : "flex"
        }`}
      >
        {mobileView === "conversation" && (
          <button
            onClick={() => {
                setMobileView("list");
                router.push("/dashboard/artisan/messages");
                setSelectedId(null);
            }}
            className="md:hidden flex items-center gap-1 text-sm text-dvianeutralvariant-40 px-4 pt-3 cursor-pointer"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Retour
          </button>
        )}
        {activeConversation ? (
             <ConversationPanelArtisan conv={activeConversation} onSendMessage={handleSendMessage} />
        ) : (
             <div className="flex-1 flex items-center justify-center">
                 {loadingActive ? <p className="text-sm text-dvianeutralvariant-40">Chargement...</p> : <EmptyConversation />}
            </div>
        )}
      </div>
    </div>
  );
}
