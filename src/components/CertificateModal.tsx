import { useState } from 'react';
import siteConfig from '@/config/site';

interface Props {
  courseSlug: string;
  courseName: string;
  onClose: () => void;
}

export default function CertificateModal({ courseSlug, courseName, onClose }: Props) {
  const storageKey = `certificate:${courseSlug}`;
  const [name, setName] = useState(() => {
    try { return localStorage.getItem(storageKey) ?? ''; } catch { return ''; }
  });
  const [ready, setReady] = useState(() => {
    try { return !!localStorage.getItem(storageKey); } catch { return false; }
  });

  const handleGenerate = () => {
    try { localStorage.setItem(storageKey, name); } catch {}
    setReady(true);
  };

  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleSaveImage = async () => {
    const html2canvas = (await import('html2canvas')).default;
    const el = document.getElementById('certificate');
    if (!el) return;
    const canvas = await html2canvas(el, { useCORS: true, scale: 2, backgroundColor: '#ffffff' });
    const link = document.createElement('a');
    link.download = `${courseSlug}-certificate.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Certificate of Completion — ${courseName}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      display: flex; align-items: center; justify-content: center;
      min-height: 100vh; background: white; padding: 2rem;
    }
    .certificate { border: 2px solid #fed7aa; border-radius: 0.75rem; padding: 3rem; text-align: center; width: 100%; max-width: 600px; }
    .inner { border: 1px solid #e5e7eb; border-radius: 0.5rem; padding: 3rem; }
    .logo { display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-bottom: 2rem; }
    .logo-icon { width: 2.25rem; height: 2.25rem; background: #f97316; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; color: white; font-weight: 900; font-size: 0.875rem; }
    .logo-name { font-weight: 900; font-size: 1.25rem; color: #111827; letter-spacing: -0.025em; }
    .label { font-size: 0.75rem; font-weight: 700; color: #f97316; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 1.25rem; }
    .divider { width: 3rem; height: 1px; background: #e5e7eb; margin: 0 auto 1.5rem; }
    .sub { font-size: 0.875rem; color: #6b7280; margin-bottom: 0.5rem; }
    .recipient { font-size: 1.875rem; font-weight: 900; color: #111827; margin-bottom: 1rem; }
    .course { font-size: 1.25rem; font-weight: 700; color: #1f2937; margin-bottom: 2rem; }
    .accent { width: 6rem; height: 2px; background: #fed7aa; margin: 0 auto 1rem; }
    .date { font-size: 0.75rem; color: #9ca3af; }
    @media print {
      body { padding: 0; }
      * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    }
  </style>
</head>
<body>
  <div class="certificate">
    <div class="inner">
      <div class="logo">
        ${siteConfig.logo
          ? siteConfig.logoHasText
            ? `<div style="height:1.75rem;padding:0 0.5rem;background:#111827;border-radius:0.375rem;display:inline-flex;align-items:center;-webkit-print-color-adjust:exact;print-color-adjust:exact;"><img src="${siteConfig.logo}" alt="${siteConfig.name}" style="height:1.5rem;width:auto;" /></div>`
            : `<img src="${siteConfig.logo}" alt="${siteConfig.name}" style="height:2.25rem;width:auto;" />`
          : `<div class="logo-icon">${siteConfig.name.charAt(0)}</div><span class="logo-name">${siteConfig.name}</span>`
        }
      </div>
      <p class="label">Certificate of Completion</p>
      <div class="divider"></div>
      <p class="sub">This certifies that</p>
      <p class="recipient">${name}</p>
      <p class="sub">has successfully completed</p>
      <p class="course">${courseName}</p>
      <div class="accent"></div>
      <p class="date">${date}</p>
    </div>
  </div>
</body>
</html>`);
    printWindow.document.close();
    printWindow.focus();
    printWindow.onafterprint = () => printWindow.close();
    printWindow.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)' }}
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-dm-surface rounded-2xl shadow-2xl dark:shadow-black/50 w-full max-w-lg overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {!ready ? (
          <div className="p-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Get your certificate</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Enter your name to generate a completion certificate for{' '}
              <strong className="text-gray-700 dark:text-gray-200">{courseName}</strong>.
            </p>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
              Your full name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && name.trim()) handleGenerate(); }}
              placeholder="Jane Smith"
              autoFocus
              className="w-full border border-brand-gray-light dark:border-dm-border dark:bg-dm-raised rounded-lg px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-brand-cyan dark:focus:border-blue-500 transition-colors mb-6"
            />
            <div className="flex gap-3">
              <button
                onClick={handleGenerate}
                disabled={!name.trim()}
                className="flex-1 btn-primary justify-center disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Generate Certificate
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-lg border border-brand-gray-light dark:border-dm-border text-sm text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500 hover:text-gray-900 dark:hover:text-gray-200 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="flex items-center justify-between mb-4 certificate-controls">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Ready to print or save</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveImage}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-cyan text-white text-xs font-semibold hover:opacity-90 transition-all"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Save as Image
                </button>
                <button
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-orange text-white text-xs font-semibold hover:bg-brand-orange-light transition-all"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print / Save PDF
                </button>
                <button
                  onClick={onClose}
                  className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Certificate — always white/light for printing */}
            <div id="certificate" className="border-2 border-brand-orange/20 rounded-xl p-8 text-center bg-white">
              <div className="border border-brand-gray-light rounded-lg p-8">
                <div className="flex items-center justify-center mb-8">
                  {siteConfig.logo ? (
                    siteConfig.logoHasText ? (
                      <div className="h-7 px-2 bg-gray-900 rounded-md flex items-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={siteConfig.logo} alt={siteConfig.name} className="h-6 w-auto" />
                      </div>
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={siteConfig.logo} alt={siteConfig.name} className="h-9 w-auto" />
                    )
                  ) : (
                    <>
                      <div className="w-9 h-9 bg-brand-orange rounded-lg flex items-center justify-center font-black text-white text-sm mr-2">
                        {siteConfig.name.charAt(0)}
                      </div>
                      <span className="font-black text-xl text-gray-900 tracking-tight">{siteConfig.name}</span>
                    </>
                  )}
                </div>

                <p className="text-xs font-bold text-brand-orange uppercase tracking-widest mb-5">
                  Certificate of Completion
                </p>

                <div className="w-12 h-px bg-brand-gray-light mx-auto mb-6" />

                <p className="text-sm text-gray-500 mb-2">This certifies that</p>
                <p className="text-3xl font-black text-gray-900 mb-4">{name}</p>
                <p className="text-sm text-gray-500 mb-2">has successfully completed</p>
                <p className="text-xl font-bold text-gray-800 mb-8">{courseName}</p>

                <div className="w-24 h-0.5 bg-brand-orange/30 mx-auto mb-4" />

                <p className="text-xs text-gray-400">{date}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
