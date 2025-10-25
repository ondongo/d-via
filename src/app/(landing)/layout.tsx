

import Header from "@/components/organisms/Header";
import Footer from "@/components/organisms/Footer";
import { ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BottomActionButton from "@/components/organisms/BottomActionButton";

export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="pb-20 md:pb-0">
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
      </body>
    </html>
  );
}
