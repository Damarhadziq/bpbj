export default function GallerySection() {
  const images = [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuC6W0igbE-LB7FwiH60ZtGLSsL-W3K6H54bgWOMi3ONSNv3hATuMKqUwMiEd4X18ZJNR3lRceb5OTSt3zXskxLEAkupE5KexHy6Olsjaki6A57kp640MYKrHJCP9Nb88Lgo2P03m8vk4JbmxAp7Kqp5C6t8HYcqJX1mkUTjlEWgFE_4LhmkY5F8_S0rPRdoKwcx4vgl_roufhIUsYasWRTek78vz_Bgenw7VZKHcF5Qm2y-uc7tT40I-uhEttju-C20AqE-wCB8pg",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCHNnT42TSquSQjv8JYr9oAUI3BEvXeE9fxrOfjJoCf-bHEoxtjXu2YREzJqGTQAI0NiJOqXUs5MMF8Rbw6rE7B7edQUINDaa4STtSSGvfOzm_UAF-TIIOGJrrByjJPQiwhEThn4HVwEMuzWPFwrASDeq_wFN0NSxQR5AUEoQ6hcb35kY6S0rZVIyAZeA8_mbY2P2ikxwkB5Ptk7KP0mp92I9hFW6BA_V1j3Qxat5AxnKk2lu8VUjHshOfA99gDcl7RP_MKA2MFfw",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuD2CjD6aZYo0xV6ocO6KkEUxVa9NAbet7YYhEC02SlbEQHolyLq5bPccea069SF6MEsFf2cesZgKCGHp-Lr0CsRWRUAQwYP19UMwR8_GC0etvrZ9r6q6PZYvH0zsoO9jdOHcPSjlyHoKy6GxB8Hg4kqEwG1q4LlFUqeW4parLm-mNPIRQoVui0vWs4tAuZH79CfNHH_HXOk_P5UTtoaDEMiHxI2RvIQ4k8YIfSP-cARg9tlIeov7wsXFRITMwOm7xyIjfKI5_VAbw",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAY2PdDgdbT0gw1CX18lvdGxMZ1epcDw5gs2M9t9WT_CTbChZFIemYe6vs8uD9Xtm0fUFVZcDLXWdjjO-JNrs78LagPk6dqsUyOYjX1ExMAI3lRBNcIU5XLtn4UoRjNW_tJsvsdVZzYYWIRLEx44F73YjuP0RPOD-hKUj0uAYP2njXsVJJ6TNmAoe0UauBkKi1YxNvDFn27symSIPTentGGG4OTLR7_yseF4VhjA5fbOB096jNmpgoGM0vc5vinVuXLiSlCEJzfiA"
  ];

  return (
    <section className="py-24 bg-surface-container-low overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <h2 className="text-4xl font-black tracking-tighter">Galeri Kegiatan</h2>
          <p className="text-on-surface-variant md:text-right max-w-md">Dokumentasi transparansi dan aksi nyata BPBJ Kota Semarang dalam melayani masyarakat.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((src, idx) => (
            <div key={idx} className={`aspect-square rounded-xl overflow-hidden group relative ${idx % 2 !== 0 ? 'md:mt-8' : ''}`}>
              <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                   src={src} alt={`Gallery item ${idx+1}`}/>
              <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-3xl">zoom_in</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
