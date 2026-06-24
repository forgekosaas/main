import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-forgeko-border px-5 py-10 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 text-sm text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 Forgeko. Private development.</p>
        <nav className="flex flex-wrap gap-x-5 gap-y-3">
          <a className="focus-ring hover:text-forgeko-text" href="/privacy">
            Privacy
          </a>
          <a className="focus-ring hover:text-forgeko-text" href="/terms">
            Terms
          </a>
          <a className="focus-ring hover:text-forgeko-text" href="/security">
            Security
          </a>
          <Link className="focus-ring hover:text-forgeko-text" href="/#contact">
            Contact
          </Link>
          <a className="focus-ring hover:text-forgeko-text" href="/humans.txt">
            humans.txt
          </a>
          <a className="focus-ring hover:text-forgeko-text" href="/llms.txt">
            llms.txt
          </a>
        </nav>
      </div>
    </footer>
  );
}
