const fs = require('fs');
const filepath = 'd:/laragon/www/magang/Magang-frontend/src/pages/public/Home.jsx';
const content = fs.readFileSync(filepath, 'utf8');
const lines = content.split('\n');
const startIdx = 57; // line 58
const endIdx = 174; // line 174

const newComponent = `// ── Testimonial Marquee ──
function TestimonialCarousel({ testimonials }) {
  if (!testimonials || testimonials.length === 0) return null

  // Split into two groups if we have enough, otherwise duplicate
  const half = Math.ceil(testimonials.length / 2)
  const row1 = testimonials.slice(0, half)
  const row2 = testimonials.length > 1 ? testimonials.slice(half) : testimonials

  // We need enough items to fill the screen twice to prevent popping
  const repeatedRow1 = [...row1, ...row1, ...row1, ...row1, ...row1, ...row1, ...row1, ...row1]
  const repeatedRow2 = [...row2, ...row2, ...row2, ...row2, ...row2, ...row2, ...row2, ...row2]

  const TestimonialCard = ({ t }) => (
    <div className="card bg-base-100 shadow-sm border-2 border-base-200 hover:border-primary/50 transition-colors duration-300 w-[350px] shrink-0">
      <div className="card-body p-6 space-y-4 flex flex-col h-full">
        <StarRating rating={t.rating} />
        <p className="text-sm text-base-content/80 leading-relaxed font-medium">"{t.isi_testimoni}"</p>
        <div className="flex items-center gap-3 pt-4 mt-auto border-t border-base-200/60">
          <div className="avatar">
            <div className="w-10 h-10 rounded-full bg-primary/10 overflow-hidden">
              {t.foto ? (
                <img src={\`http://localhost:8000/storage/\${t.foto}\`} alt={t.nama_klien} className="object-cover w-full h-full" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm font-black text-primary">
                  {t.nama_klien.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>
          <div>
            <h4 className="font-bold text-sm text-secondary">{t.nama_klien}</h4>
            <p className="text-xs text-base-content/50 font-medium">{t.jabatan || 'Klien'}</p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="relative w-full overflow-hidden py-10 -mx-4 px-4 sm:mx-0 sm:px-0">
      <div className="absolute inset-y-0 left-0 w-12 md:w-32 bg-gradient-to-r from-base-100 to-transparent z-10 pointer-events-none"></div>
      <div className="absolute inset-y-0 right-0 w-12 md:w-32 bg-gradient-to-l from-base-100 to-transparent z-10 pointer-events-none"></div>
      
      <div className="flex flex-col gap-6">
        {/* Row 1 - Left to Right */}
        <div className="flex w-max animate-marquee-right gap-6 hover:![animation-play-state:paused]">
          {repeatedRow1.map((t, i) => (
            <TestimonialCard key={\`r1-\${t.id_testimoni}-\${i}\`} t={t} />
          ))}
        </div>

        {/* Row 2 - Right to Left */}
        <div className="flex w-max animate-marquee-left gap-6 hover:![animation-play-state:paused]">
          {repeatedRow2.map((t, i) => (
            <TestimonialCard key={\`r2-\${t.id_testimoni}-\${i}\`} t={t} />
          ))}
        </div>
      </div>
    </div>
  )
}`;

lines.splice(startIdx, endIdx - startIdx, newComponent);
fs.writeFileSync(filepath, lines.join('\n'));
console.log("Successfully replaced TestimonialCarousel");
