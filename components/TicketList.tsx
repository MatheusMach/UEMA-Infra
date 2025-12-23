import React, { useState } from 'react';
import { Ticket, TicketStatus, UserRole, Priority } from '../types';
import { Search, Filter, MapPin, Calendar, User, Tag, AlertTriangle } from 'lucide-react';

interface TicketListProps {
  tickets: Ticket[];
  role: UserRole;
  onUpdateStatus: (id: string, newStatus: TicketStatus) => void;
}

const TicketList: React.FC<TicketListProps> = ({ tickets, role, onUpdateStatus }) => {
  // Estado para filtros e busca
  const [filter, setFilter] = useState('TODOS');
  const [searchTerm, setSearchTerm] = useState('');

  // Lógica de filtragem dos chamados
  const filteredTickets = tickets.filter(t => {
    const matchesFilter = filter === 'TODOS' || t.status === filter;
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.building.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.id.includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold text-gray-800">Meus Chamados</h2>
           <p className="text-gray-500">Acompanhe o status das solicitações.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar chamado (título, prédio ou ID)..." 
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-full focus:ring-2 focus:ring-blue-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-500" />
            <select 
              className="border border-gray-300 rounded-lg py-2 px-3 text-sm bg-white outline-none"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="TODOS">Todos os Status</option>
              {Object.values(TicketStatus).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredTickets.length === 0 ? (
           <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300 text-gray-400">
             Nenhum chamado encontrado com os critérios atuais.
           </div>
        ) : (
          filteredTickets.map(ticket => (
            <div key={ticket.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                     <div>
                       <span className="text-xs font-mono text-gray-400">#{ticket.id}</span>
                       <h3 className="font-semibold text-lg text-gray-800 mt-1">{ticket.title}</h3>
                       
                       {/* Badge de Categoria */}
                       <div className="mt-2 flex items-center gap-2">
                         {/* Correção: text-slate-700 alterado para text-gray-800 para garantir contraste */}
                         <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                            <Tag size={12} />
                            {ticket.category}
                         </span>
                       </div>
                     </div>

                     <div className="flex flex-col items-end gap-2">
                        {/* Status do Chamado */}
                        <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ml-2
                          ${ticket.status === TicketStatus.OPEN ? 'bg-red-100 text-red-700' :
                            ticket.status === TicketStatus.DONE ? 'bg-green-100 text-green-700' :
                            ticket.status === TicketStatus.IN_PROGRESS ? 'bg-amber-100 text-amber-700' :
                            'bg-gray-100 text-gray-600'}
                        `}>
                          {ticket.status}
                        </span>

                        {/* Indicador de Prioridade */}
                        <span className={`flex items-center gap-1 text-xs font-bold
                            ${ticket.priority === Priority.CRITICAL || ticket.priority === Priority.HIGH ? 'text-red-600' : 
                              ticket.priority === Priority.MEDIUM ? 'text-amber-600' : 'text-green-600'}
                        `}>
                            <AlertTriangle size={12} />
                            {ticket.priority}
                        </span>
                     </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mt-3 mb-4">{ticket.description}</p>
                  
                  <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <MapPin size={14} />
                      <span>{ticket.campus} - {ticket.building}, {ticket.room}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      {/* Formatação explícita para PT-BR */}
                      <span>{new Date(ticket.createdAt).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User size={14} />
                      <span>{ticket.requesterName}</span>
                    </div>
                  </div>

                  {ticket.imageUrl && (
                    <div className="mt-4">
                      <img src={ticket.imageUrl} alt="Evidência do problema" className="h-20 w-20 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-80" />
                    </div>
                  )}
                </div>

                {role === UserRole.MANAGER && (
                  <div className="flex md:flex-col gap-2 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-4 min-w-[140px] justify-center">
                    <p className="text-xs text-gray-400 font-medium mb-1 hidden md:block">Ações do Gestor</p>
                    {ticket.status !== TicketStatus.IN_PROGRESS && ticket.status !== TicketStatus.DONE && (
                      <button 
                        onClick={() => onUpdateStatus(ticket.id, TicketStatus.IN_PROGRESS)}
                        className="text-xs bg-blue-50 text-blue-600 px-3 py-2 rounded hover:bg-blue-100 font-medium transition-colors"
                      >
                        Iniciar Atendimento
                      </button>
                    )}
                    {ticket.status !== TicketStatus.DONE && (
                       <button 
                         onClick={() => onUpdateStatus(ticket.id, TicketStatus.DONE)}
                         className="text-xs bg-green-50 text-green-600 px-3 py-2 rounded hover:bg-green-100 font-medium transition-colors"
                       >
                         Concluir Chamado
                       </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TicketList;