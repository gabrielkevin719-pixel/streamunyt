"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "Como funciona o StreamUnity?",
    answer:
      "O StreamUnity agrega multiplas assinaturas de streaming em um unico plano. Voce paga uma vez por mes e nos gerenciamos todas as suas assinaturas individuais, economizando tempo e dinheiro.",
  },
  {
    question: "Quais servicos estao inclusos?",
    answer:
      "Dependendo do plano escolhido, voce pode ter acesso a Netflix, Spotify, Disney+, HBO Max, TNT Sports, Amazon Prime e YouTube Premium. Cada plano oferece uma combinacao diferente de servicos.",
  },
  {
    question: "Posso cancelar a qualquer momento?",
    answer:
      "Sim! Nao ha fidelidade ou multa por cancelamento. Voce pode cancelar sua assinatura a qualquer momento diretamente pelo painel do StreamUnity.",
  },
  {
    question: "Como e feito o pagamento?",
    answer:
      "Aceitamos PIX, cartao de credito e boleto. O PIX e instantaneo e seu acesso e liberado imediatamente apos a confirmacao do pagamento.",
  },
  {
    question: "Quanto tempo leva para liberar o acesso?",
    answer:
      "Para pagamentos via PIX, o acesso e liberado em ate 5 minutos apos a confirmacao. Para cartao de credito, o acesso e imediato. Boletos podem levar ate 3 dias uteis.",
  },
  {
    question: "Posso compartilhar com minha familia?",
    answer:
      "Sim! Os planos Premium e Ultra incluem perfis familiares em servicos que suportam essa funcionalidade, como Netflix e Spotify Family.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-32 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <span className="font-mono text-xs tracking-[3px] uppercase text-primary mb-3 block">
            FAQ
          </span>
          <h2 className="font-display text-4xl md:text-6xl tracking-tight">
            Perguntas Frequentes
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="glass rounded-xl overflow-hidden"
            >
              <button
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-medium pr-4">{faq.question}</span>
                <ChevronDown
                  size={20}
                  className={cn(
                    "text-muted-foreground flex-shrink-0 transition-transform duration-200",
                    openIndex === index && "rotate-180"
                  )}
                />
              </button>
              <div
                className={cn(
                  "overflow-hidden transition-all duration-200",
                  openIndex === index ? "max-h-96" : "max-h-0"
                )}
              >
                <p className="px-5 pb-5 text-muted-foreground leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
