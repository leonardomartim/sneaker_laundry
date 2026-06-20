import { useOrcamento } from '../hooks/useOrcamento';

export function OrcamentoForm() {
  const {
    formData,
    loadingCep,
    isSubmitting,
    submitStatus,
    statusMessage,
    handleInputChange,
    handleCepBlur,
    handleSubmit
  } = useOrcamento();

  return (
    <section id="orcamento" className="py-20 bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700">Nome</label>
                <input required type="text" name="nome" value={formData.nome} onChange={handleInputChange} className="mt-1 block w-full rounded-md border border-slate-300 p-3" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Sobrenome</label>
                <input required type="text" name="sobrenome" value={formData.sobrenome} onChange={handleInputChange} className="mt-1 block w-full rounded-md border border-slate-300 p-3" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">E-mail</label>
              <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="mt-1 block w-full rounded-md border border-slate-300 p-3" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="sm:col-span-1">
                <label className="block text-sm font-medium text-slate-700">CEP</label>
                <input required type="text" name="cep" value={formData.cep} onChange={handleInputChange} onBlur={handleCepBlur} maxLength={9} disabled={loadingCep} className="mt-1 block w-full rounded-md border border-slate-300 p-3" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700">Cidade</label>
                <input required type="text" name="cidade" value={formData.cidade} onChange={handleInputChange} className="mt-1 block w-full rounded-md border border-slate-300 p-3 bg-slate-50" readOnly />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700">Bairro</label>
                <input required type="text" name="bairro" value={formData.bairro} onChange={handleInputChange} className="mt-1 block w-full rounded-md border border-slate-300 p-3 bg-slate-50" readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Rua</label>
                <input required type="text" name="rua" value={formData.rua} onChange={handleInputChange} className="mt-1 block w-full rounded-md border border-slate-300 p-3 bg-slate-50" readOnly />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Número</label>
              <input required type="text" name="numero" value={formData.numero} onChange={handleInputChange} className="mt-1 block w-full rounded-md border border-slate-300 p-3" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Quantidade de Pares</label>
              <select name="quantidade_pares" value={formData.quantidade_pares} onChange={handleInputChange} className="mt-1 block w-full rounded-md border border-slate-300 p-3 bg-white outline-none focus:border-blue-600">
                <option value="1 Par">1 Par</option>
                <option value="2 Pares">2 Pares</option>
                <option value="3 Pares">3 Pares</option>
                <option value="4 Pares">4 Pares</option>
                <option value="5 Pares">5 Pares</option>
                <option value="6 a 9 Pares">6 a 9 Pares</option>
                <option value="10 Pares ou +">10 Pares ou +</option>
              </select>
            </div>

            {submitStatus !== 'idle' && (
              <div
                role="status"
                className={`rounded-md p-4 text-sm font-medium ${
                  submitStatus === 'success'
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {statusMessage}
              </div>
            )}

            <button type="submit" disabled={isSubmitting} className="w-full py-3 px-4 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition disabled:opacity-70 disabled:cursor-not-allowed">
              {isSubmitting ? 'Enviando...' : 'Enviar Solicitação'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}