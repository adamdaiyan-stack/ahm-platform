import { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  /** Extra classes on the inner wrapper */
  className?: string;
  /** Remove horizontal padding (e.g. for full-bleed tables) */
  flush?: boolean;
}

export default function PageContainer({
  children,
  className = "",
  flush = false,
}: PageContainerProps) {
  return (
    <div className={`max-w-7xl mx-auto w-full ${flush ? "" : "px-6"} ${className}`}>
      {children}
    </div>
  );
}
