"use client"

import { useEffect, useRef, useState } from "react"

const SERVICES = [
  { name: "Netflix", color: "#E50914", r: 0.27, speed: 0.5, angle: 0.0, size: 0.055, price: "R$29,90" },
  { name: "Spotify", color: "#1DB954", r: 0.36, speed: 0.35, angle: 1.0, size: 0.052, price: "R$21,90" },
  { name: "Disney+", color: "#5B4FE8", r: 0.44, speed: 0.28, angle: 2.1, size: 0.054, price: "R$27,90" },
  { name: "HBO Max", color: "#A855F7", r: 0.52, speed: 0.21, angle: 3.7, size: 0.068, price: "R$34,90" },
  { name: "TNT Sports", color: "#FF00CC", r: 0.4, speed: 0.4, angle: 4.5, size: 0.064, price: "R$29,90" },
  { name: "Amazon Prime", color: "#00A8E0", r: 0.48, speed: 0.23, angle: 5.2, size: 0.072, price: "R$19,90" },
  { name: "YouTube Premium", color: "#FF0000", r: 0.31, speed: 0.46, angle: 3.1, size: 0.055, price: "R$20,90" },
]

function OrbitalCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const timeRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animId: number

    function resize() {
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resize()
    window.addEventListener("resize", resize)

    function draw() {
      if (!canvas || !ctx) return
      const W = canvas.width
      const H = canvas.height
      const cx = W * 0.65
      const cy = H * 0.5
      const base = Math.min(W, H)

      ctx.clearRect(0, 0, W, H)
      timeRef.current += 0.012

      // Draw orbital rings
      SERVICES.forEach((s) => {
        const orbitR = base * s.r * 0.5
        ctx.save()
        ctx.beginPath()
        ctx.ellipse(cx, cy, orbitR, orbitR * 0.72, 0, 0, Math.PI * 2)
        ctx.strokeStyle = "rgba(255,255,255,0.035)"
        ctx.lineWidth = 1
        ctx.stroke()
        ctx.restore()
      })

      // Draw connectors
      SERVICES.forEach((s) => {
        const orbitR = base * s.r * 0.5
        const angle = s.angle + timeRef.current * s.speed * 0.6
        const lx = cx + Math.cos(angle) * orbitR
        const ly = cy + Math.sin(angle) * orbitR * 0.72
        const hubR = base * 0.065
        const dx = lx - cx
        const dy = ly - cy
        const dist = Math.sqrt(dx * dx + dy * dy)
        const startX = cx + (dx / dist) * hubR
        const startY = cy + (dy / dist) * hubR

        const g = ctx.createLinearGradient(startX, startY, lx, ly)
        g.addColorStop(0, s.color + "60")
        g.addColorStop(0.6, s.color + "25")
        g.addColorStop(1, s.color + "00")
        ctx.save()
        ctx.beginPath()
        ctx.moveTo(startX, startY)
        ctx.lineTo(lx, ly)
        ctx.strokeStyle = g
        ctx.lineWidth = 1.5
        ctx.setLineDash([5, 10])
        ctx.lineDashOffset = -timeRef.current * 30
        ctx.stroke()
        ctx.restore()
      })

      // Draw hub
      const hubR = base * 0.065
      const pulse = 1 + 0.04 * Math.sin(timeRef.current * 2)
      ;[2.8, 2.1, 1.5].forEach((m, i) => {
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, hubR * m * pulse)
        g.addColorStop(0, `rgba(249,115,22,${0.06 - i * 0.015})`)
        g.addColorStop(1, "rgba(249,115,22,0)")
        ctx.beginPath()
        ctx.arc(cx, cy, hubR * m * pulse, 0, Math.PI * 2)
        ctx.fillStyle = g
        ctx.fill()
      })

      const hubGrad = ctx.createRadialGradient(cx - hubR * 0.3, cy - hubR * 0.3, 0, cx, cy, hubR)
      hubGrad.addColorStop(0, "#FBBF24")
      hubGrad.addColorStop(0.5, "#F97316")
      hubGrad.addColorStop(1, "#EA580C")
      ctx.beginPath()
      ctx.arc(cx, cy, hubR * pulse, 0, Math.PI * 2)
      ctx.fillStyle = hubGrad
      ctx.fill()

      ctx.beginPath()
      ctx.arc(cx, cy, hubR * pulse, 0, Math.PI * 2)
      ctx.strokeStyle = "rgba(251,191,36,0.5)"
      ctx.lineWidth = 2
      ctx.stroke()

      ctx.save()
      ctx.font = `bold ${hubR * 1.3}px 'Bebas Neue', sans-serif`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillStyle = "#030712"
      ctx.fillText("S", cx, cy + 2)
      ctx.restore()

      // Draw service nodes
      SERVICES.forEach((s) => {
        const orbitR = base * s.r * 0.5
        const angle = s.angle + timeRef.current * s.speed * 0.6
        const x = cx + Math.cos(angle) * orbitR
        const y = cy + Math.sin(angle) * orbitR * 0.72
        const R = base * s.size * 0.5

        // Glow
        const glow = ctx.createRadialGradient(x, y, 0, x, y, R * 1.8)
        glow.addColorStop(0, s.color + "28")
        glow.addColorStop(1, s.color + "00")
        ctx.beginPath()
        ctx.arc(x, y, R * 1.8, 0, Math.PI * 2)
        ctx.fillStyle = glow
        ctx.fill()

        // Dark disc
        ctx.beginPath()
        ctx.arc(x, y, R * 0.85, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(10,14,20,0.88)"
        ctx.fill()

        // Ring
        ctx.beginPath()
        ctx.arc(x, y, R * 0.85, 0, Math.PI * 2)
        ctx.strokeStyle = s.color + "55"
        ctx.lineWidth = 1.5
        ctx.stroke()

        // Name text
        ctx.save()
        ctx.font = `bold ${Math.max(9, R * 0.5)}px 'DM Sans', sans-serif`
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillStyle = s.color
        const words = s.name.split(" ")
        if (words.length > 1 && R > 15) {
          ctx.fillText(words[0], x, y - R * 0.15)
          ctx.font = `${Math.max(7, R * 0.35)}px 'DM Sans', sans-serif`
          ctx.fillText(words.slice(1).join(" "), x, y + R * 0.25)
        } else {
          ctx.fillText(s.name, x, y)
        }
        ctx.restore()
      })

      animId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  )
}

