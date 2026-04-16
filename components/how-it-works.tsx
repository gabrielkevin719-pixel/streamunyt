"use client";

import { cn } from "@/lib/utils";

const steps = [
  {
    number: "01",
    badge: "Escolha",
    badgeColor: "bg-primary/15 text-primary border-primary/30",
    title: "Monte seu Combo",
    description:
      "Escolha entre os planos Basico, Premium ou Ultra — ou personalize com os servicos que realmente usa. Nosso algoritmo calcula a menor combinacao possivel.",
    footer: "Sem fidelidade - Cancel quando quiser",
    footerColor: "text-mint",
  },
  {
    number: "02",
    badge: "Pague",
    badgeColor: "bg-ice/10 text-ice border-ice/30",
    title: "Uma Cobranca, So",
    description:
      "Pague um unico valor mensal via PIX, cartao ou boleto. Nossa plataforma de wallet digital gerencia automaticamente todas as renovacoes individuais nos dias certos.",
    footer: "Modelo: Wallet Centralizada",
    footerColor: "text-ice",
  },
  {
    number: "03",
    badge: "Aproveite",
    badgeColor: "bg-mint/10 text-mint border-mint/30",
    title: "Dashboard Unificado",
    description:
      "Acesse o painel Streamix e gerencie todas as assinaturas em um so lugar. Veja datas de vencimento, uso por plataforma, historico e receba alertas de renovacao automatica.",
    footer: "App iOS - Android - Web",
    footerColor: "text-mint",
  },
];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="py-32 px-6 relative">
      {/* Spark divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent mb-24" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <span className="font-mono text-xs tracking-[3px] uppercase text-primary mb-3 block">
            PROCESSO
          </span>
          <h2 className="font-display text-4xl md:text-6xl lg:text-7xl tracking-tight">
            Como Funciona
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            Tres passos para centralizar toda a sua vida de entretenimento.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="glass rounded-2xl p-8 relative group hover:-translate-y-1 transition-transform duration-300"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Large number */}
              <div className="font-display text-7xl text-primary/15 leading-none mb-4">
                {step.number}
              </div>

              {/* Badge */}
              <div className="mb-4">
                <span
                  className={cn(
                    "font-mono text-xs font-bold px-3 py-1 rounded border uppercase tracking-wider",
                    step.badgeColor
                  )}
                >
                  {step.badge}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>

              {/* Footer */}
              <div className="mt-6 pt-5 border-t border-border">
                <code
                  className={cn(
                    "font-mono text-xs",
                    step.footerColor
                  )}
                >
                  {step.footer}
                </code>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
