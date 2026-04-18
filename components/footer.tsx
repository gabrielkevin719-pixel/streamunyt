import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-[#0D1425] rounded-xl border border-[#1C2A44] flex items-center justify-center">
                <svg width="18" height="20" viewBox="0 0 120 160" fill="none">
                  <path d="M 90,10 C 115,10 20,55 50,65 L 80,72 L 50,80 C 20,88 115,130 90,140" stroke="url(#footerGrad)" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  <defs>
                    <linearGradient id="footerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#A855F7"/>
                      <stop offset="100%" stopColor="#3B82F6"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <span className="font-display text-xl tracking-wider italic">
                STREAM<span className="bg-gradient-to-r from-[#A855F7] to-[#6366F1] bg-clip-text text-transparent">IXX</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
              Todas as suas assinaturas de streaming em um so lugar. Simplifique
              sua vida digital e economize todo mes.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Produto</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#planos"
                  className="text-muted-foreground hover:text-primary text-sm transition-colors"
                >
                  Planos
                </Link>
              </li>
              <li>
                <Link
                  href="#como-funciona"
                  className="text-muted-foreground hover:text-primary text-sm transition-colors"
                >
                  Como Funciona
                </Link>
              </li>
              <li>
                <Link
                  href="#calculadora"
                  className="text-muted-foreground hover:text-primary text-sm transition-colors"
                >
                  Calculadora
                </Link>
              </li>
              <li>
                <Link
                  href="#faq"
                  className="text-muted-foreground hover:text-primary text-sm transition-colors"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary text-sm transition-colors"
                >
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary text-sm transition-colors"
                >
                  Privacidade
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary text-sm transition-colors"
                >
                  Contato
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            2026 Streamixx. Prototipo conceitual para fins de estudo.
          </p>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground text-sm">Feito com</span>
            <span className="text-primary">Next.js</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
