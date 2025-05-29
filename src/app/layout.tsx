import type { Metadata } from "next";

import "./globals.css";
import { Providers } from "@/providers/providers";
import Script from "next/script";
import Header from "@/components/organisms/Header";
import Footer from "@/components/organisms/Footer";
import { ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BottomActionButton from "@/components/organisms/BottomActionButton";

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
        <Script id="axeptio-sdk" strategy="beforeInteractive">
          {`
            window.axeptioSettings = {
              clientId: "68307104da135f22c9435963",
              cookiesVersion: "github/ondongo/d-via-fr-CA-QC",
              googleConsentMode: {
                default: {
                  analytics_storage: "denied",
                  ad_storage: "denied",
                  ad_user_data: "denied",
                  ad_personalization: "denied",
                  wait_for_update: 500
                }
              }
            };
            (function(d,s) {
              var t = d.getElementsByTagName(s)[0], e = d.createElement(s);
              e.async = true; e.src = "//static.axept.io/sdk.js";
              t.parentNode.insertBefore(e, t);
            })(document, "script");
          `}
        </Script>
        <Providers>
          <div className="overflow-hidden pb-20 md:pb-0">
            <Header />
            {children}
            <Footer />
          </div>
          <BottomActionButton />
          <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            transition={Zoom}
            className="custom-toast"
          />
        </Providers>
      </body>
    </html>
  );
}
