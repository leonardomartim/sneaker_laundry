export function Header() {
  return (
    <header className="bg-white shadow-sm fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-blue-600 tracking-tighter">Lave & Leve</h1>
        <nav>
          <a href="#portfolio" className="text-slate-600 hover:text-blue-600 px-3 py-2 font-medium">Trabalhos</a>
          <a href="#orcamento" className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition">Orçamento</a>
        </nav>
      </div>
    </header>
  );
}