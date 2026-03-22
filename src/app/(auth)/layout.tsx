import { ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HeaderAuth from "@/components/organisms/HeaderAuth";
import FooterAuth from "@/components/organisms/FooterAuth";
import SignupLoadingModal from "@/components/organisms/SignupLoadingModal";

export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="pb-20 md:pb-0">
        <HeaderAuth />
        <div className="py-5">{children}</div>
        <FooterAuth />
      </div>
      <SignupLoadingModal />
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
    </>
  );
}
