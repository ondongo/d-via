import { ICONS } from "@/constants/icons";
import Image from "next/image";
export default function AlertMessage({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-start gap-3 mx-auto w-full bg-dviaalert px-4 py-3">
      <Image src={ICONS.alert} alt="alert" width={18} height={18} />
      <p className="text-xs text-dviaprimary-20 leading-relaxed">{text}</p>
    </div>
  );
}
