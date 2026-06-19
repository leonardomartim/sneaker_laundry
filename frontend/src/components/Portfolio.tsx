import { motion } from 'framer-motion';

export function Portfolio() {
  return (
    <section id="portfolio" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold text-slate-900">Nossos Trabalhos</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((item, index) => (
            <motion.div 
              key={item}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              viewport={{ once: true }}
              className="group relative rounded-xl overflow-hidden bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl aspect-3/4"
            >
              <div className="absolute inset-0 flex items-center justify-center text-slate-400 bg-slate-100">
                Sneaker {item}
              </div>
              <div className="absolute inset-0 bg-blue-900/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-8 text-white text-center">
                <h4 className="text-xl font-bold mb-2">Limpeza Premium</h4>
                <button className="bg-white text-blue-900 px-6 py-2 rounded-full font-semibold hover:bg-slate-100">Ver detalhes</button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}