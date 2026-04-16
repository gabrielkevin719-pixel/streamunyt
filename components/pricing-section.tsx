"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

// Logo mapping for streaming services
const serviceLogos: Record<string, string> = {
  "Netflix (Padrao)": "/logos/netflix.png",
  "Netflix (Premium 4K)": "/logos/netflix.png",
  "Spotify Premium": "/logos/spotify.png",
  "Spotify Premium Familia": "/logos/spotify.png",
  "Amazon Prime Video": "/logos/prime-video.png",
  "Disney+ (Padrao)": "/logos/disney-plus.png",
  "Disney+ (Premium)": "/logos/disney-plus.png",
  "HBO Max (Padrao)": "/logos/hbo-max.png",
  "TNT Sports": "/logos/tnt-sports.png",
  "YouTube Premium": "/logos/youtube.png",
};

const plans = [
  {
    id: "basico",
    name: "Basico",
    subtitle: "Essencial",
    description: "Para quem quer o melhor em video e musica",
    price: 50,
    originalPrice: 71.7,
    services: [
      "Netflix (Padrao)",
      "Spotify Premium",
      "Amazon Prime Video",
    ],
    badge: "BASICO",
    badgeColor: "bg-primary/15 text-primary border-primary/30",
    cardClass: "bg-gradient-to-br from-border/80 to-muted/50",
    featured: false,
  },
  {
    id: "premium",
    name: "Premium",
    subtitle: "Total",
    description: "O pacote mais popular com tudo incluso",
    price: 79.9,
    originalPrice: 134.5,
    services: [
      "Netflix (Premium 4K)",
      "Spotify Premium",
      "Disney+ (Padrao)",
      "HBO Max (Padrao)",
      "Amazon Prime Video",
    ],
    badge: "MAIS POPULAR",
    badgeColor: "bg-primary/20 text-primary border-primary/40",
    cardClass: "bg-gradient-to-br from-[#A855F7] via-[#6366F1] to-[#3B82F6]",
    featured: true,
  },
  {
    id: "ultra",
    name: "Ultra",
    subtitle: "Maximo",
    description: "Para toda a familia com esportes ao vivo",
    price: 129.9,
    originalPrice: 185.3,
    services: [
      "Netflix (Premium 4K)",
      "Spotify Premium Familia",
      "Disney+ (Premium)",
      "HBO Max (Padrao)",
      "TNT Sports",
      "Amazon Prime Video",
      "YouTube Premium",
    ],
    badge: "COMPLETO",
    badgeColor: "bg-ice/10 text-ice border-ice/30",
    cardClass: "bg-gradient-to-br from-border/80 to-ice/20",
    featured: false,
  },
];

export function PricingSection({
  onSelectPlan,
}: {
  onSelectPlan?: (planId: string) => void;
}) {
  return (
    <section
      id="planos"
      className="py-32 px-6 relative"
      style={{
        background:
          "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(168,85,247,0.06), transparent)",
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <span className="font-mono text-xs tracking-[3px] uppercase text-primary mb-3 block">
            PLANOS
          </span>
          <h2 className="font-display text-4xl md:text-6xl lg:text-7xl tracking-tight">
            Escolha seu Plano
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            Valores para demonstracao e estudo de mercado.
          </p>
          <div className="glass-spark inline-flex items-center gap-2 px-4 py-2 rounded-full mt-4">
            <span className="font-mono text-xs text-primary">
              PROTOTIPO CONCEITUAL — Precos ilustrativos
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={cn(
                "relative rounded-[20px] p-0.5 transition-all duration-300 hover:-translate-y-2",
                plan.cardClass,
                plan.featured &&
                  "shadow-2xl shadow-primary/30 hover:shadow-primary/50"
              )}
            >
              <div className="bg-card rounded-[18px] p-8 h-full flex flex-col">
                {/* Badge */}
                <span
                  className={cn(
                    "font-mono text-xs font-bold px-3 py-1 rounded border uppercase tracking-wider inline-block mb-4 w-fit",
                    plan.badgeColor
                  )}
                >
                  {plan.badge}
                </span>

                {/* Title */}
                <h3 className="text-2xl font-bold mb-1">{plan.subtitle}</h3>
                <p className="text-muted-foreground text-sm mb-6">
                  {plan.description}
                </p>

                {/* Price */}
                <div className="mb-1">
                  <span
                    className={cn(
                      "font-display text-5xl md:text-6xl leading-none",
                      plan.featured ? "shimmer-text" : "text-foreground"
                    )}
                  >
                    R${plan.price.toFixed(2).replace(".", ",")}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm mb-2">
                  /mes - cobrado mensalmente
                </p>
                {plan.originalPrice && (
                  <p className="text-sm mb-6">
                    <span className="text-muted-foreground line-through mr-2">
                      R${plan.originalPrice.toFixed(2).replace(".", ",")}
                    </span>
                    <span className="text-mint font-bold">
                      Economia de R${(plan.originalPrice - plan.price).toFixed(2).replace(".", ",")}/mes
                    </span>
                  </p>
                )}

                {/* Service Logos Grid */}
                <div className="flex flex-wrap gap-3 mb-6 pb-6 border-b border-border">
                  {plan.services.map((service) => (
                    <div
                      key={service}
                      className="relative w-10 h-10 rounded-lg bg-transparent p-1.5 flex items-center justify-center overflow-hidden"
                      title={service}
                    >
                      <Image
                        src={serviceLogos[service]}
                        alt={service}
                        width={32}
                        height={32}
                        className="object-contain"
                      />
                    </div>
                  ))}
                </div>

                {/* Services list */}
                <div className="mb-6 flex-1">
                  <p className="font-mono text-xs text-muted-foreground mb-4 tracking-wider">
                    INCLUI
                  </p>
                  <div className="space-y-3">
                    {plan.services.map((service) => (
                      <div
                        key={service}
                        className="flex items-center gap-3 text-sm"
                      >
                        <Check size={16} className="text-mint flex-shrink-0" />
                        <span>{service}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <button
                  onClick={() => onSelectPlan?.(plan.id)}
                  className={cn(
                    "w-full py-4 rounded-xl font-bold text-sm transition-all",
                    plan.featured
                      ? "bg-gradient-to-r from-[#A855F7] to-[#6366F1] text-white shadow-lg shadow-[#A855F7]/30 hover:shadow-[#A855F7]/50"
                      : "bg-secondary text-foreground hover:bg-secondary/80"
                  )}
                >
                  Assinar {plan.name}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
