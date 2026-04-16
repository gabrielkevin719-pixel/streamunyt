import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-glow rounded-lg flex items-center justify-center shadow-lg shadow-primary/40">
                <span className="font-display text-lg text-background">S</span>
              </div>
              <span className="font-display text-xl tracking-wider">
                StreamUnity
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
            2024 StreamUnity. Prototipo conceitual para fins de estudo.
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
