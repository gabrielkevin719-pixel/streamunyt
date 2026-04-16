"use client"

import { RevealOnScroll } from "./how-it-works"

const services = {
  netflix: "Netflix",
  spotify: "Spotify",
  disney: "Disney+",
  hbomax: "HBO Max",
  tnt: "TNT Sports",
  amazon: "Amazon Prime",
  youtube: "YouTube Premium",
}

type ServiceKey = keyof typeof services

interface PlanData {
  name: string
  tier: string
  cardClass: string
  price: string
  subtitle: string
  included: { key: ServiceKey; label: string }[]
  excluded: ServiceKey[]
  economy: string
  featured?: boolean
}

const plans: PlanData[] = [
  {
    name: "Essencial",
    tier: "BASICO",
    cardClass: "basic",
    price: "R$69",
    subtitle: "Para quem quer o melhor em video e musica",
    included: [
      { key: "netflix", label: "Netflix (Padrao)" },
      { key: "spotify", label: "Spotify Premium" },
    ],
    excluded: ["disney", "hbomax", "tnt", "amazon", "youtube"],
    economy: "~R$42/mes",
  },
  {
    name: "Total",
    tier: "PREMIUM",
    cardClass: "featured",
    price: "R$109",
    subtitle: "O combo completo de streaming e musica",
    included: [
      { key: "netflix", label: "Netflix (4K)" },
      { key: "spotify", label: "Spotify Premium" },
      { key: "disney", label: "Disney+" },
      { key: "hbomax", label: "HBO Max" },
      { key: "amazon", label: "Amazon Prime" },
    ],
    excluded: ["tnt", "youtube"],
    economy: "~R$86/mes",
    featured: true,
  },
  {
    name: "Maximo",
    tier: "ULTRA",
    cardClass: "ultra",
    price: "R$149",
    subtitle: "Absolutamente tudo incluso",
    included: [
      { key: "netflix", label: "Netflix (4K)" },
      { key: "spotify", label: "Spotify Premium" },
      { key: "disney", label: "Disney+" },
      { key: "hbomax", label: "HBO Max" },
      { key: "tnt", label: "TNT Sports" },
      { key: "amazon", label: "Amazon Prime" },
      { key: "youtube", label: "YouTube Premium" },
    ],
    excluded: [],
    economy: "~R$127/mes",
  },
]

function ServiceItem({ label, included }: { label: string; included: boolean }) {
  return (
    <div className={`flex items-center gap-3 text-sm ${included ? "text-foreground" : "text-muted/50"}`}>
      <span className={included ? "text-mint" : "text-muted/30"}>
        {included ? "\u2713" : "\u2717"}
      </span>
      <span>{label}</span>
    </div>
  )
}

export default function Plans() {
  return (
    <section
      id="planos"
      className="py-32 px-6 relative"
      style={{
        background:
          "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(249,115,22,0.05), transparent)",
      }}
    >
      <div className="max-w-7xl mx-auto">
        <RevealOnScroll>
          <div className="text-center mb-20">
            <span className="section-label font-mono">PLANOS</span>
            <h2 className="font-display text-[clamp(40px,5vw,72px)] tracking-tight">
              Escolha seu Plano
            </h2>
            <p className="text-muted mt-4 max-w-xl mx-auto">
              Valores hipoteticos para fins de demonstracao e estudo de mercado.
            </p>
            <div className="glass-spark inline-flex items-center gap-2 px-4 py-2 rounded-full mt-4">
              <span className="font-mono text-[11px] text-spark">
                {"PROTOTIPO CONCEITUAL -- Precos ficticios"}
              </span>
            </div>
          </div>
        </RevealOnScroll>

        <RevealOnScroll>
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.tier}
                className={`plan-card ${plan.cardClass}`}
                style={plan.featured ? { transform: "scale(1.03)" } : undefined}
              >
                <div className="plan-inner relative">
                  {plan.featured && (
                    <div className="absolute -top-px left-1/2 -translate-x-1/2 bg-gradient-to-r from-spark to-[#FBBF24] text-void font-display text-[13px] tracking-[2px] px-4 py-1 rounded-b-lg">
                      MAIS POPULAR
                    </div>
                  )}
                  <span className={`badge badge-orange mb-4 inline-block font-mono ${plan.featured ? "mt-6" : ""}`}>
                    {plan.tier}
                  </span>
                  <h3 className="text-2xl font-bold mb-1">{plan.name}</h3>
                  <p className="text-muted text-sm mb-6">{plan.subtitle}</p>
                  <div className="font-display text-[64px] leading-none tracking-tight shimmer-text">
                    {plan.price}
                  </div>
                  <p className="text-muted/60 text-sm mb-8">
                    /mes - cobrado mensalmente
                  </p>

                  <div className="border-t border-border pt-5 mb-6">
                    <p className="text-[11px] font-mono text-muted mb-3 tracking-[1px]">
                      INCLUI
                    </p>
                    <div className="flex flex-col gap-3">
                      {plan.included.map((s) => (
                        <ServiceItem
                          key={s.key}
                          label={s.label}
                          included={true}
                        />
                      ))}
                      {plan.excluded.map((key) => (
                        <ServiceItem
                          key={key}
                          label={services[key]}
                          included={false}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-mint mb-4">
                    Economia estimada:{" "}
                    <strong>{plan.economy}</strong>
                  </p>

                  <button
                    className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
                      plan.featured
                        ? "btn-primary"
                        : "border border-spark/30 text-spark hover:bg-spark/10"
                    }`}
                  >
                    {plan.featured
                      ? "Escolher Premium"
                      : `Escolher ${plan.name}`}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}
