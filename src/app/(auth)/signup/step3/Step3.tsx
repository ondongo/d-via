import CodePinInput from "@/components/atoms/auth/CodePinInput";

export default function Step3() {
  return (
    <div className="flex flex-col border-dvianeutral-50 border-1 rounded-8px p-8 max-w-[600px] min-h-[272px] gap-4">
      <h1 className="whitespace-nowrap hidden md:block text-[54px] font-bold leading-display-large tracking-display-large text-dvianeutral-10 ">
        Entrer le code
      </h1>

      <p className="font-normal text-body-small leading-body-small tracking-body-small gap-5 md:text-[16px] text-dvianeutral-10 md:leading-headline-small  md:tracking-headline-small md:mb-10 ">
        Nous avons envoyé un code de vérification à 6 chiffres à votre numéro de
        téléphone{" "}
        <span className="text-dvianeutral-10 font-bold">+33 7 89 54 36 18.</span>
      </p>
      <CodePinInput />
    </div>
  );
}
