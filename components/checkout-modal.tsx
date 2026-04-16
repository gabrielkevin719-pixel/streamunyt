"use client";

import { useState, useEffect } from "react";
import { X, Loader2, Copy, Check, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  planId: string | null;
}

const planDetails: Record<
  string,
  { name: string; price: number; description: string }
> = {
  basico: { name: "Basico Essencial", price: 69, description: "3 servicos" },
  premium: { name: "Premium Total", price: 109, description: "5 servicos" },
  ultra: { name: "Ultra Maximo", price: 149, description: "7 servicos" },
};

type Step = "form" | "loading" | "pix";

// CPF mask
function formatCPF(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

// Phone mask
function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function CheckoutModal({ isOpen, onClose, planId }: CheckoutModalProps) {
  const [step, setStep] = useState<Step>("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string; cpf?: string; phone?: string }>({});
  const [pixData, setPixData] = useState<{
    brCode: string;
    qrCodeImage: string;
    correlationID: string;
    expiresAt: string;
    demo?: boolean;
    message?: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState(3600);
  const [paymentStatus, setPaymentStatus] = useState<"waiting" | "paid">(
    "waiting"
  );

  const plan = planId ? planDetails[planId] : null;

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep("form");
        setName("");
        setEmail("");
        setCpf("");
        setPhone("");
        setErrors({});
        setPixData(null);
        setCopied(false);
        setCountdown(3600);
        setPaymentStatus("waiting");
      }, 300);
    }
  }, [isOpen]);

  // Countdown timer
  useEffect(() => {
    if (step === "pix" && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step, countdown]);

  // Poll for payment status
  useEffect(() => {
    if (step === "pix" && pixData?.correlationID && !pixData.demo) {
      const pollStatus = async () => {
        try {
          const res = await fetch(
            `/api/payment/status/${pixData.correlationID}`
          );
          const data = await res.json();
          if (data.status === "COMPLETED" || data.status === "PAID") {
            setPaymentStatus("paid");
          }
        } catch {
          // Ignore errors
        }
      };

      const interval = setInterval(pollStatus, 5000);
      return () => clearInterval(interval);
    }
  }, [step, pixData]);

  const validateForm = () => {
    const newErrors: { name?: string; email?: string; cpf?: string; phone?: string } = {};
    
    if (!name.trim()) newErrors.name = "Nome e obrigatorio";
    
    if (!email.trim()) newErrors.email = "E-mail e obrigatorio";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "E-mail invalido";
    
    const cpfDigits = cpf.replace(/\D/g, "");
    if (!cpfDigits) newErrors.cpf = "CPF e obrigatorio";
    else if (cpfDigits.length !== 11) newErrors.cpf = "CPF deve ter 11 digitos";
    
    const phoneDigits = phone.replace(/\D/g, "");
    if (!phoneDigits) newErrors.phone = "Telefone e obrigatorio";
    else if (phoneDigits.length < 10 || phoneDigits.length > 11) newErrors.phone = "Telefone invalido";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !planId) return;

    setStep("loading");

    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name, 
          email, 
          cpf: cpf.replace(/\D/g, ""),
          phone: phone.replace(/\D/g, ""),
          plano: planId 
        }),
      });
      const data = await res.json();

      if (data.success) {
        setPixData({
          brCode: data.brCode,
          qrCodeImage: data.qrCodeImage,
          correlationID: data.correlationID,
          expiresAt: data.expiresAt,
          demo: data.demo,
          message: data.message,
        });
        setStep("pix");
      } else {
        alert(data.error || "Erro ao gerar cobranca");
        setStep("form");
      }
    } catch {
      alert("Erro de conexao");
      setStep("form");
    }
  };

  const copyToClipboard = () => {
    if (pixData?.brCode) {
      navigator.clipboard.writeText(pixData.brCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-background/92 backdrop-blur-xl flex items-center justify-center p-6">
      <div className="bg-card border border-border rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={20} />
        </button>

        {/* Step: Form */}
        {step === "form" && plan && (
          <div className="p-8">
            <h3 className="font-display text-2xl mb-2">Finalizar Assinatura</h3>
            <p className="text-muted-foreground text-sm mb-6">
              Preencha seus dados para gerar o PIX
            </p>

            {/* Plan summary */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6 flex items-center justify-between">
              <div>
                <p className="font-semibold">{plan.name}</p>
                <p className="text-sm text-muted-foreground">
                  {plan.description}
                </p>
              </div>
              <p className="font-display text-2xl text-primary">
                R${plan.price}
              </p>
            </div>

            {/* Form */}
            <div className="space-y-4">
              <div>
                <label className="font-mono text-xs text-muted-foreground tracking-wider block mb-2">
                  NOME COMPLETO
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={cn(
                    "w-full bg-secondary border rounded-xl px-4 py-3 text-foreground outline-none transition-all",
                    errors.name
                      ? "border-destructive"
                      : "border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
                  )}
                  placeholder="Seu nome"
                />
                {errors.name && (
                  <p className="text-destructive text-xs mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="font-mono text-xs text-muted-foreground tracking-wider block mb-2">
                  E-MAIL
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={cn(
                    "w-full bg-secondary border rounded-xl px-4 py-3 text-foreground outline-none transition-all",
                    errors.email
                      ? "border-destructive"
                      : "border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
                  )}
                  placeholder="seu@email.com"
                />
                {errors.email && (
                  <p className="text-destructive text-xs mt-1">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="font-mono text-xs text-muted-foreground tracking-wider block mb-2">
                  CPF
                </label>
                <input
                  type="text"
                  value={cpf}
                  onChange={(e) => setCpf(formatCPF(e.target.value))}
                  className={cn(
                    "w-full bg-secondary border rounded-xl px-4 py-3 text-foreground outline-none transition-all",
                    errors.cpf
                      ? "border-destructive"
                      : "border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
                  )}
                  placeholder="000.000.000-00"
                />
                {errors.cpf && (
                  <p className="text-destructive text-xs mt-1">{errors.cpf}</p>
                )}
              </div>

              <div>
                <label className="font-mono text-xs text-muted-foreground tracking-wider block mb-2">
                  TELEFONE
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(formatPhone(e.target.value))}
                  className={cn(
                    "w-full bg-secondary border rounded-xl px-4 py-3 text-foreground outline-none transition-all",
                    errors.phone
                      ? "border-destructive"
                      : "border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
                  )}
                  placeholder="(11) 99999-9999"
                />
                {errors.phone && (
                  <p className="text-destructive text-xs mt-1">{errors.phone}</p>
                )}
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full mt-6 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-bold py-4 rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all"
            >
              Gerar PIX
            </button>

            <p className="text-center text-muted-foreground text-xs mt-4">
              Pagamento seguro via PIX instantaneo
            </p>
          </div>
        )}

        {/* Step: Loading */}
        {step === "loading" && (
          <div className="p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Gerando cobranca PIX...</p>
          </div>
        )}

        {/* Step: PIX */}
        {step === "pix" && pixData && plan && (
          <div className="p-8">
            {paymentStatus === "paid" ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-mint/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-mint" />
                </div>
                <h3 className="font-display text-2xl mb-2">
                  Pagamento Confirmado!
                </h3>
                <p className="text-muted-foreground">
                  Seu acesso sera liberado em instantes.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-sm text-muted-foreground">
                    Aguardando pagamento
                  </span>
                </div>

                <h3 className="font-display text-2xl mb-6">
                  Escaneie o QR Code
                </h3>

                {/* Demo warning */}
                {pixData.demo && (
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3 mb-4">
                    <p className="text-yellow-500 text-xs text-center">
                      {pixData.message || "Modo demonstracao - Configure SYNCPAY_API_KEY para pagamentos reais"}
                    </p>
                  </div>
                )}

                {/* QR Code */}
                <div className="bg-popover rounded-2xl p-6 text-center mb-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={pixData.qrCodeImage}
                    alt="QR Code PIX"
                    className="w-48 h-48 mx-auto rounded-xl"
                  />
                </div>

                {/* Copy code */}
                <div className="bg-card border border-border rounded-xl p-3 mb-3">
                  <p className="font-mono text-xs text-muted-foreground break-all line-clamp-2">
                    {pixData.brCode}
                  </p>
                </div>

                <button
                  onClick={copyToClipboard}
                  className={cn(
                    "w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all",
                    copied
                      ? "bg-mint/10 border border-mint/30 text-mint"
                      : "bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20"
                  )}
                >
                  {copied ? (
                    <>
                      <Check size={16} /> Copiado!
                    </>
                  ) : (
                    <>
                      <Copy size={16} /> Copiar Codigo PIX
                    </>
                  )}
                </button>

                {/* Countdown */}
                <div className="flex items-center justify-center gap-2 mt-4 text-muted-foreground">
                  <Clock size={14} />
                  <span className="font-mono text-sm">
                    Expira em {formatTime(countdown)}
                  </span>
                </div>

                {/* Amount */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">Valor:</p>
                  <p className="font-display text-3xl text-primary">
                    R${plan.price},00
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
