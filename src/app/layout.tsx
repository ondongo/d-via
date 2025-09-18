
import "./globals.css";
import { Providers } from "@/providers/providers";
import Script from "next/script";
export const metadata = {
  title: "Analyser votre devis | Dvia",
  description:
    "Évitez les arnaques et analysez votre devis avec précision grâce à notre outil sécurisé.",
  keywords: [
    "analyse devis",
    "arnaque artisan",
    "économie travaux",
    "client satisfait",
    "dvia",
  ],
  openGraph: {
    title: "Analyser votre devis | Dvia",
    description:
      "Des milliers de clients nous font confiance pour détecter les arnaques dans leurs devis.",
    url: "https://d-via.vercel.app/",
    siteName: "Dvia",
    images: [
      {
        url: "/og/og.png", // image Open Graph à créer
        width: 1200,
        height: 630,
        alt: "Analyse de devis Dvia",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Analysez vos devis avec Dvia",
    description:
      "Évitez les pièges dans les devis grâce à notre technologie d’analyse intelligente.",
    images: ["/og/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
    
        <Providers>
          <div className="overflow-hidden">{children}</div>
        </Providers>
        <Script
          id="crisp-chat"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.$crisp=[];
              window.CRISP_WEBSITE_ID="67015992-6c5f-44e4-9f35-6c29aec4eb43";
              (function(){
                var d=document;
                var s=d.createElement("script");
                s.src="https://client.crisp.chat/l.js";
                s.async=1;
                d.getElementsByTagName("head")[0].appendChild(s);
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}
