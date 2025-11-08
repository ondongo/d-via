import { ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HeaderAuth from "@/components/organisms/HeaderAuth";
import FooterAuth from "@/components/organisms/FooterAuth";
import { SignupProvider } from "@/providers/SignupContext";

export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SignupProvider>
          <div className="pb-20 md:pb-0">
            <HeaderAuth />
            {children}
            <FooterAuth />
          </div>
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
        </SignupProvider>
      </body>
    </html>
  );
}
