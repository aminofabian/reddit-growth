"use client";

import { cn } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { Jost } from "next/font/google";
import BackButton from "./BackButton";
import Header from "../common/Logo";

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
}

const font = Jost({
  subsets: ["latin"],
  weight: ["700"],
});

const CardWrapper = ({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  showSocial,
}: CardWrapperProps) => {
  return (
    <Card
    className={cn(
      "w-full max-w-[800px] min-h-[500px] mx-auto relative",
      "bg-black text-white",
      "border-0 shadow-2xl",
      "transition-all duration-300",
      "md:flex md:flex-row",
      "rounded-xl",
      font.className
    )}
    >
    {/* Left panel - simplified */}
    <div className="hidden md:block md:w-1/9 bg-black border-r border-white/10" />
    
    {/* Main content container */}
    <div className="flex-1 flex flex-col min-h-full">
    {/* Content layout */}
    <div className="flex-1 flex flex-col p-6 space-y-8">
    <CardHeader className="p-0">
    <Header label={headerLabel} />
    </CardHeader>
    
    <CardContent className="flex-1 p-0">
    {children}
    </CardContent>
    
    {showSocial && (
      <CardFooter className="p-0">
      {/* <Social /> */}
      </CardFooter>
    )}
    
    <CardFooter className="p-0 pt-4 border-t border-white/10">
    <BackButton 
    href={backButtonHref} 
    label={backButtonLabel}
    />
    </CardFooter>
    </div>
    </div>
    </Card>
  );
};

export default CardWrapper;