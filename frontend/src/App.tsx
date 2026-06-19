import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Portfolio } from './components/Portfolio';
import { OrcamentoForm } from './features/Orcamento/components/OrcamentoForm';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Header />
      <Hero />
      <Portfolio />
      <OrcamentoForm />
      <Footer />
    </div>
  );
}