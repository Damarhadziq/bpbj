export default function PlaceholderAdminPage({ title }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 min-h-[600px]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
          <p className="text-slate-500 mt-1">Manajemen data {title.toLowerCase()}.</p>
        </div>
        <button className="bg-primary hover:bg-primary-container text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">add</span>
          Tambah Baru
        </button>
      </div>
      
      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <div className="bg-slate-50 border-b border-slate-200 p-4">
          <p className="text-sm font-medium text-slate-500">Tabel Data {title}</p>
        </div>
        <div className="p-12 text-center text-slate-400">
          <span className="material-symbols-outlined text-4xl mb-2 opacity-50">table_view</span>
          <p>Komponen tabel {title} sedang dalam pengembangan.</p>
        </div>
      </div>
    </div>
  );
}
