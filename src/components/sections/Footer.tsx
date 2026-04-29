export const Footer = () => (
  <footer className="bg-primary text-primary-foreground/80 py-10">
    <div className="container flex flex-wrap items-center justify-between gap-4 text-sm">
      <div className="flex items-center gap-3">
        <span className="h-9 w-9 rounded-lg bg-warm-gradient grid place-items-center text-accent-foreground font-display font-bold">C</span>
        <span className="font-display font-bold text-primary-foreground">CFBUF · Skiza Ground</span>
      </div>
      <div>© {new Date().getFullYear()} Centre for Bungoma United Front. All rights reserved.</div>
    </div>
  </footer>
);