import { useState } from 'react';
import type { FormData } from '../../../types';

export function useOrcamento() {
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    sobrenome: '',
    email: '',
    cep: '',
    cidade: '',
    bairro: '',
    rua: '',
    numero: '',
    quantidade_pares: '1 Par'
  });

  const [loadingCep, setLoadingCep] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCepValid, setIsCepValid] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'cep') {
      setIsCepValid(false);
    }
  };

  const handleCepBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, '');
    
    if (cep.length !== 8) {
      setSubmitStatus('error');
      setStatusMessage("O CEP deve conter exatamente 8 números.");
      setIsCepValid(false);
      return;
    }

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        setSubmitStatus('error');
        setStatusMessage("CEP inválido ou inexistente. Verifique os números digitados.");
        setIsCepValid(false);
        setFormData(prev => ({ ...prev, rua: '', bairro: '', cidade: '' }));
      } else {
        setIsCepValid(true);
        if (submitStatus === 'error') {
          setSubmitStatus('idle');
          setStatusMessage('');
        }
        setFormData(prev => ({
          ...prev,
          rua: data.logradouro || '',
          bairro: data.bairro || '',
          cidade: data.localidade || '',
        }));
      }
    } catch {
      setSubmitStatus('error');
      setStatusMessage("Erro ao buscar o CEP na base de dados.");
      setIsCepValid(false);
    } finally {
      setLoadingCep(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (formData.nome.trim().length < 3) {
      setSubmitStatus('error');
      setStatusMessage("O nome deve conter pelo menos 3 letras.");
      return;
    }

    if (formData.sobrenome.trim().length < 3) {
      setSubmitStatus('error');
      setStatusMessage("O sobrenome deve conter pelo menos 3 letras.");
      return;
    }

    if (!emailRegex.test(formData.email.trim())) {
      setSubmitStatus('error');
      setStatusMessage("Insira um endereço de e-mail válido.");
      return;
    }

    if (!isCepValid) {
      setSubmitStatus('error');
      setStatusMessage("Por favor, informe um CEP existente antes de enviar a solicitação.");
      return;
    }

    if (formData.numero.trim().length === 0) {
      setSubmitStatus('error');
      setStatusMessage("O número do endereço é obrigatório.");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch("http://localhost:8000/api/orcamento", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setStatusMessage(data.mensagem || "Solicitação enviada com sucesso! Cheque seu e-mail.");
        setFormData({ nome: '', sobrenome: '', email: '', cep: '', cidade: '', bairro: '', rua: '', numero: '', quantidade_pares: '1 Par' });
        setIsCepValid(false);
      } else {
        setSubmitStatus('error');
        setStatusMessage(data.mensagem || "Ocorreu um erro ao enviar.");
      }
    } catch {
      setSubmitStatus('error');
      setStatusMessage("Servidor indisponível no momento. Tente novamente em alguns instantes.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    loadingCep,
    isSubmitting,
    submitStatus,
    statusMessage,
    handleInputChange,
    handleCepBlur,
    handleSubmit
  };
}