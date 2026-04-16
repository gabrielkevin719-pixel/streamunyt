"use client"

export default function Navbar() {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100]">
      <div className="bg-[rgba(3,7,18,0.85)] backdrop-blur-[20px] border-b border-[rgba(33,38,45,0.6)]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-spark to-[#FBBF24] rounded-lg flex items-center justify-center font-display text-lg text-void shadow-[0_0_20px_rgba(249,115,22,0.4)]">
              S
            </div>
            <span className="font-display text-[22px] tracking-[2px]">
              StreamUnity
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {[
              { label: "Planos", id: "planos" },
              { label: "Como Funciona", id: "como-funciona" },
              { label: "Calculadora", id: "calculadora" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="footer-link hover:text-foreground transition-colors text-sm font-medium"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button className="footer-link hover:text-foreground text-sm font-medium px-4 py-2 rounded-lg hover:bg-white/5 transition-all">
              Entrar
            </button>
            <button className="btn-primary py-2 px-5 text-sm">
              {"Comecar Gratis"}
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