function AnimatedCounter({ target, prefix = "", duration = 1200 }: { target: number; prefix?: string; duration?: number }) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const start = performance.now()
          function step(now: number) {
            const t = Math.min((now - start) / duration, 1)
            const ease = 1 - Math.pow(1 - t, 3)
            setValue(Math.round(target * ease))
            if (t < 1) requestAnimationFrame(step)
          }
          requestAnimationFrame(step)
          observer.disconnect()
        }
      },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target, duration])

  return (
    <div ref={ref}>
      {prefix}{value}
    </div>
  )
}

export default function Hero() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 300)
    return () => clearTimeout(timer)
  }, [])

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden bg-void">
      <OrbitalCanvas />

      {/* Background glow orbs */}
      <div className="absolute w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,rgba(249,115,22,0.07)_0%,transparent_70%)] -top-[200px] -left-[100px] pointer-events-none" />
      <div className="absolute w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.05)_0%,transparent_70%)] bottom-0 right-0 pointer-events-none" />

      {/* Content */}
      <div
        className="relative z-10 max-w-7xl mx-auto px-6 pt-[120px] pb-20 w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
      >
        {/* Left: text */}
        <div
          className={`transition-all duration-700 ease-out ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Live badge */}
          <div className="inline-flex items-center gap-2 bg-[rgba(249,115,22,0.08)] border border-[rgba(249,115,22,0.2)] rounded-full px-4 py-1.5 mb-8">
            <span className="w-[7px] h-[7px] rounded-full bg-mint shadow-[0_0_8px_#34D399] inline-block animate-[blink_2s_infinite]" />
            <span className="font-mono text-[11px] text-spark tracking-[2px] uppercase">
              O Fim da Bagunca das Assinaturas
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display leading-[0.9] tracking-tight text-[clamp(58px,7.5vw,120px)] mb-7">
            <span className="block text-foreground">TUDO QUE</span>
            <span className="block shimmer-text">{"VOCE USA"}</span>
            <span className="block text-foreground">EM UM SO LUGAR.</span>
          </h1>

          {/* Sub */}
          <p
            className={`text-[17px] text-muted leading-relaxed max-w-[480px] mb-9 font-light transition-opacity duration-700 delay-1000 ${
              visible ? "opacity-100" : "opacity-0"
            }`}
          >
            StreamUnity agrega{" "}
            <strong className="text-foreground">
              Netflix, Spotify, Disney+, HBO Max, TNT Sports, Amazon Prime
            </strong>{" "}
            e{" "}
            <strong className="text-foreground">YouTube Premium</strong> em um
            unico plano mensal. Economize ate{" "}
            <strong className="text-spark">R$127/mes</strong>.
          </p>

          {/* CTAs */}
          <div
            className={`flex flex-wrap gap-3 mb-12 transition-opacity duration-700 delay-[1200ms] ${
              visible ? "opacity-100" : "opacity-0"
            }`}
          >
            <button
              onClick={() => scrollToSection("planos")}
              className="btn-primary text-[15px] py-3.5 px-8"
            >
              {"Ver Planos e Precos ->"}
            </button>
            <button
              onClick={() => scrollToSection("calculadora")}
              className="btn-ice text-[15px] py-3.5 px-8"
            >
              Calcular Economia
            </button>
          </div>

          {/* Stats */}
          <div
            className={`grid grid-cols-3 gap-px bg-[rgba(33,38,45,0.6)] rounded-2xl overflow-hidden border border-[rgba(33,38,45,0.8)] transition-opacity duration-700 delay-[1400ms] ${
              visible ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="bg-surface p-5 text-center">
              <div className="font-display text-4xl text-spark">
                <AnimatedCounter target={127} prefix="R$" />
              </div>
              <div className="font-mono text-[10px] text-muted tracking-[1px] mt-1">
                ECONOMIA/MES
              </div>
            </div>
            <div className="bg-surface p-5 text-center">
              <div className="font-display text-4xl text-ice">
                <AnimatedCounter target={7} />
              </div>
              <div className="font-mono text-[10px] text-muted tracking-[1px] mt-1">
                PLATAFORMAS
              </div>
            </div>
            <div className="bg-surface p-5 text-center">
              <div className="font-display text-4xl text-mint">1</div>
              <div className="font-mono text-[10px] text-muted tracking-[1px] mt-1">
                {"COBRANCA/MES"}
              </div>
            </div>
          </div>
        </div>

        {/* Right: orbital space (canvas renders here visually) */}
        <div className="h-[560px] relative hidden md:block" />
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
        <span className="font-mono text-[10px] tracking-[2px] text-muted">
          SCROLL
        </span>
        <div className="w-px h-10 bg-gradient-to-b from-[rgba(249,115,22,0.6)] to-transparent animate-[float_2s_ease_infinite]" />
      </div>
    </section>
  )
}
