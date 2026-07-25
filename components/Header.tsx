
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Language } from '../types';
import { NAV_LINKS } from '../constants';

interface HeaderProps {
  lang: Language;
  setLang: (l: Language) => void;
}

const Header: React.FC<HeaderProps> = ({ lang, setLang }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Offset for fixed header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'glass shadow-[0_8px_32px_rgba(0,0,0,0.04)] py-3' : 'bg-transparent py-8'
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        {isHomePage ? (
          <a
            href="/"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="flex items-center space-x-3 group cursor-pointer"
          >
            <img src="/images/logo/logo.webp" alt="G2M International Consulting" className="h-10 w-auto object-contain group-hover:scale-105 transition-transform" width="269" height="101" fetchPriority="high" />
          </a>
        ) : (
          <Link
            to="/"
            className="flex items-center space-x-3 group cursor-pointer"
          >
            <img src="/images/logo/logo.webp" alt="G2M International Consulting" className="h-10 w-auto object-contain group-hover:scale-105 transition-transform" width="269" height="101" fetchPriority="high" />
          </Link>
        )}

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-10">
          {NAV_LINKS.map((link) => (
            link.href ? (
              <Link
                key={link.id}
                to={link.href}
                className={`text-[13px] font-black hover:text-qatar-maroon transition-premium uppercase tracking-widest relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:bg-qatar-maroon after:transition-all ${
                  location.pathname === link.href
                    ? 'text-qatar-maroon after:w-full'
                    : 'text-slate-500 after:w-0 hover:after:w-full'
                }`}
              >
                {link.label[lang]}
              </Link>
            ) : isHomePage ? (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => scrollToSection(e, link.id)}
                className="text-[13px] font-black text-slate-500 hover:text-qatar-maroon transition-premium uppercase tracking-widest relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-qatar-maroon hover:after:w-full after:transition-all"
              >
                {link.label[lang]}
              </a>
            ) : (
              <Link
                key={link.id}
                to={`/#${link.id}`}
                className="text-[13px] font-black text-slate-500 hover:text-qatar-maroon transition-premium uppercase tracking-widest relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-qatar-maroon hover:after:w-full after:transition-all"
              >
                {link.label[lang]}
              </Link>
            )
          ))}
          <div className="flex items-center space-x-3 bg-slate-100/50 p-1.5 rounded-full border border-slate-200/50 ml-4 backdrop-blur-sm">
            <button
              onClick={() => setLang('en')}
              className={`w-10 h-10 flex items-center justify-center rounded-full text-xs font-black transition-all ${lang === 'en' ? 'bg-white shadow-md text-qatar-maroon' : 'text-slate-400 hover:text-slate-600'}`}
            >
              EN
            </button>
            <button
              onClick={() => setLang('ru')}
              className={`w-10 h-10 flex items-center justify-center rounded-full text-xs font-black transition-all ${lang === 'ru' ? 'bg-white shadow-md text-qatar-maroon' : 'text-slate-400 hover:text-slate-600'}`}
            >
              RU
            </button>
          </div>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className={`md:hidden relative w-10 h-10 flex flex-col items-center justify-center gap-1.5 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Open menu"
        >
          <span className="block h-0.5 w-6 bg-slate-900 rounded-full" />
          <span className="block h-0.5 w-4 bg-slate-900 rounded-full" />
          <span className="block h-0.5 w-6 bg-slate-900 rounded-full" />
        </button>
      </div>

    </header>

      {/* Mobile Menu Overlay - outside header to avoid stacking context issues */}
      <div className={`md:hidden fixed inset-0 z-[200] transition-all duration-500 ${isMobileMenuOpen ? 'visible' : 'invisible'}`}>
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-500 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Panel */}
        <div className={`absolute top-0 right-0 h-full w-4/5 max-w-xs bg-slate-900 flex flex-col transition-transform duration-500 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>

          {/* Close button */}
          <div className="flex items-center justify-between px-8 pt-10 pb-8 border-b border-white/10">
            <img src="/images/logo/logo.webp" alt="G2M" className="h-8 w-auto object-contain brightness-0 invert" width="215" height="81" />
            <button onClick={() => setIsMobileMenuOpen(false)} className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Links */}
          <nav className="flex flex-col px-8 py-8 gap-1 flex-grow">
            {NAV_LINKS.map((link, idx) => (
              link.href ? (
                <Link
                  key={link.id}
                  to={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-between py-4 border-b border-white/5 group ${location.pathname === link.href ? 'text-qatar-maroon' : 'text-white'}`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-black text-white/20 w-5">{String(idx + 1).padStart(2, '0')}</span>
                    <span className="text-lg font-extrabold tracking-tight">{link.label[lang]}</span>
                  </div>
                  <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-qatar-maroon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ) : isHomePage ? (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={(e) => scrollToSection(e, link.id)}
                  className="flex items-center justify-between py-4 border-b border-white/5 text-white group"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-black text-white/20 w-5">{String(idx + 1).padStart(2, '0')}</span>
                    <span className="text-lg font-extrabold tracking-tight">{link.label[lang]}</span>
                  </div>
                  <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-qatar-maroon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              ) : (
                <Link
                  key={link.id}
                  to={`/#${link.id}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between py-4 border-b border-white/5 text-white group"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-black text-white/20 w-5">{String(idx + 1).padStart(2, '0')}</span>
                    <span className="text-lg font-extrabold tracking-tight">{link.label[lang]}</span>
                  </div>
                  <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-qatar-maroon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              )
            ))}
          </nav>

          {/* Bottom */}
          <div className="px-8 pb-10 space-y-4">
            <div className="flex gap-3">
              <button onClick={() => { setLang('en'); }} className={`flex-1 py-3 rounded-xl font-black text-sm transition-all ${lang === 'en' ? 'bg-qatar-maroon text-white' : 'bg-white/10 text-white/50'}`}>EN</button>
              <button onClick={() => { setLang('ru'); }} className={`flex-1 py-3 rounded-xl font-black text-sm transition-all ${lang === 'ru' ? 'bg-qatar-maroon text-white' : 'bg-white/10 text-white/50'}`}>RU</button>
            </div>
            <a href="mailto:Info@go2market.qa" className="block text-center text-sm font-semibold text-white/40 hover:text-white transition-colors">
              Info@go2market.qa
            </a>
          </div>

        </div>
      </div>
    </>
  );
};

export default Header;
