import { Jost } from "next/font/google";
import { cn } from "@/lib/utils";
import Image from "next/image";

const font = Jost({
  subsets: ["latin"],
  weight: ["400", "700"],
});

interface HeaderProps {
  label: string;
}

const Header = ({ label }: HeaderProps) => {
  return (
    <div className="w-full flex flex-col items-center justify-center gap-2">
    <div className="flex items-center gap-2">
    <Image 
    src="/red.png" 
    alt="Logo" 
    width={50} 
    height={50}
    className="object-contain"
    />
    <h1 className={cn(
      "text-3xl font-semibold text-red-700",
      font.className
    )}>
    Reddit Growth
    </h1>
    </div>
    <p className="text-muted-foreground text-xs">{label}</p>
    </div>
  );
};

export default Header;