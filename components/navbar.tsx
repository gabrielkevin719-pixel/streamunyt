"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "#planos", label: "Planos" },
  { href: "#como-funciona", label: "Como Funciona" },
  { href: "#calculadora", label: "Calculadora" },
  { href: "#faq", label: "FAQ" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/85 backdrop-blur-xl border-b border-border/60"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-[#0D1425] to-[#0D1425] rounded-xl border border-[#1C2A44] flex items-center justify-center shadow-lg">
            <svg width="20" height="22" viewBox="0 0 120 160" fill="none">
              <path d="M 90,10 C 115,10 20,55 50,65 L 80,72 L 50,80 C 20,88 115,130 90,140" stroke="url(#navGrad)" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <defs>
                <linearGradient id="navGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#A855F7"/>
                  <stop offset="100%" stopColor="#3B82F6"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="font-display text-xl tracking-wider italic">
            STREAM<span className="bg-gradient-to-r from-[#A855F7] to-[#6366F1] bg-clip-text text-transparent">IX</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center">
          <Link
            href="#planos"
            className="bg-gradient-to-r from-[#A855F7] to-[#6366F1] text-white font-bold text-sm px-5 py-2 rounded-xl shadow-lg shadow-[#A855F7]/30 hover:shadow-[#A855F7]/50 hover:-translate-y-0.5 transition-all"
          >
            Inscrever-se
          </Link>
        </div>

        <button
          className="md:hidden text-foreground"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border">
          <div className="px-6 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-border">
              <Link
                href="#planos"
                className="block text-center bg-gradient-to-r from-[#A855F7] to-[#6366F1] text-white font-bold text-sm px-5 py-3 rounded-xl"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Ver Planos e Preco
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
