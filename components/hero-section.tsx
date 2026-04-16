"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Calculator } from "lucide-react";
import Image from "next/image";

const services = [
  { name: "Netflix", color: "#E50914", price: "R$29,90", logo: "/logos/netflix.png" },
  { name: "Spotify", color: "#1DB954", price: "R$21,90", logo: "/logos/spotify.png" },
  { name: "Disney+", color: "#5B4FE8", price: "R$27,90", logo: "/logos/disney-plus.png" },
  { name: "HBO Max", color: "#A855F7", price: "R$34,90", logo: "/logos/hbo-max.png" },
  { name: "TNT Sports", color: "#FF00CC", price: "R$29,90", logo: "/logos/tnt-sports.png" },
  { name: "Amazon Prime", color: "#00A8E0", price: "R$19,90", logo: "/logos/prime-video.png" },
  { name: "YouTube Premium", color: "#FF0000", price: "R$20,90", logo: "/logos/youtube.png" },
];

function AnimatedCounter({
  target,
  prefix = "",
  suffix = "",
}: {
  target: number;
  prefix?: string;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [target]);

  return (
    <span>
      {prefix}
      {count}
      {suffix}
    </span>
  );
}

function useOrbitalRadius() {
  const [radius, setRadius] = useState(110);

  useEffect(() => {
    function update() {
      const w = window.innerWidth;
      if (w >= 768) setRadius(180);
      else if (w >= 640) setRadius(140);
      else setRadius(110);
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return radius;
}

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const orbitalRadius = useOrbitalRadius();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background gradients */}
      <div className="absolute w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,rgba(249,115,22,0.08)_0%,transparent_70%)] -top-[200px] -left-[100px] pointer-events-none" />
      <div className="absolute w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.05)_0%,transparent_70%)] bottom-0 right-0 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div
            className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            {/* Live badge */}
            <div className="inline-flex items-center gap-2 bg-primary/8 border border-primary/20 rounded-full px-4 py-1.5 mb-8">
              <span className="w-2 h-2 rounded-full bg-mint shadow-[0_0_8px] shadow-mint animate-pulse" />
              <span className="font-mono text-xs text-primary tracking-wider uppercase">
                O Fim da Bagunca das Assinaturas
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-display leading-[0.9] tracking-tight mb-7">
              <span className="block text-5xl md:text-7xl lg:text-8xl text-foreground">
                TUDO QUE
              </span>
              <span className="block text-5xl md:text-7xl lg:text-8xl shimmer-text">
                VOCE USA
              </span>
              <span className="block text-5xl md:text-7xl lg:text-8xl text-foreground">
                EM UM SO LUGAR.
              </span>
            </h1>

            {/* Service logos showcase */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {services.map((service) => (
                <div
                  key={service.name}
                  className="relative w-10 h-10 rounded-lg bg-transparent backdrop-blur-sm border border-white/20 overflow-hidden flex items-center justify-center p-1.5 hover:scale-110 transition-transform"
                  title={service.name}
                >
                  <Image
                    src={service.logo}
                    alt={service.name}
                    width={28}
                    height={28}
                    className="object-contain brightness-0 invert w-auto h-auto max-w-full max-h-full"
                  />
                </div>
              ))}
            </div>

            {/* Subtext */}
            <p className="text-muted-foreground text-lg leading-relaxed max-w-xl mb-8">
              StreamUnity agrega todos os seus servicos favoritos em um unico plano mensal. 
              Economize ate <strong className="text-primary">R$127/mes</strong>.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 mb-12">
              <a
                href="#planos"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-bold px-8 py-4 rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5 transition-all"
              >
                Ver Planos e Precos
                <ArrowRight size={18} />
              </a>
              <a
                href="#calculadora"
                className="inline-flex items-center gap-2 bg-ice/10 border border-ice/40 text-ice font-semibold px-8 py-4 rounded-xl hover:bg-ice/20 transition-all"
              >
                <Calculator size={18} />
                Calcular Economia
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-px bg-border/60 rounded-2xl overflow-hidden border border-border/80">
              <div className="bg-card p-5 text-center">
                <div className="font-display text-3xl md:text-4xl text-primary">
                  <AnimatedCounter target={127} prefix="R$" />
                </div>
                <div className="font-mono text-[10px] text-muted-foreground tracking-wider mt-1">
                  ECONOMIA/MES
                </div>
              </div>
              <div className="bg-card p-5 text-center">
                <div className="font-display text-3xl md:text-4xl text-ice">
                  <AnimatedCounter target={7} />
                </div>
                <div className="font-mono text-[10px] text-muted-foreground tracking-wider mt-1">
                  PLATAFORMAS
                </div>
              </div>
              <div className="bg-card p-5 text-center">
                <div className="font-display text-3xl md:text-4xl text-mint">1</div>
                <div className="font-mono text-[10px] text-muted-foreground tracking-wider mt-1">
                  COBRANCA/MES
                </div>
              </div>
            </div>
          </div>

          {/* Right: Service Cards Orbital */}
          <div
            className={`relative transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <div className="relative h-[320px] sm:h-[400px] md:h-[500px] flex items-center justify-center">
              {/* Central hub */}
              <div className="absolute w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-glow via-primary to-primary/80 flex items-center justify-center shadow-2xl shadow-primary/40 z-10">
                <span className="font-display text-2xl sm:text-3xl md:text-4xl text-background">S</span>
              </div>

              {/* Orbiting services with logos */}
              {services.map((service, index) => {
                const angle = (index * 360) / services.length;
                const x = Math.cos((angle * Math.PI) / 180) * orbitalRadius;
                const y = Math.sin((angle * Math.PI) / 180) * orbitalRadius;

                return (
                  <div
                    key={service.name}
                    className="absolute transition-all duration-500 hover:scale-110 group"
                    style={{
                      transform: `translate(${x}px, ${y}px)`,
                    }}
                  >
                    <div
                      className="w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center overflow-hidden shadow-lg bg-transparent backdrop-blur-sm p-1.5 sm:p-2"
                      style={{
                        border: `2px solid ${service.color}60`,
                        boxShadow: `0 0 20px ${service.color}30`,
                      }}
                    >
                      <Image
                        src={service.logo}
                        alt={service.name}
                        width={40}
                        height={40}
                        className="object-contain brightness-0 invert w-auto h-auto max-w-full max-h-full"
                      />
                    </div>
                    {/* Tooltip */}
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden sm:block">
                      <span className="bg-popover border border-border rounded-lg px-3 py-1.5 text-xs">
                        {service.name} - {service.price}/mes
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Connector lines drawn from center */}
              {(() => {
                const svgSize = orbitalRadius * 2 + 80;
                const center = svgSize / 2;
                return (
                  <svg
                    className="absolute pointer-events-none"
                    width={svgSize}
                    height={svgSize}
                    style={{
                      opacity: 0.25,
                      top: "50%",
                      left: "50%",
                      transform: `translate(-50%, -50%)`,
                    }}
                  >
                    {services.map((service, index) => {
                      const angle = (index * 360) / services.length;
                      const endX = center + Math.cos((angle * Math.PI) / 180) * orbitalRadius;
                      const endY = center + Math.sin((angle * Math.PI) / 180) * orbitalRadius;
                      return (
                        <line
                          key={service.name}
                          x1={center}
                          y1={center}
                          x2={endX}
                          y2={endY}
                          stroke={service.color}
                          strokeWidth="1"
                          strokeDasharray="4,8"
                        />
                      );
                    })}
                  </svg>
                );
              })()}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
        <span className="font-mono text-[10px] tracking-widest text-muted-foreground">
          SCROLL
        </span>
        <div className="w-px h-10 bg-gradient-to-b from-primary/60 to-transparent animate-float" />
      </div>
    </section>
  );
}
