import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Base gradient background */}
      <div
        className="fixed inset-0"
        style={{
          background:
            "linear-gradient(135deg, #000000 0%, #8B0000 50%, #FF0000 100%)",
        }}
      />

      {/* Pattern overlays */}
      <div className="fixed inset-0">
        {/* Circular gradient like the logo */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background: `
              radial-gradient(circle at 30% 40%, 
                #FF0000 0%,
                transparent 60%
              ),
              radial-gradient(circle at 70% 60%, 
                #8B0000 0%,
                transparent 50%
              )
            `,
          }}
        />

        {/* Subtle wave pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                45deg,
                transparent,
                transparent 100px,
                rgba(255, 0, 0, 0.1) 100px,
                rgba(255, 0, 0, 0.1) 200px
              )
            `,
          }}
        />

        {/* Dynamic shadow effect */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(
                45deg,
                rgba(0, 0, 0, 0.4) 0%,
                transparent 50%,
                rgba(139, 0, 0, 0.4) 100%
              )
            `,
          }}
        />

        {/* Shine effect similar to logo */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.05) 45%, transparent 100%)",
          }}
        />
      </div>

      {/* Content container */}
      <div className="relative flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md p-6 text-center">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
