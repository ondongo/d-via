"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

const LoginClientPage = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleGoogleLogin = () => {
    // TODO: Intégrer ici la logique de connexion (ex: signIn("google") avec NextAuth ou Firebase)
    console.log("Lancement de la connexion Google...");
  };

  return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full space-y-8 bg-[#F9F4F1] p-12 rounded-2xl shadow-lg text-dvianeutral-10">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold">Content de vous revoir</h1>
            <p className="text-dvianeutral-30 mt-3 text-xl">Connectez-vous pour accéder à votre espace personnel.</p>
          </div>

          <form className="space-y-6">
            <div className="mb-6">
              <label className="block text-lg font-medium text-dvianeutral-30 mb-2" htmlFor="email">
                Email
              </label>
              <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-4 text-lg border border-dvianeutral-50 rounded-lg focus:outline-none focus:ring-dviaprimary-40 focus:border-dviaprimary-40 bg-transparent"
              />
            </div>

            <div className="mb-6">
              <label className="block text-lg font-medium text-dvianeutral-30 mb-2" htmlFor="password">
                Mot de passe
              </label>
              <div className="relative">
                <input
                    type={passwordVisible ? "text" : "password"}
                    id="password"
                    className="w-full px-4 py-4 text-lg border border-dvianeutral-50 rounded-lg focus:outline-none focus:ring-dviaprimary-40 focus:border-dviaprimary-40 bg-transparent pr-12"
                />
                <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-dvianeutral-30 hover:text-dviaprimary-40"
                >
                  {passwordVisible ? <EyeOff size={24} /> : <Eye size={24} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <input type="checkbox" id="remember-me" className="h-5 w-5 text-dviaprimary-40 focus:ring-dviaprimary-40 border-dvianeutral-50 rounded" />
                <label htmlFor="remember-me" className="ml-3 block text-base text-dvianeutral-30">
                  Se souvenir de moi
                </label>
              </div>
              <Link href="#" className="text-base text-dviaprimary-40 hover:underline">
                Mot de passe oublié ?
              </Link>
            </div>

            <button
                type="submit"
                className="w-full bg-dviaprimary-40 text-white py-4 text-xl font-semibold rounded-lg hover:bg-dviaprimary-50 transition-colors shadow-md"
            >
              Se connecter
            </button>
          </form>

          {/* Séparateur ajouté */}
          <div className="flex items-center my-8">
            <div className="flex-grow border-t border-dvianeutral-50"></div>
            <span className="flex-shrink-0 mx-4 text-dvianeutral-30 text-lg uppercase">OU CONTINUER AVEC</span>
            <div className="flex-grow border-t border-dvianeutral-50"></div>
          </div>

          <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex justify-center items-center py-4 text-lg font-medium border border-dvianeutral-50 rounded-lg hover:bg-dvianeutral-94 transition-colors"
          >
            <Image src="/google.svg" alt="Google" width={24} height={24} className="mr-3" />
            Google
          </button>

          <p className="mt-8 text-center text-base">
            Pas encore de compte ?{" "}
            <Link href="/signup-client/step1" className="text-dviaprimary-40 hover:underline font-semibold">
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
  );
};

export default LoginClientPage;
