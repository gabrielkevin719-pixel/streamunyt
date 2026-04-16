"use client"

import { useEffect, useRef } from "react"

const steps = [
  {
    number: "01",
    badge: "Escolha",
    badgeClass: "badge-orange",
    title: "Monte seu Combo",
    description:
      "Escolha entre os planos Basico, Premium ou Ultra -- ou personalize com os servicos que realmente usa. Nosso algoritmo calcula a menor combinacao possivel.",
    footer: "Sem fidelidade - Cancel quando quiser",
    footerColor: "text-mint",
  },
  {
    number: "02",
    badge: "Pague",
    badgeClass: "badge-ice",
    title: "Uma Cobranca, So",
    description:
      "Pague um unico valor mensal via PIX, cartao ou boleto. Nossa plataforma de wallet digital gerencia automaticamente todas as renovacoes individuais nos dias certos.",
    footer: "Modelo: Wallet Centralizada (Hipotetico)",
    footerColor: "text-ice",
  },
  {
    number: "03",
    badge: "Aproveite",
    badgeClass: "badge-mint",
    title: "Dashboard Unificado",
    description:
      "Acesse o painel StreamUnity e gerencie todas as assinaturas em um so lugar. Veja datas de vencimento, uso por plataforma, historico e receba alertas de renovacao automatica.",
    footer: "App iOS - Android - Web",
    footerColor: "text-mint",
  },
]

function RevealOnScroll({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add("visible")
            }, delay)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [delay])

  return (
    <div ref={ref} className="reveal">
      {children}
    </div>
  )
}

export { RevealOnScroll }

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="py-32 px-6 relative">
      <hr className="hr-spark mb-24" />
      <div className="max-w-7xl mx-auto">
        <RevealOnScroll>
          <div className="text-center mb-20">
            <span className="section-label font-mono">{"PROCESSO"}</span>
            <h2 className="font-display text-[clamp(40px,5vw,72px)] tracking-tight">
              Como Funciona
            </h2>
            <p className="text-muted mt-4 max-w-xl mx-auto">
              Tres passos para centralizar toda a sua vida de entretenimento.
            </p>
          </div>
        </RevealOnScroll>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <RevealOnScroll key={step.number} delay={i * 150}>
              <div className="glass rounded-2xl p-8 relative h-full">
                <div className="font-display text-[72px] text-[rgba(249,115,22,0.15)] leading-none mb-4">
                  {step.number}
                </div>
                <div className="mb-4">
                  <span className={`badge ${step.badgeClass} font-mono`}>
                    {step.badge}
                  </span>
                </div>
                <h3 className="text-[22px] font-bold mb-3">{step.title}</h3>
                <p className="text-muted leading-relaxed">{step.description}</p>
                <div className="mt-6 pt-5 border-t border-border">
                  <code className={`font-mono text-[11px] ${step.footerColor}`}>
                    {step.footer}
                  </code>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
