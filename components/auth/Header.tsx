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
    <div className="w-full flex flex-col gap-y-4 items-center justify-center">
    <h1 className={cn("text-3xl font-semibold text-white", font.className)}>
    
    <Image src="/redditgrowth.png" alt="Logo" width={100} height={100} />
    Reddit Growth
    
    </h1>
    <p className="text-muted-foreground text-sm">{label}</p>
    </div>
  );
};

export default Header;
