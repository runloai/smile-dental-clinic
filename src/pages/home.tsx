import React, { useEffect, useState } from "react";
import { Phone, MapPin, Clock, CheckCircle2, ChevronRight, Menu, X, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

import beforeAfter2 from "@assets/before-after-1.png";
import beforeAfter3 from "@assets/before-after-2.png";

import heroImage from "@assets/hero-dentist.jpg";
const HERO_IMAGE = heroImage;
import clinicInterior from "@assets/clinic-interior.jpg";
const CLINIC_INTERIOR = clinicInterior;

const TIME_SLOTS = [
  "Morning 10:00 AM – 11:00 AM",
  "Morning 11:00 AM – 12:00 PM",
  "Morning 12:00 PM – 1:30 PM",
  "Evening 4:30 PM – 5:30 PM",
  "Evening 5:30 PM – 6:30 PM",
  "Evening 6:30 PM – 8:00 PM",
];

const WHATSAPP_NUMBER = "919398664723";

function getClinicStatus(): { open: boolean; label: string } {
  const now = new Date();
  // Convert to IST (UTC+5:30)
  const istOffsetMs = 5.5 * 60 * 60 * 1000;
  const ist = new Date(now.getTime() + istOffsetMs - now.getTimezoneOffset() * 60 * 1000);
  const totalMin = ist.getUTCHours() * 60 + ist.getUTCMinutes();

  const morningOpen  = 10 * 60;       // 10:00 AM
  const morningClose = 13 * 60 + 30;  // 1:30 PM
  const eveningOpen  = 16 * 60 + 30;  // 4:30 PM
  const eveningClose = 20 * 60;       // 8:00 PM

  if (totalMin >= morningOpen && totalMin < morningClose) {
    const closeH = Math.floor(morningClose / 60);
    const closeM = morningClose % 60;
    return { open: true, label: `Open · Closes ${closeH}:${closeM === 0 ? "00" : closeM} PM` };
  }
  if (totalMin >= eveningOpen && totalMin < eveningClose) {
    const closeH = Math.floor(eveningClose / 60);
    return { open: true, label: `Open · Closes ${closeH > 12 ? closeH - 12 : closeH}:00 PM` };
  }
  if (totalMin >= morningClose && totalMin < eveningOpen) {
    return { open: false, label: "Closed · Opens 4:30 PM" };
  }
  if (totalMin < morningOpen) {
    return { open: false, label: "Closed · Opens 10:00 AM" };
  }
  return { open: false, label: "Closed · Opens 10:00 AM tomorrow" };
}

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [clinicStatus, setClinicStatus] = useState(getClinicStatus);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    issue: "",
    slot: "",
  });
  const [formError, setFormError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setClinicStatus(getClinicStatus()), 60_000);
    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setFormError("");
  };

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.slot) {
      setFormError("Please fill in your name, phone number, and preferred time slot.");
      return;
    }

    const message = [
      `Hello, I'd like to book an appointment at Gnana Prasoona's Smile Dental Clinic.`,
      ``,
      `Name: ${form.name.trim()}`,
      `Phone: ${form.phone.trim()}`,
      `Preferred Time: ${form.slot}`,
      form.issue.trim() ? `Issue / Concern: ${form.issue.trim()}` : null,
      ``,
      `Please confirm my appointment. Thank you!`,
    ]
      .filter((line) => line !== null)
      .join("\n");

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    setSubmitted(true);
    setTimeout(() => {
      window.open(url, "_blank", "noopener,noreferrer");
    }, 300);
  };

  return (
    <div className="flex flex-col min-h-[100dvh]">
      {/* Floating WhatsApp Button */}
      <a
        href="#"
        onClick={(e) => { e.preventDefault(); scrollToSection("book"); }}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white px-4 py-3 rounded-full shadow-xl transition-all hover:shadow-2xl hover:scale-105 group"
        data-testid="btn-whatsapp-float"
        aria-label="Book via WhatsApp"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 flex-shrink-0">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        <span className="text-sm font-semibold pr-1">Book on WhatsApp</span>
      </a>

      {/* Navigation */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-white/95 backdrop-blur-md shadow-sm py-3" : "bg-white py-5"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <div className="flex flex-col cursor-pointer" onClick={() => scrollToSection("home")} data-testid="link-home-logo">
            <span className="font-serif font-bold text-xl md:text-2xl text-primary leading-tight">
              Gnana Prasoona's
            </span>
            <span className="text-sm font-medium tracking-wide text-foreground/80 uppercase">
              Smile Dental Clinic
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            <button onClick={() => scrollToSection("about")} className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors" data-testid="nav-about">About</button>
            <button onClick={() => scrollToSection("services")} className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors" data-testid="nav-services">Services</button>
            <button onClick={() => scrollToSection("results")} className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors" data-testid="nav-results">Transformations</button>
            <button onClick={() => scrollToSection("book")} className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors" data-testid="nav-book">Book</button>
            <button onClick={() => scrollToSection("contact")} className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors" data-testid="nav-contact">Contact</button>
            <Button className="bg-[#25D366] hover:bg-[#1ebe5d] text-white font-medium px-5 rounded-full gap-2" onClick={() => scrollToSection("book")} data-testid="btn-call-nav">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Book Now
            </Button>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="btn-mobile-menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t border-border animate-in slide-in-from-top-4">
            <div className="flex flex-col p-4 gap-4">
              <button onClick={() => scrollToSection("about")} className="text-left text-base font-medium p-2 text-foreground/80" data-testid="nav-mobile-about">About</button>
              <button onClick={() => scrollToSection("services")} className="text-left text-base font-medium p-2 text-foreground/80" data-testid="nav-mobile-services">Services</button>
              <button onClick={() => scrollToSection("results")} className="text-left text-base font-medium p-2 text-foreground/80" data-testid="nav-mobile-results">Transformations</button>
              <button onClick={() => scrollToSection("book")} className="text-left text-base font-medium p-2 text-foreground/80" data-testid="nav-mobile-book">Book Appointment</button>
              <button onClick={() => scrollToSection("contact")} className="text-left text-base font-medium p-2 text-foreground/80" data-testid="nav-mobile-contact">Contact</button>
              <Button className="w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white mt-2 gap-2" onClick={() => scrollToSection("book")} data-testid="btn-whatsapp-mobile">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Book on WhatsApp
              </Button>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 pt-24 md:pt-28">
        {/* Hero Section */}
        <section id="home" className="relative bg-background overflow-hidden pb-16 md:pb-24 lg:pb-32 pt-12 md:pt-16">
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6">
                  <CheckCircle2 className="w-4 h-4" />
                  Trusted Neighbourhood Clinic
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground leading-[1.1] mb-5">
                  Precision dentistry with <span className="text-primary italic">warmth</span> and <span className="text-secondary italic">care.</span>
                </h1>

                {/* Clinic motto */}
                <div className="flex items-center gap-3 mb-7">
                  <div className="h-px flex-1 bg-primary/20"></div>
                  <p className="font-serif italic text-xl text-primary font-semibold tracking-wide">
                    "Your Smile, Our Priority."
                  </p>
                  <div className="h-px flex-1 bg-primary/20"></div>
                </div>

                <p className="text-lg text-foreground/70 mb-8 max-w-xl leading-relaxed">
                  Led by Dr. Gnana Prasoona D.V — BDS., PGDHM. — we deliver real, visible results in a calm and professional environment. Dentistry you can trust, results that last.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="bg-[#25D366] hover:bg-[#1ebe5d] text-white rounded-full h-14 px-8 text-base shadow-lg shadow-green-200 gap-2" onClick={() => scrollToSection("book")} data-testid="btn-hero-whatsapp">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 flex-shrink-0">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Book on WhatsApp
                  </Button>
                  <Button size="lg" variant="outline" className="rounded-full h-14 px-8 text-base border-primary/20 hover:bg-primary/5 text-primary" onClick={() => scrollToSection("results")} data-testid="btn-hero-results">
                    View Real Results
                  </Button>
                </div>

                <div className="mt-12 flex items-center gap-6 text-sm text-foreground/60">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>Near Garden City University</span>
                  </div>
                  <div className="flex items-center gap-2" data-testid="status-clinic-open">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${clinicStatus.open ? "bg-green-500 animate-pulse" : "bg-red-400"}`}></span>
                    <span className={clinicStatus.open ? "text-green-600 font-medium" : "text-red-500 font-medium"}>
                      {clinicStatus.label}
                    </span>
                  </div>
                </div>
              </div>

              <div className="relative">
                {/* Decorative background blob */}
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-secondary/10 rounded-3xl transform rotate-3 scale-105 -z-10"></div>

                {/* Main image card */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-white border border-border/50 p-2">
                  <img
                    src={HERO_IMAGE}
                    alt="Beautiful confident smile"
                    className="w-full h-auto rounded-2xl object-cover aspect-[4/3]"
                    data-testid="img-hero-smile"
                  />

                  {/* Floating badge — top left */}
                  <div className="absolute top-5 left-5 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-xl shadow-lg border border-border/40 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground leading-tight">Reg. No. A26357</p>
                      <p className="text-[10px] text-foreground/50">Govt. Registered</p>
                    </div>
                  </div>

                  {/* Floating badge — bottom right */}
                  <div className="absolute bottom-5 right-5 bg-white/95 backdrop-blur-sm px-4 py-2.5 rounded-xl shadow-lg border border-border/40">
                    <div className="flex items-center gap-2 mb-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="w-3 h-3 fill-accent text-accent" />
                      ))}
                    </div>
                    <p className="text-xs font-bold text-foreground">Trusted by families</p>
                    <p className="text-[10px] text-foreground/50">Near Garden City University</p>
                  </div>
                </div>

                {/* Clinic interior thumbnail — floated below */}
                <div className="absolute -bottom-6 -left-6 w-32 h-24 rounded-2xl overflow-hidden shadow-xl border-2 border-white hidden lg:block">
                  <img
                    src={CLINIC_INTERIOR}
                    alt="Clean dental clinic interior"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    data-testid="img-hero-interior"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Doctor & Clinic Profile */}
        <section id="about" className="py-20 md:py-28 bg-white border-y border-border/40">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-5 gap-12 items-center">
                <div className="md:col-span-2">
                  <div className="aspect-[4/5] bg-muted rounded-2xl overflow-hidden relative shadow-lg">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <span className="text-primary/40 font-serif text-6xl">GP</span>
                    </div>
                  </div>
                </div>
                <div className="md:col-span-3">
                  <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Dr. Gnana Prasoona D.V</h2>
                  <p className="text-primary font-medium text-lg mb-6">BDS., PGDHM. • Reg No: A26357</p>

                  <div className="space-y-4 text-foreground/70 text-lg leading-relaxed">
                    <p>
                      With years of dedicated practice, Dr. Prasoona brings a unique blend of precision and warmth to every patient. We believe that a trip to the dentist shouldn't be stressful — it should be reassuring.
                    </p>
                    <p>
                      Our clinic is built on trust. Families come back to us year after year because the work holds up, the environment is clean and calm, and every treatment is explained clearly before we begin.
                    </p>
                  </div>

                  <div className="mt-8 grid grid-cols-2 gap-6">
                    <div className="bg-background p-4 rounded-xl border border-border/50">
                      <h4 className="font-bold text-xl text-primary mb-1">100%</h4>
                      <p className="text-sm text-foreground/60">Commitment to Care</p>
                    </div>
                    <div className="bg-background p-4 rounded-xl border border-border/50">
                      <h4 className="font-bold text-xl text-primary mb-1">Visible</h4>
                      <p className="text-sm text-foreground/60">Lasting Results</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="py-20 md:py-28 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Comprehensive Dental Care</h2>
              <p className="text-foreground/70 text-lg">
                Professional treatments tailored to your unique smile, delivered with precision and a gentle touch.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
              {[
                { name: "Dental Implants", desc: "Permanent, natural-looking replacements for missing teeth." },
                { name: "Teeth Whitening & Cleaning", desc: "Professional brightening and thorough plaque removal." },
                { name: "Root Canal Treatment", desc: "Painless procedures to save and restore damaged teeth." },
                { name: "Dental Crowns & Bridges", desc: "Custom-crafted restorations for strength and aesthetics." },
                { name: "Braces & Orthodontics", desc: "Effective alignment solutions for a perfectly straight smile." },
                { name: "Tooth Extraction & Fillings", desc: "Safe removals and durable cavity protection." },
              ].map((service, i) => (
                <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-border/50 hover:shadow-md transition-shadow group" data-testid={`card-service-${i}`}>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors text-primary">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{service.name}</h3>
                  <p className="text-foreground/60 text-sm leading-relaxed">{service.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Transformations (Results) */}
        <section id="results" className="py-20 md:py-28 bg-primary text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>

          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6 text-white">Smile Transformations</h2>
              <p className="text-primary-foreground/80 text-lg">
                We let our work speak for itself. These are actual patient results showcasing our commitment to quality, aesthetic, and functional dentistry.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
              <div className="space-y-8">
                <div className="bg-white/5 p-2 rounded-2xl border border-white/10 backdrop-blur-sm">
                  <img
                    src={beforeAfter2}
                    alt="Woman's smile restoration before and after"
                    className="w-full h-auto rounded-xl object-cover"
                    loading="lazy"
                    data-testid="img-transformation-2"
                  />
                  <div className="p-4">
                    <h4 className="font-bold text-xl text-white mb-2">Complete Smile Restoration</h4>
                    <p className="text-primary-foreground/70 text-sm">A comprehensive approach to restoring natural aesthetics and bite function.</p>
                  </div>
                </div>
              </div>
              <div className="space-y-8 md:mt-24">
                <div className="bg-white/5 p-2 rounded-2xl border border-white/10 backdrop-blur-sm">
                  <img
                    src={beforeAfter3}
                    alt="Teeth cleaning result on a man"
                    className="w-full h-auto rounded-xl object-cover"
                    loading="lazy"
                    data-testid="img-transformation-3"
                  />
                  <div className="p-4">
                    <h4 className="font-bold text-xl text-white mb-2">Advanced Cleaning & Whitening</h4>
                    <p className="text-primary-foreground/70 text-sm">Removal of deep stains and calculus, revealing a bright, healthy foundation.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-16 text-center">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 rounded-full h-14 px-8 text-base" onClick={() => scrollToSection("book")} data-testid="btn-results-cta">
                Book Your Appointment
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </section>

        {/* Patient Reviews */}
        <section id="reviews" className="py-20 md:py-28 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent font-medium text-sm mb-5">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
                Google Reviews
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">What Our Patients Say</h2>
              <p className="text-foreground/60 text-lg">Real experiences from real patients — in their own words.</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {[
                {
                  name: "Evita Ishwarya",
                  badge: "Local Guide · 13 reviews",
                  text: "Doc is very friendly and she clearly explains what the problem is. I am very much satisfied. You'll get all clarity on how your oral hygiene is. Highly highly recommend!",
                  highlight: "Clarity & Friendliness",
                },
                {
                  name: "Nandu Reddy",
                  badge: "3 reviews",
                  text: "They provided excellent care and good treatment. The doctor explained everything clearly, and the staff were super helpful. The facility was clean and the follow-up appointments were on point.",
                  highlight: "Overall Experience",
                },
                {
                  name: "Durgam Ramesh",
                  badge: "1 review",
                  text: "I visited three weeks back and had my root canal treatment done. I am very much thankful to Dr. Gnana Prasoona mam for her wonderful job.",
                  highlight: "Root Canal Treatment",
                },
                {
                  name: "Evishnu Vardhan",
                  badge: "Local Guide · 8 reviews",
                  text: "One of the best dental clinics I ever visited. To get a perfect idea of what's wrong and to get treated well, I suggest this clinic.",
                  highlight: "Best in Class",
                },
              ].map((review, i) => (
                <div
                  key={i}
                  className="flex flex-col bg-background rounded-2xl p-6 border border-border/50 shadow-sm hover:shadow-md transition-shadow"
                  data-testid={`card-review-${i}`}
                >
                  {/* Stars */}
                  <div className="flex gap-0.5 mb-4">
                    {[1,2,3,4,5].map(s => (
                      <svg key={s} viewBox="0 0 24 24" fill="#F59E0B" className="w-4 h-4">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                      </svg>
                    ))}
                  </div>

                  {/* Tag */}
                  <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-primary/70 bg-primary/8 px-2 py-0.5 rounded mb-3 self-start">
                    {review.highlight}
                  </span>

                  {/* Review text */}
                  <p className="text-foreground/70 text-sm leading-relaxed flex-1 italic">
                    "{review.text}"
                  </p>

                  {/* Reviewer */}
                  <div className="mt-5 pt-4 border-t border-border/50 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary font-bold text-sm">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground leading-tight">{review.name}</p>
                      <p className="text-[11px] text-foreground/45">{review.badge}</p>
                    </div>
                    <svg viewBox="0 0 24 24" className="w-5 h-5 ml-auto flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                  </div>
                </div>
              ))}
            </div>

            {/* Overall rating summary */}
            <div className="mt-12 flex items-center justify-center gap-3 text-foreground/60 text-sm">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(s => (
                  <svg key={s} viewBox="0 0 24 24" fill="#F59E0B" className="w-4 h-4">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                  </svg>
                ))}
              </div>
              <span className="font-bold text-foreground">5.0</span>
              <span>·</span>
              <span>Rated on Google by our patients</span>
            </div>
          </div>
        </section>

        {/* WhatsApp Booking Section */}
        <section id="book" className="py-20 md:py-28 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#25D366]/10 mb-6">
                  <svg viewBox="0 0 24 24" fill="#25D366" className="w-8 h-8">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Book an Appointment</h2>
                <p className="text-foreground/70 text-lg">
                  Fill in your details and we'll send a pre-written message straight to our WhatsApp. Quick, easy, and no waiting on hold.
                </p>
              </div>

              <div className="bg-white rounded-3xl border border-border/60 shadow-sm overflow-hidden">
                {/* Form header strip */}
                <div className="bg-[#25D366] px-8 py-5 flex items-center gap-3">
                  <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6 flex-shrink-0">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  <div>
                    <p className="text-white font-bold leading-tight">Gnana Prasoona's Smile Dental Clinic</p>
                    <p className="text-white/80 text-xs">Typically replies within an hour</p>
                  </div>
                </div>

                {submitted ? (
                  <div className="px-8 py-16 text-center" data-testid="booking-success">
                    <div className="w-20 h-20 rounded-full bg-[#25D366]/10 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="w-10 h-10 text-[#25D366]" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">Opening WhatsApp...</h3>
                    <p className="text-foreground/60 mb-8">Your message is pre-filled and ready to send. Just tap the send button in WhatsApp.</p>
                    <Button
                      variant="outline"
                      className="rounded-full border-[#25D366] text-[#25D366] hover:bg-[#25D366]/5"
                      onClick={() => { setSubmitted(false); setForm({ name: "", phone: "", issue: "", slot: "" }); }}
                      data-testid="btn-book-again"
                    >
                      Book Another Appointment
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleWhatsAppSubmit} className="px-8 py-8 space-y-5" data-testid="form-whatsapp-booking">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-foreground/70 mb-2">
                          Full Name <span className="text-accent">*</span>
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          value={form.name}
                          onChange={handleFormChange}
                          placeholder="Your full name"
                          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-base text-foreground placeholder:text-foreground/35 focus:outline-none focus:ring-2 focus:ring-[#25D366]/40 focus:border-[#25D366] transition"
                          data-testid="input-booking-name"
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-semibold text-foreground/70 mb-2">
                          Phone Number <span className="text-accent">*</span>
                        </label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={form.phone}
                          onChange={handleFormChange}
                          placeholder="+91 XXXXX XXXXX"
                          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-base text-foreground placeholder:text-foreground/35 focus:outline-none focus:ring-2 focus:ring-[#25D366]/40 focus:border-[#25D366] transition"
                          data-testid="input-booking-phone"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="slot" className="block text-sm font-semibold text-foreground/70 mb-2">
                        Preferred Time Slot <span className="text-accent">*</span>
                      </label>
                      <select
                        id="slot"
                        name="slot"
                        value={form.slot}
                        onChange={handleFormChange}
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-[#25D366]/40 focus:border-[#25D366] transition appearance-none cursor-pointer"
                        data-testid="select-booking-slot"
                      >
                        <option value="" disabled>Select a time slot</option>
                        <optgroup label="Morning Session (10:00 AM – 1:30 PM)">
                          {TIME_SLOTS.filter(s => s.startsWith("Morning")).map(slot => (
                            <option key={slot} value={slot}>{slot}</option>
                          ))}
                        </optgroup>
                        <optgroup label="Evening Session (4:30 PM – 8:00 PM)">
                          {TIME_SLOTS.filter(s => s.startsWith("Evening")).map(slot => (
                            <option key={slot} value={slot}>{slot}</option>
                          ))}
                        </optgroup>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="issue" className="block text-sm font-semibold text-foreground/70 mb-2">
                        Describe Your Issue <span className="text-foreground/40 font-normal">(optional)</span>
                      </label>
                      <textarea
                        id="issue"
                        name="issue"
                        value={form.issue}
                        onChange={handleFormChange}
                        placeholder="E.g. tooth pain, bleeding gums, want cleaning, broken tooth..."
                        rows={3}
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-base text-foreground placeholder:text-foreground/35 focus:outline-none focus:ring-2 focus:ring-[#25D366]/40 focus:border-[#25D366] transition resize-none"
                        data-testid="textarea-booking-issue"
                      />
                    </div>

                    {formError && (
                      <p className="text-accent text-sm font-medium" data-testid="text-form-error">{formError}</p>
                    )}

                    {/* Message preview */}
                    {(form.name || form.phone || form.slot) && (
                      <div className="bg-[#ECF8F1] rounded-2xl p-4 border border-[#25D366]/20">
                        <p className="text-xs font-bold text-[#25D366] uppercase tracking-wider mb-2">Message Preview</p>
                        <p className="text-sm text-foreground/70 whitespace-pre-line leading-relaxed font-mono">
                          {[
                            `Hello, I'd like to book an appointment at Gnana Prasoona's Smile Dental Clinic.`,
                            ``,
                            form.name ? `Name: ${form.name}` : null,
                            form.phone ? `Phone: ${form.phone}` : null,
                            form.slot ? `Preferred Time: ${form.slot}` : null,
                            form.issue ? `Issue / Concern: ${form.issue}` : null,
                            ``,
                            `Please confirm my appointment. Thank you!`,
                          ].filter(l => l !== null).join("\n")}
                        </p>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1ebe5d] active:bg-[#18a84f] text-white font-bold text-base rounded-2xl py-4 transition-all shadow-lg shadow-green-100 hover:shadow-xl hover:shadow-green-100"
                      data-testid="btn-submit-whatsapp"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      Send via WhatsApp
                    </button>

                    <p className="text-center text-xs text-foreground/40">
                      This will open WhatsApp with your details pre-filled. You'll send the message from your own number.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Contact & Location */}
        <section id="contact" className="py-20 md:py-28 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-5xl mx-auto bg-background rounded-3xl p-8 md:p-12 border border-border/50 shadow-sm">
              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Visit Our Clinic</h2>
                  <p className="text-foreground/70 mb-8 text-lg">
                    Ready for a consultation? Give us a call or visit our clinic near Garden City University.
                  </p>

                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <Phone className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground/50 uppercase tracking-wider mb-1">Call Us</p>
                        <a href="tel:9398664723" className="text-xl font-bold text-primary hover:underline" data-testid="link-contact-phone">9398664723</a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <Clock className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground/50 uppercase tracking-wider mb-1">Timings</p>
                        <p className="text-base font-medium">Morning: 10:00 AM – 1:30 PM</p>
                        <p className="text-base font-medium">Evening: 4:30 PM – 8:00 PM</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground/50 uppercase tracking-wider mb-1">Address</p>
                        <p className="text-base font-medium leading-relaxed">
                          #13, Kithaganur Main Rd,<br />
                          Near Garden City University, Byanna Layout,<br />
                          Bhattarahalli, Bengaluru - 560049
                        </p>
                        <a
                          href="https://www.google.com/maps/dir//Gnana+Prasoona%27s+Smile+Dental+Clinic,+13,+Kithaganur+Main+Rd,+Byanna+Layout,+Bengaluru,+Karnataka+560049/@13.0226142,77.7062723,17z/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 mt-3 text-sm font-semibold text-primary hover:underline"
                          data-testid="link-get-directions"
                        >
                          <MapPin className="w-4 h-4" />
                          Get Directions
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="h-full min-h-[300px] rounded-2xl overflow-hidden shadow-inner border border-border">
                  <iframe
                    src="https://maps.google.com/maps?q=13.0226142,77.7062723&z=17&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Clinic Location Map"
                    data-testid="iframe-google-map"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12 border-t border-white/10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <span className="font-serif font-bold text-xl md:text-2xl text-white leading-tight block mb-1">
                Gnana Prasoona's
              </span>
              <span className="text-xs font-medium tracking-wide text-white/60 uppercase block mb-6">
                Smile Dental Clinic
              </span>
              <p className="text-sm text-white/60 max-w-xs">
                Professional, warm, and confidence-inspiring dental care in Bengaluru. Real results you can trust.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li><button onClick={() => scrollToSection("home")} className="hover:text-white transition-colors">Home</button></li>
                <li><button onClick={() => scrollToSection("about")} className="hover:text-white transition-colors">About Dr. Prasoona</button></li>
                <li><button onClick={() => scrollToSection("services")} className="hover:text-white transition-colors">Treatments</button></li>
                <li><button onClick={() => scrollToSection("results")} className="hover:text-white transition-colors">Smile Gallery</button></li>
                <li><button onClick={() => scrollToSection("book")} className="hover:text-white transition-colors">Book Appointment</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Contact</h4>
              <p className="text-sm text-white/60 mb-2">Phone: <a href="tel:9398664723" className="hover:text-white">9398664723</a></p>
              <p className="text-sm text-white/60">Bengaluru - 560049</p>
              <Button
                className="mt-4 bg-[#25D366] hover:bg-[#1ebe5d] text-white border-0 gap-2"
                onClick={() => scrollToSection("book")}
                data-testid="btn-footer-whatsapp"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Book on WhatsApp
              </Button>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 text-center text-xs text-white/40 flex flex-col md:flex-row justify-between items-center gap-4">
            <p>&copy; {new Date().getFullYear()} Gnana Prasoona's Smile Dental Clinic. All rights reserved.</p>
            <p>Registration No: A26357</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
