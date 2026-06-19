export function Hero() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
      <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-6">
        Seus Sneakers como <span className="text-blue-600">Novos</span> Outra Vez.
      </h2>
      <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-10">
        Lavanderia especializada em revitalização e limpeza profunda.
      </p>
      <a href="#orcamento" className="inline-block bg-slate-900 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-slate-800 transition shadow-lg">
        Solicitar Coleta
      </a>
    </section>
  );
}