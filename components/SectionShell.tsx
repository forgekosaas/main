import type { ReactNode } from "react";

export function SectionShell({
  id,
  children,
  className = ""
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`mx-auto w-full max-w-copy px-5 py-20 sm:px-6 sm:py-28 ${className}`}>
      {children}
    </section>
  );
}

export function SectionHeading({ children }: { children: ReactNode }) {
  return <h2 className="text-3xl font-semibold leading-tight tracking-normal text-forgeko-text sm:text-4xl">{children}</h2>;
}

export function MutedText({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`text-base leading-8 text-neutral-400 sm:text-lg ${className}`}>{children}</p>;
}
