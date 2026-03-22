export type MessageFrom = "client" | "artisan";

export type MessageContent =
  | { type: "text"; text: string }
  | { type: "quote"; ref: string; title: string; amount: string; status: "Pending" | "Accepted" | "Refused" }
  | { type: "alert"; text: string };

export interface Message {
  id: string;
  from: MessageFrom;
  content: MessageContent;
  time: string;
}

export interface Conversation {
  id: string;
  initial: string;
  name: string;
  company: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  verified: boolean;
  status: "quote_signed" | "in_progress" | "pending";
  messages: Message[];
}

export type ConversationFilter = "all" | "unread" | "quote_in_progress";

export const STATUS_BADGE: Record<
  Conversation["status"],
  { label: string; color: string }
> = {
  quote_signed: { label: "Devis signé", color: "text-[#3D352D] border-[#009B6F] bg-[#73FFD7]" },
  in_progress: { label: "En cours", color: "text-[#E09E3B] border-[#E09E3B] bg-[#FFF7E9]" },
  pending: {
    label: "En attente",
    color: "text-dvianeutralvariant-40 border-dvianeutral-50 bg-dvianeutral-94",
  },
};

// ─── Mock data ────────────────────────────────────────────────────────────────
export const CONVERSATIONS: Conversation[] = [
  {
    id: "artisan-1",
    initial: "M",
    name: "Matys Coantin",
    company: "D-VIA",
    lastMessage: "Merci pour votre confiance ! J'ai...",
    time: "11:06",
    unread: false,
    verified: true,
    status: "quote_signed",
    messages: [
      {
        id: "m1",
        from: "artisan",
        content: {
          type: "alert",
          text: "Vous échangez avec un artisan vérifié par D•VIA. Ne partagez pas vos coordonnées bancaires directement...",
        },
        time: "",
      },
      {
        id: "m2",
        from: "client",
        content: {
          type: "text",
          text: "Bonjour Matys, j'ai une fuite sous mon évier, et je voudrais en profiter pour changer le mitigeur. Pouvez-vous me faire un devis ?",
        },
        time: "9h30",
      },
      {
        id: "m3",
        from: "artisan",
        content: {
          type: "text",
          text: "Bien sûr, c'est tout à fait dans mes cordes ! Voici un devis détaillé comprenant la recherche de fuite et l'installation d'un nouveau mitigeur standard.",
        },
        time: "10h15",
      },
      {
        id: "m4",
        from: "artisan",
        content: {
          type: "quote",
          ref: "DEV-2026-03-142",
          title: "Réparation fuite & Remplacement mitigeur",
          amount: "285,00€ TTC",
          status: "Pending",
        },
        time: "10h30",
      },
      {
        id: "m5",
        from: "artisan",
        content: {
          type: "text",
          text: "Voici le devis que vous avez demandé.",
        },
        time: "10h35",
      },
      {
        id: "m6",
        from: "client",
        content: {
          type: "text",
          text: "Merci Matys, je vais vérifier les détails et vous répondre dans les plus brefs délais.",
        },
        time: "10h35",
      },
    ],
  },
  {
    id: "artisan-2",
    initial: "A",
    name: "Antoine Martin",
    company: "Martin Carrelage",
    lastMessage: "Bonjour, je peux me déplacer demain matin.",
    time: "09:30",
    unread: true,
    verified: true,
    status: "in_progress",
    messages: [
      {
        id: "m1",
        from: "artisan",
        content: {
          type: "alert",
          text: "Vous échangez avec un artisan vérifié par D•VIA. Ne partagez pas vos coordonnées bancaires directement...",
        },
        time: "",
      },
      {
        id: "m2",
        from: "client",
        content: { type: "text", text: "Bonjour Antoine, avez-vous de la disponibilité cette semaine ?" },
        time: "8h45",
      },
      {
        id: "m3",
        from: "artisan",
        content: { type: "text", text: "Bonjour, je peux me déplacer demain matin." },
        time: "9h30",
      },
    ],
  },
  {
    id: "artisan-3",
    initial: "P",
    name: "Pierre Lambert",
    company: "Pro Bâtiment 75",
    lastMessage: "Voici le devis que vous avez demandé.",
    time: "Hier",
    unread: false,
    verified: false,
    status: "pending",
    messages: [
      {
        id: "m1",
        from: "artisan",
        content: {
          type: "alert",
          text: "Vous échangez avec un artisan sur D•VIA. Ne partagez pas vos coordonnées bancaires directement...",
        },
        time: "",
      },
      {
        id: "m2",
        from: "client",
        content: {
          type: "text",
          text: "Bonjour, pouvez-vous me faire un devis pour une rénovation de salle de bain ?",
        },
        time: "Hier 14h00",
      },
      {
        id: "m3",
        from: "artisan",
        content: { type: "text", text: "Voici le devis que vous avez demandé." },
        time: "Hier 16h30",
      },
      {
        id: "m4",
        from: "artisan",
        content: {
          type: "quote",
          ref: "DEV-2026-03-130",
          title: "Rénovation salle de bain complète",
          amount: "4 200,00€ TTC",
          status: "Pending",
        },
        time: "Hier 16h35",
      },
    ],
  },
];
