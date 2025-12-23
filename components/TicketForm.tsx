import React, { useState } from 'react';
import { Category, Priority, Ticket, TicketStatus } from '../types';
import { Camera, AlertTriangle, MapPin, CheckCircle } from 'lucide-react';

interface TicketFormProps {
  onSubmit: (ticket: Ticket) => void;
}

const TicketForm: React.FC<TicketFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: Category.AC_REPAIR,
    priority: Priority.LOW,
    campus: 'Campus Paulo VI',
    building: '',
    room: '',
    description: '',
    requesterName: ''
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // Manipulador de upload de imagem para preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTicket: Ticket = {
      // Gera ID aleatório simples para protótipo
      id: Math.random().toString(36).substr(2, 9),
      ...formData,
      status: TicketStatus.OPEN,
      createdAt: new Date().toISOString(),
      imageUrl: imagePreview || undefined
    };
    onSubmit(newTicket);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl shadow-sm border text-center h-full">
        <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
          <CheckCircle size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Chamado Aberto com Sucesso!</h2>
        <p className="text-gray-500 mt-2">Sua solicitação foi registrada no sistema da UEMA Infra e será analisada em breve.</p>
        <button 
          onClick={() => {
            setSubmitted(false);
            setFormData({ ...formData, title: '', description: '', building: '', room: '' });
            setImagePreview(null);
          }}
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
        >
          Abrir Novo Chamado
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Novo Chamado de Manutenção</h2>
        <p className="text-gray-500">Preencha os detalhes abaixo para solicitar reparos na infraestrutura.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200 space-y-6">
        
        {/* Informações Básicas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título do Problema</label>
            <input
              required
              type="text"
              placeholder="Ex: Ar-condicionado não gela"
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Serviço</label>
            <select
              className="w-full border border-gray-300 rounded-lg p-2.5 bg-white outline-none"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value as Category})}
            >
              {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Localização */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
          <div className="flex items-center gap-2 mb-3 text-gray-700 font-medium">
            <MapPin size={18} />
            <span>Localização do Incidente</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div>
              <label className="block text-xs text-gray-500 mb-1">Campus</label>
              <select 
                className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-white"
                value={formData.campus}
                onChange={(e) => setFormData({...formData, campus: e.target.value})}
              >
                <option>Campus Paulo VI</option>
                <option>Campus CCT</option>
                <option>Campus CCSA</option>
                <option>Campus Centro Histórico</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Prédio/Bloco</label>
              <input
                required
                type="text"
                placeholder="Ex: Prédio de História"
                className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                value={formData.building}
                onChange={(e) => setFormData({...formData, building: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Sala/Espaço</label>
              <input
                required
                type="text"
                placeholder="Ex: Sala 102"
                className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                value={formData.room}
                onChange={(e) => setFormData({...formData, room: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* Detalhes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descrição Detalhada</label>
          <textarea
            required
            rows={4}
            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-500 outline-none transition-all"
            placeholder="Descreva o problema com o máximo de detalhes para facilitar o atendimento da equipe técnica..."
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prioridade</label>
            <div className="flex items-center gap-2 bg-yellow-50 p-2 rounded border border-yellow-200 text-sm text-yellow-800 mb-2">
               <AlertTriangle size={16} />
               <span>Selecione conforme a urgência real</span>
            </div>
            <select
              className="w-full border border-gray-300 rounded-lg p-2.5 bg-white"
              value={formData.priority}
              onChange={(e) => setFormData({...formData, priority: e.target.value as Priority})}
            >
              {Object.values(Priority).map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Solicitante</label>
             <input
              required
              type="text"
              placeholder="Seu nome completo"
              className="w-full border border-gray-300 rounded-lg p-2.5"
              value={formData.requesterName}
              onChange={(e) => setFormData({...formData, requesterName: e.target.value})}
             />
          </div>
        </div>

        {/* Upload de Imagem */}
        <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">Foto do Problema (Opcional)</label>
           <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors relative cursor-pointer">
              <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
              {imagePreview ? (
                <div className="relative w-full h-48">
                    <img src={imagePreview} alt="Preview da imagem" className="w-full h-full object-contain" />
                    <p className="absolute bottom-2 left-0 right-0 text-center text-xs bg-white/80 py-1">Clique para alterar</p>
                </div>
              ) : (
                <>
                  <Camera size={32} className="mb-2 text-gray-400" />
                  <span className="text-sm">Clique para anexar uma foto</span>
                </>
              )}
           </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button type="submit" className="bg-red-700 text-white px-8 py-3 rounded-lg font-medium hover:bg-red-800 transition-colors shadow-lg flex items-center gap-2">
            <CheckCircle size={18} />
            Registrar Chamado
          </button>
        </div>

      </form>
    </div>
  );
};

export default TicketForm;