"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const services = [
  { id: "netflix", name: "Netflix", price: 29.9 },
  { id: "spotify", name: "Spotify", price: 21.9 },
  { id: "disney", name: "Disney+", price: 27.9 },
  { id: "hbomax", name: "HBO Max", price: 34.9 },
  { id: "tnt", name: "TNT Sports", price: 29.9 },
  { id: "amazon", name: "Amazon Prime", price: 19.9 },
  { id: "youtube", name: "YouTube Premium", price: 20.9 },
];

export function CalculatorSection() {
  const [selected, setSelected] = useState<string[]>([
    "netflix",
    "spotify",
    "disney",
  ]);

  const toggleService = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const totalIndividual = services
    .filter((s) => selected.includes(s.id))
    .reduce((acc, s) => acc + s.price, 0);

  // StreamUnity pricing logic
  const getStreamUnityPrice = () => {
    const count = selected.length;
    if (count <= 3) return 69;
    if (count <= 5) return 109;
    return 149;
  };

  const streamUnityPrice = getStreamUnityPrice();
  const savings = totalIndividual - streamUnityPrice;

  return (
    <section id="calculadora" className="py-32 px-6 relative">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="font-mono text-xs tracking-[3px] uppercase text-primary mb-3 block">
            CALCULADORA
          </span>
          <h2 className="font-display text-4xl md:text-6xl tracking-tight">
            Quanto Voce Economiza?
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            Selecione os servicos que voce usa atualmente e veja a economia.
          </p>
        </div>

        <div className="glass rounded-3xl p-8">
          <div className="grid gap-3 mb-8">
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => toggleService(service.id)}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl border transition-all text-left",
                  selected.includes(service.id)
                    ? "bg-primary/8 border-primary/30"
                    : "bg-transparent border-border hover:bg-primary/5 hover:border-primary/20"
                )}
              >
                {/* Checkbox */}
                <div
                  className={cn(
                    "w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all",
                    selected.includes(service.id)
                      ? "bg-primary border-primary"
                      : "border-muted-foreground/40"
                  )}
                >
                  {selected.includes(service.id) && (
                    <svg
                      width="12"
                      height="10"
                      viewBox="0 0 12 10"
                      fill="none"
                      className="text-primary-foreground"
                    >
                      <path
                        d="M1 5L4.5 8.5L11 1.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>

                {/* Service info */}
                <div className="flex-1">
                  <span className="font-medium">{service.name}</span>
                </div>

                {/* Price */}
                <span className="font-mono text-sm text-muted-foreground">
                  R${service.price.toFixed(2).replace(".", ",")}/mes
                </span>
              </button>
            ))}
          </div>

          {/* Total bar */}
          <div className="bg-gradient-to-r from-primary/15 to-glow/5 border border-primary/30 rounded-2xl p-6">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <p className="font-mono text-xs text-muted-foreground mb-2 tracking-wider">
                  PAGARIA SEPARADO
                </p>
                <p className="font-display text-3xl text-muted-foreground line-through">
                  R${totalIndividual.toFixed(2).replace(".", ",")}
                </p>
              </div>
              <div>
                <p className="font-mono text-xs text-muted-foreground mb-2 tracking-wider">
                  PAGA COM STREAMUNITY
                </p>
                <p className="font-display text-3xl text-primary">
                  R${streamUnityPrice.toFixed(2).replace(".", ",")}
                </p>
              </div>
              <div>
                <p className="font-mono text-xs text-muted-foreground mb-2 tracking-wider">
                  ECONOMIA MENSAL
                </p>
                <p className="font-display text-3xl text-mint">
                  R${Math.max(0, savings).toFixed(2).replace(".", ",")}
                </p>
              </div>
            </div>

            {savings > 0 && (
              <div className="mt-6 text-center">
                <p className="text-muted-foreground text-sm">
                  Economia anual de{" "}
                  <strong className="text-mint">
                    R${(savings * 12).toFixed(2).replace(".", ",")}
                  </strong>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
