/* Obra Assinada · links + scroll scene (GSAP ScrollTrigger + Lenis, same stack as Orbi) */
(() => {
  const cfg = window.OA || {};
  const wa = (text) => `https://wa.me/${cfg.whatsapp}?text=${encodeURIComponent(text)}`;

  document.querySelectorAll("[data-wa]").forEach((a) => {
    a.href = wa(a.dataset.wa);
    a.target = "_blank";
    a.rel = "noopener";
  });
  document.querySelectorAll("[data-plano]").forEach((a) => {
    const url = (cfg.planos || {})[a.dataset.plano];
    a.href = url || wa(`Oi! Quero assinar o plano ${a.dataset.plano === "regiao" ? "Região" : "Essencial"}.`);
    a.target = "_blank";
    a.rel = "noopener";
  });

  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fmt = (n, dec) => n.toLocaleString("pt-BR", { minimumFractionDigits: dec, maximumFractionDigits: dec });

  // counters
  const counters = document.querySelectorAll("[data-conta]");
  const showFinal = (el) => {
    const v = parseFloat(el.dataset.conta), dec = (el.dataset.conta.split(".")[1] || "").length;
    el.textContent = (el.dataset.prefixo || "") + fmt(v, dec) + (el.dataset.sufixo || "");
  };
  if (reduce || !window.gsap) { counters.forEach(showFinal); return; }

  gsap.registerPlugin(ScrollTrigger);
  if (window.Lenis) {
    const lenis = new Lenis({ lerp: 0.12 });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  // hero entrance
  gsap.from(".hero__titulo .linha", { yPercent: 60, opacity: 0, duration: 1, ease: "power3.out", stagger: 0.12 });
  gsap.from(".hero__sub, .hero__acoes, .hero__rolar", { y: 20, opacity: 0, duration: 0.9, delay: 0.45, stagger: 0.1 });

  // scene: lines get written, stamp hits, document turns into the WhatsApp list
  const tl = gsap.timeline({ scrollTrigger: { trigger: "#cena", start: "top top", end: "bottom bottom", scrub: 0.6 } });
  tl.fromTo(".doc", { y: 80, rotate: -4, scale: 0.9 }, { y: 0, rotate: -1.5, scale: 1, duration: 1 })
    .fromTo(".doc__linhas i", { "--l": 0 }, { "--l": 1, stagger: 0.12, duration: 0.5 }, "<0.2")
    .to('[data-passo="0"]', { opacity: 1, y: 0, duration: 0.5 }, "<")
    .to(".carimbo", { opacity: 0.92, scale: 1, duration: 0.35, ease: "back.out(2)" }, "+=0.3")
    .to(".doc", { x: 6, duration: 0.05, yoyo: true, repeat: 3 }, "<0.3")
    .to('[data-passo="0"]', { opacity: 0, y: -20, duration: 0.4 }, "+=0.2")
    .to('[data-passo="1"]', { opacity: 1, y: 0, duration: 0.5 })
    .to(".doc", { scale: 0.35, y: -120, rotate: 8, opacity: 0, duration: 1 }, "+=0.4")
    .to('[data-passo="1"]', { opacity: 0, y: -20, duration: 0.4 }, "<0.3")
    .to(".zap", { opacity: 1, y: 0, scale: 1, duration: 0.8 }, "<0.3")
    .to('[data-passo="2"]', { opacity: 1, y: 0, duration: 0.5 }, "<")
    .to(".zap__lista li", { opacity: 1, x: 0, stagger: 0.25, duration: 0.4 })
    .to({}, { duration: 0.6 });

  // reveal sections
  gsap.utils.toArray(".secao__titulo, .passos li, .tabela, .cartao, .faq details, .fim__titulo").forEach((el) =>
    gsap.from(el, { y: 40, opacity: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%" } }));

  counters.forEach((el) => {
    const v = parseFloat(el.dataset.conta), dec = (el.dataset.conta.split(".")[1] || "").length, o = { n: 0 };
    ScrollTrigger.create({
      trigger: el, start: "top 85%", once: true,
      onEnter: () => gsap.to(o, { n: v, duration: 1.4, ease: "power2.out",
        onUpdate: () => (el.textContent = (el.dataset.prefixo || "") + fmt(o.n, dec) + (el.dataset.sufixo || "")) }),
    });
  });
})();
