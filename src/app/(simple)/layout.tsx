import Image from "next/image";
import Link from "next/link";
import { ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ResetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <div className="flex min-h-screen flex-col">
          <header className="flex items-center justify-center p-4 border-b border-dvianeutral-50">
            <Link href="/"> 
              <Image
                src="/logos/logo.png"
                alt="D-via"
                width={90}
                height={0}
                style={{ maxWidth: "213px", maxHeight: "80px" }}
                priority
              />
            </Link>
          </header>

          <main className="flex flex-1 items-start justify-center pt-16 px-4">
            {children}
          </main>
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
      </body>
    </html>
  );
}
