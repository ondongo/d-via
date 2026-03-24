export type MessageFrom = "CLIENT" | "ARTISAN" | "SYSTEM";
export type MessageContentType = "TEXT" | "QUOTE" | "ALERT";

export interface Message {
  id: string;
  from: MessageFrom;
  contentType: MessageContentType;
  text?: string;
  payload?: any;
  createdAt: string; // ISO string from JSON
}

export interface ConversationSummary {
  id: string;
  clientId: string;
  artisanId: string;
  // Based on include in GET /api/conversations
  client?: {
    id: string;
    name: string | null;
    image: string | null;
  };
  artisan?: {
    id: string; // User ID
    name: string | null;
    image: string | null;
    artisan: {
      companyName: string | null;
      verified: boolean;
    } | null;
  };
  messages: Message[]; // usually contains 1 message (last one)
  status: string;
  updatedAt: string;
  isUnreadByClient: boolean; // true if artisan sent last msg and client hasn't read
  isUnreadByArtisan: boolean;
  lastMessageAt?: string; // removed from my api, query uses updatedAt
}

export interface ConversationFull extends ConversationSummary {
  messages: Message[]; // full history
}

