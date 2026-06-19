import Image from "next/image";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-forgeko-border/80 bg-forgeko-bg/82 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-6">
        <a href="#top" className="focus-ring flex items-center gap-3" aria-label="Forgeko home">
          <Image src="/logo.png" alt="" width={158} height={44} priority className="h-8 w-auto" />
        </a>
        <div className="hidden items-center gap-7 text-sm text-neutral-400 md:flex">
          <a className="focus-ring transition hover:text-forgeko-text" href="#problem">
            Problem
          </a>
          <a className="focus-ring transition hover:text-forgeko-text" href="#solution">
            Solution
          </a>
          <a className="focus-ring transition hover:text-forgeko-text" href="#how-it-works">
            How it works
          </a>
        </div>
        <a
          href="#waitlist"
          className="focus-ring inline-flex h-10 items-center justify-center border border-forgeko-border px-4 text-sm font-medium text-forgeko-text transition hover:border-forgeko-accent/70 hover:bg-forgeko-accent/10"
        >
          Waitlist
        </a>
      </nav>
    </header>
  );
}
