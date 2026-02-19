"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Menu, X, Mail, Phone, MapPin, Download, Send } from "lucide-react";
import { personalInfo, skills, socials, navLinks } from "@/data/data";

function go(href: string) {
  document
    .getElementById(href.replace("#", ""))
    ?.scrollIntoView({ behavior: "smooth" });
}

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        }),
      { rootMargin: "-40% 0px -55% 0px" },
    );
    navLinks.forEach(({ href }) => {
      const el = document.getElementById(href.replace("#", ""));
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        borderBottom: scrolled ? "1px solid #21262d" : "1px solid transparent",
        background: scrolled ? "rgba(10,10,15,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        transition: "all 0.2s",
      }}
    >
      <nav className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* logo */}
        <button
          onClick={() => go("#home")}
          style={{
            color: "#00d4ff",
            fontFamily: "inherit",
            fontSize: 15,
            fontWeight: 700,
          }}
        >
          ~/{personalInfo.full_name.split(" ")[0].toLowerCase()}
          <span style={{ color: "#8b949e" }}>$</span>
        </button>

        {/* desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(({ label, href }) => {
            const isActive = active === href.replace("#", "");
            return (
              <button
                key={label}
                onClick={() => go(href)}
                style={{
                  padding: "6px 14px",
                  borderRadius: 6,
                  fontSize: 14,
                  color: isActive ? "#00d4ff" : "#c9d1d9",
                  background: isActive ? "#00d4ff11" : "transparent",
                  border: isActive
                    ? "1px solid #00d4ff44"
                    : "1px solid transparent",
                  fontFamily: "inherit",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {isActive && <span style={{ color: "#00d4ff" }}>› </span>}
                {label}
              </button>
            );
          })}
        </div>

        {/* mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          style={{
            color: "#c9d1d9",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 6,
          }}
          className="md:hidden"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {open && (
        <div
          style={{ background: "#0a0a0f", borderTop: "1px solid #21262d" }}
          className="md:hidden px-6 py-3 space-y-1"
        >
          {navLinks.map(({ label, href }) => (
            <button
              key={label}
              onClick={() => {
                go(href);
                setOpen(false);
              }}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "10px 16px",
                borderRadius: 6,
                fontSize: 14,
                color: "#c9d1d9",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              <span style={{ color: "#00d4ff88" }}>$ </span>
              {label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}

function SkillBar({ name, level }: { name: string; level: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVisible(true);
      },
      { threshold: 0.4 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <span style={{ fontSize: 14, color: "#c9d1d9" }}>{name}</span>
        <span
          style={{
            fontSize: 14,
            color: "#00d4ff",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {level}%
        </span>
      </div>
      <div
        style={{
          height: 4,
          background: "#21262d",
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            borderRadius: 4,
            background: "linear-gradient(90deg, #00d4ff, #0088ff)",
            boxShadow: "0 0 10px #00d4ff55",
            width: visible ? `${level}%` : "0%",
            transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)",
          }}
        />
      </div>
    </div>
  );
}

function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [submitting, setSub] = useState(false);
  const [sent, setSent] = useState(false);

  const validate = () => {
    const e: Partial<typeof form> = {};
    if (!form.name.trim()) e.name = "required";
    if (!form.email.trim()) e.email = "required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "invalid email";
    if (!form.subject.trim()) e.subject = "required";
    if (!form.message.trim()) e.message = "required";
    return e;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setSub(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSub(false);
    setSent(true);
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  const baseInput: React.CSSProperties = {
    width: "100%",
    padding: "11px 14px",
    background: "#0d1117",
    borderRadius: 6,
    color: "#f0f6fc",
    fontSize: 14,
    fontFamily: "inherit",
    outline: "none",
    transition: "border-color 0.15s",
  };

  const inputStyle = (err?: string): React.CSSProperties => ({
    ...baseInput,
    border: `1px solid ${err ? "#f85149" : "#21262d"}`,
  });

  if (sent)
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "60px 0",
          textAlign: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: "#00ff8811",
            border: "1px solid #00ff8866",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Send size={20} color="#00ff88" />
        </div>
        <p style={{ fontSize: 15, color: "#f0f6fc" }}>message sent</p>
        <p style={{ fontSize: 14, color: "#8b949e" }}>
          i&apos;ll get back to you soon
        </p>
        <button
          onClick={() => setSent(false)}
          style={{
            fontSize: 13,
            color: "#00d4ff",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "inherit",
            marginTop: 4,
          }}
        >
          send another
        </button>
      </div>
    );

  return (
    <form
      onSubmit={onSubmit}
      style={{ display: "flex", flexDirection: "column", gap: 16 }}
    >
      {(
        [
          { key: "name", label: "name", type: "text" },
          { key: "email", label: "email", type: "email" },
          { key: "subject", label: "subject", type: "text" },
        ] as const
      ).map(({ key, label, type }) => (
        <div key={key}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 6,
            }}
          >
            <span style={{ fontSize: 13, color: "#00d4ff88" }}>$</span>
            <span style={{ fontSize: 13, color: "#8b949e" }}>{label}</span>
            {errors[key] && (
              <span style={{ fontSize: 13, color: "#f85149" }}>
                — {errors[key]}
              </span>
            )}
          </div>
          <input
            type={type}
            value={form[key]}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            style={inputStyle(errors[key])}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = errors[key]
                ? "#f85149"
                : "#00d4ff66";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = errors[key]
                ? "#f85149"
                : "#21262d";
            }}
          />
        </div>
      ))}
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 6,
          }}
        >
          <span style={{ fontSize: 13, color: "#00d4ff88" }}>$</span>
          <span style={{ fontSize: 13, color: "#8b949e" }}>message</span>
          {errors.message && (
            <span style={{ fontSize: 13, color: "#f85149" }}>
              — {errors.message}
            </span>
          )}
        </div>
        <textarea
          rows={5}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          style={{ ...inputStyle(errors.message), resize: "none" }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = errors.message
              ? "#f85149"
              : "#00d4ff66";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = errors.message
              ? "#f85149"
              : "#21262d";
          }}
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          padding: "11px 0",
          borderRadius: 6,
          fontSize: 14,
          fontWeight: 500,
          fontFamily: "inherit",
          background: "#00d4ff15",
          border: "1px solid #00d4ff66",
          color: "#00d4ff",
          cursor: submitting ? "not-allowed" : "pointer",
          opacity: submitting ? 0.6 : 1,
          transition: "background 0.15s",
        }}
        onMouseEnter={(e) => {
          if (!submitting) e.currentTarget.style.background = "#00d4ff22";
        }}
        onMouseLeave={(e) => {
          if (!submitting) e.currentTarget.style.background = "#00d4ff15";
        }}
      >
        {submitting ? "sending..." : "> send_message()"}
        <Send size={15} />
      </button>
    </form>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <div
      style={{ minHeight: "100vh", background: "#0a0a0f", color: "#c9d1d9" }}
    >
      <Navbar />

      {/* ── HERO ── */}
      <section
        id="home"
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          paddingTop: 64,
        }}
      >
        <div
          className="max-w-4xl mx-auto px-6 w-full"
          style={{ paddingTop: 80, paddingBottom: 80 }}
        >
          <div
            className="flex flex-col md:flex-row md:items-center"
            style={{ gap: 48 }}
          >
            {/* avatar */}
            <div style={{ flexShrink: 0, margin: "0 auto" }} className="md:m-0">
              <div
                style={{
                  width: 140,
                  height: 140,
                  borderRadius: 14,
                  border: "1px solid #00d4ff44",
                  boxShadow: "0 0 32px #00d4ff11",
                  overflow: "hidden",
                  background: "#0d1117",
                }}
              >
                {personalInfo.profile_picture ? (
                  <Image
                    src={personalInfo.profile_picture}
                    alt={`${personalInfo.full_name} photo`}
                    width={140}
                    height={140}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    priority
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 36,
                        fontWeight: 700,
                        color: "#00d4ff",
                      }}
                    >
                      {personalInfo.full_name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* text */}
            <div className="text-center md:text-left" style={{ flex: 1 }}>
              {/* shell prompt */}
              <p
                style={{
                  fontSize: 13,
                  color: "#8b949e",
                  marginBottom: 16,
                  fontFamily: "inherit",
                }}
              >
                <span style={{ color: "#00d4ff" }}>nabaraj</span>
                <span style={{ color: "#8b949e" }}>@portfolio</span>
                <span style={{ color: "#6e7681" }}>:~$</span>
                <span style={{ color: "#c9d1d9" }}> whoami</span>
              </p>

              <h1
                style={{
                  fontSize: "clamp(28px, 5vw, 40px)",
                  fontWeight: 700,
                  color: "#f0f6fc",
                  letterSpacing: "-0.5px",
                  marginBottom: 6,
                  lineHeight: 1.2,
                }}
              >
                {personalInfo.full_name}
              </h1>
              <p
                style={{
                  fontSize: 17,
                  fontWeight: 500,
                  color: "#00d4ff",
                  marginBottom: 16,
                }}
              >
                {personalInfo.title}
              </p>
              <p
                style={{
                  fontSize: 15,
                  color: "#c9d1d9",
                  lineHeight: 1.7,
                  maxWidth: 460,
                  marginBottom: 8,
                }}
              >
                <span style={{ color: "#00d4ff66" }}># </span>
                {personalInfo.description}
              </p>

              {/* status dot */}
              <p
                style={{
                  fontSize: 13,
                  color: "#8b949e",
                  marginBottom: 28,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  justifyContent: "center",
                }}
                className="md:justify-start"
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "#3fb950",
                    boxShadow: "0 0 8px #3fb950",
                    display: "inline-block",
                  }}
                />
                available for opportunities
              </p>

              {/* action buttons */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 12,
                  marginBottom: 28,
                  justifyContent: "center",
                }}
                className="md:justify-start"
              >
                <button
                  onClick={() => go("#contact")}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 20px",
                    borderRadius: 6,
                    fontSize: 14,
                    background: "#00d4ff15",
                    border: "1px solid #00d4ff66",
                    color: "#00d4ff",
                    fontFamily: "inherit",
                    cursor: "pointer",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#00d4ff25")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "#00d4ff15")
                  }
                >
                  <Mail size={15} /> contact()
                </button>
                <a
                  href={personalInfo.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 20px",
                    borderRadius: 6,
                    fontSize: 14,
                    background: "#0d1117",
                    border: "1px solid #21262d",
                    color: "#c9d1d9",
                    fontFamily: "inherit",
                    textDecoration: "none",
                    transition: "border-color 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor = "#30363d")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.borderColor = "#21262d")
                  }
                >
                  <Download size={15} /> resume.pdf
                </a>
              </div>

              {/* socials */}
              <div
                style={{ display: "flex", gap: 20, justifyContent: "center" }}
                className="md:justify-start"
              >
                {socials.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    title={label}
                    style={{ color: "#6e7681", transition: "color 0.15s" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#00d4ff")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "#6e7681")
                    }
                  >
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section
        id="skills"
        style={{ padding: "80px 0", borderTop: "1px solid #21262d" }}
      >
        <div className="max-w-4xl mx-auto px-6">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 6,
            }}
          >
            <span style={{ fontSize: 14, color: "#00d4ff88" }}>$</span>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: "#f0f6fc" }}>
              skills
            </h2>
          </div>
          <p
            style={{
              fontSize: 14,
              color: "#8b949e",
              marginBottom: 40,
              marginLeft: 24,
            }}
          >
            # technologies i work with regularly
          </p>
          <div
            className="grid grid-cols-1 sm:grid-cols-2"
            style={{ gap: "28px 64px" }}
          >
            {skills.map((s) => (
              <SkillBar key={s.name} {...s} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section
        id="contact"
        style={{ padding: "80px 0", borderTop: "1px solid #21262d" }}
      >
        <div className="max-w-4xl mx-auto px-6">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 6,
            }}
          >
            <span style={{ fontSize: 14, color: "#00d4ff88" }}>$</span>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: "#f0f6fc" }}>
              contact
            </h2>
          </div>
          <p
            style={{
              fontSize: 14,
              color: "#8b949e",
              marginBottom: 48,
              marginLeft: 24,
            }}
          >
            # open to new opportunities and collaborations
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-5" style={{ gap: 48 }}>
            {/* form */}
            <div className="lg:col-span-3">
              <ContactForm />
            </div>

            {/* info sidebar */}
            <div
              className="lg:col-span-2"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 28,
                fontSize: 14,
              }}
            >
              {/* contact details */}
              <div
                style={{ display: "flex", flexDirection: "column", gap: 20 }}
              >
                {[
                  { icon: Mail, label: "email", value: personalInfo.email },
                  { icon: Phone, label: "phone", value: personalInfo.phone },
                  {
                    icon: MapPin,
                    label: "location",
                    value: personalInfo.location,
                  },
                ].map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    style={{
                      display: "flex",
                      gap: 12,
                      alignItems: "flex-start",
                    }}
                  >
                    <Icon
                      size={16}
                      style={{ color: "#00d4ff", marginTop: 2, flexShrink: 0 }}
                    />
                    <div>
                      <p
                        style={{
                          fontSize: 12,
                          color: "#8b949e",
                          marginBottom: 3,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}
                      >
                        {label}
                      </p>
                      <p style={{ color: "#c9d1d9" }}>{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: "1px solid #21262d" }} />

              {/* open to */}
              <div>
                <p
                  style={{
                    fontSize: 12,
                    color: "#8b949e",
                    marginBottom: 12,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  open to
                </p>
                <ul
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  {[
                    "full-stack development",
                    "open source contributions",
                    "technical writing",
                    "research & academic projects",
                  ].map((item) => (
                    <li
                      key={item}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        color: "#c9d1d9",
                        fontSize: 13,
                      }}
                    >
                      <span style={{ color: "#00d4ff", fontSize: 16 }}>›</span>{" "}
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ borderTop: "1px solid #21262d" }} />

              {/* socials */}
              <div>
                <p
                  style={{
                    fontSize: 12,
                    color: "#8b949e",
                    marginBottom: 12,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  find me on
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {socials.map(({ icon: Icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "7px 14px",
                        borderRadius: 6,
                        fontSize: 13,
                        background: "#0d1117",
                        border: "1px solid #21262d",
                        color: "#c9d1d9",
                        fontFamily: "inherit",
                        textDecoration: "none",
                        transition: "all 0.15s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#00d4ff66";
                        e.currentTarget.style.color = "#00d4ff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "#21262d";
                        e.currentTarget.style.color = "#c9d1d9";
                      }}
                    >
                      <Icon size={14} /> {label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: "1px solid #21262d", padding: "20px 0" }}>
        <div
          className="max-w-4xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between"
          style={{ gap: 12 }}
        >
          <span style={{ fontSize: 14, fontWeight: 700, color: "#00d4ff" }}>
            ~/{personalInfo.full_name.split(" ")[0].toLowerCase()}
            <span style={{ color: "#6e7681" }}>$</span>
          </span>
          <p style={{ fontSize: 13, color: "#8b949e" }}>
            © {new Date().getFullYear()} {personalInfo.full_name}
          </p>
          <div style={{ display: "flex", gap: 20 }}>
            {socials.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                style={{ color: "#6e7681", transition: "color 0.15s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#00d4ff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#6e7681")}
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
