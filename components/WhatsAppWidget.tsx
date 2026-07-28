import React, { useState, useRef } from 'react';
import { X, Phone } from 'lucide-react';
import { Language } from '../types';

const WhatsAppWidget: React.FC<{ lang: Language; photoUrl?: string }> = ({ lang, photoUrl }) => {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const phone = '97450910893';
  const telegram = 'https://t.me/@mullaum';
  const instagram = 'https://www.instagram.com/mullaumm';

  const t = {
    name: lang === 'en' ? 'Begarys' : 'Бег',
    role: lang === 'en' ? 'Consultant, G2M International' : 'Консультант, G2M International',
    greeting: lang === 'en'
      ? 'How can I help?\nAsk your question in the way that suits you'
      : 'Чем могу помочь?\nЗадайте свой вопрос, удобным способом',
    urgent: lang === 'en' ? 'For an urgent matter, call us' : 'А если нужно срочное решение, позвоните нам',
    respond: lang === 'en' ? 'We usually reply within 5 min' : 'Ответим в течении 5 мин',
    write: lang === 'en' ? 'Message us' : 'Написать',
    close: lang === 'en' ? 'Close' : 'Закрыть',
  };

  const handleEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const handleLeave = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 250);
  };

  const waHref = `https://wa.me/${phone}?text=${encodeURIComponent(lang === 'en' ? 'Hello!' : 'Здравствуйте!')}`;

  return (
    <div
      className="fixed bottom-8 right-8 z-50"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {open && (
        <div className="absolute bottom-full right-0 mb-4 w-80 bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="bg-green-500 px-4 pt-4 pb-6 relative">
            <button
              onClick={() => setOpen(false)}
              aria-label={t.close}
              className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3">
              <div className="relative">
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt={t.name}
                    className="w-12 h-12 rounded-full object-cover bg-white/90"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center text-green-600 font-semibold text-lg">
                    {t.name.charAt(0)}
                  </div>
                )}
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-300 border-2 border-green-500 rounded-full" />
              </div>
              <div>
                <p className="text-white font-semibold leading-tight">{t.name}</p>
                <p className="text-white/85 text-sm leading-tight">{t.role}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 px-4 py-4 space-y-3">
            <p className="text-center text-xs text-slate-400">13:01</p>
            <div className="bg-green-50 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-slate-700 whitespace-pre-line">
              {t.greeting}
            </div>
            <div className="bg-green-50 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-slate-700">
              {t.urgent}{' '}
              <a href={`tel:+${phone}`} className="font-semibold text-green-700 whitespace-nowrap">
                +974 509 108 93
              </a>
            </div>
          </div>

          <div className="bg-white px-4 py-4 border-t border-slate-100">
            <p className="flex items-center justify-center gap-1.5 text-xs text-slate-400 mb-3">
              <Phone className="w-3 h-3" /> {t.respond}
            </p>
            <div className="grid grid-cols-3 gap-2 mb-3">
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1 bg-green-500 hover:bg-green-600 text-white rounded-xl py-2.5 transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                <span className="text-[10px] font-medium">WhatsApp</span>
              </a>
              <a
                href={telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1 bg-sky-500 hover:bg-sky-600 text-white rounded-xl py-2.5 transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M23.91 3.79 20.3 20.84c-.25 1.21-.98 1.5-2 .94l-5.5-4.07-2.66 2.57c-.3.3-.55.55-1.1.55l.4-5.56 10.1-9.12c.44-.4-.1-.6-.68-.2L7.03 12.83l-5.5-1.72c-1.2-.38-1.22-1.2.26-1.78L22.36 2.05c1-.38 1.87.24 1.55 1.74z"/></svg>
                <span className="text-[10px] font-medium">Telegram</span>
              </a>
              <a
                href={instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1 bg-gradient-to-br from-amber-400 via-pink-500 to-purple-600 hover:opacity-90 text-white rounded-xl py-2.5 transition-opacity"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M12 2.2c3.2 0 3.6 0 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.25.07 1.65.07 4.85s0 3.6-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.25.06-1.64.07-4.85.07s-3.6 0-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.25-.07-1.65-.07-4.85s0-3.6.07-4.85C2.35 3.94 3.87 2.39 7.15 2.27 8.4 2.2 8.8 2.2 12 2.2M12 0C8.74 0 8.33 0 7.05.07c-4.35.2-6.78 2.62-6.98 6.98C0 8.33 0 8.74 0 12s0 3.67.07 4.95c.2 4.36 2.62 6.78 6.98 6.98C8.33 24 8.74 24 12 24s3.67 0 4.95-.07c4.35-.2 6.78-2.62 6.98-6.98.07-1.28.07-1.69.07-4.95s0-3.67-.07-4.95c-.2-4.35-2.62-6.78-6.98-6.98C15.67 0 15.26 0 12 0z"/><path d="M12 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84m0 10.16A4 4 0 1 1 16 12a4 4 0 0 1-4 4z"/><circle cx="18.4" cy="5.6" r="1.44"/></svg>
                <span className="text-[10px] font-medium">Instagram</span>
              </a>
            </div>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white rounded-xl py-2.5 font-medium text-sm transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              {t.write}
            </a>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={lang === 'en' ? 'Contact us on WhatsApp' : 'Написать нам в WhatsApp'}
        className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl transition-all hover:scale-110 active:scale-95"
      >
        <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </button>
    </div>
  );
};

export default WhatsAppWidget;