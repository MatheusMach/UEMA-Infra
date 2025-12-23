import React from 'react';
import { Ticket, TicketStatus, Priority, Category } from '../types';
import AIInsights from './AIInsights';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ClipboardList, AlertCircle, CheckSquare, Clock } from 'lucide-react';

interface DashboardProps {
  tickets: Ticket[];
}

const Dashboard: React.FC<DashboardProps> = ({ tickets }) => {
  
  // Cálculo de KPIs (Indicadores Chave de Performance)
  const total = tickets.length;
  const open = tickets.filter(t => t.status === TicketStatus.OPEN).length;
  const critical = tickets.filter(t => t.priority === Priority.CRITICAL || t.priority === Priority.HIGH).length;
  const done = tickets.filter(t => t.status === TicketStatus.DONE).length;

  // Dados para o Gráfico: Distribuição por Status
  // Atenção: As cores seguem o padrão do Tailwind (Red-500, Amber-500, Emerald-500, Gray-500)
  const statusData = [
    { name: 'Aberto', value: open, color: '#EF4444' }, 
    { name: 'Em Atendimento', value: tickets.filter(t => t.status === TicketStatus.IN_PROGRESS).length, color: '#F59E0B' },
    { name: 'Concluído', value: done, color: '#10B981' }, 
    { name: 'Atrasado', value: tickets.filter(t => t.status === TicketStatus.DELAYED).length, color: '#6B7280' },
  ];

  // Dados para o Gráfico: Contagem por Categoria
  const categoryCount = tickets.reduce((acc, ticket) => {
    acc[ticket.category] = (acc[ticket.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryData = Object.keys(categoryCount).map(key => ({
    // Remove prefixos repetitivos para o gráfico ficar mais limpo
    name: key.replace('Manutenção ', '').replace('Limpeza ', ''),
    value: categoryCount[key]
  }));

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Painel Gerencial</h2>
        <p className="text-gray-500">Visão geral da infraestrutura e manutenção predial.</p>
      </div>

      {/* Cartões de KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
            <ClipboardList size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Total Chamados</p>
            <p className="text-2xl font-bold text-gray-800">{total}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-red-100 text-red-600 rounded-full">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Abertos</p>
            <p className="text-2xl font-bold text-gray-800">{open}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-yellow-100 text-yellow-600 rounded-full">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Prioridade Alta</p>
            <p className="text-2xl font-bold text-gray-800">{critical}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-full">
            <CheckSquare size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Concluídos</p>
            <p className="text-2xl font-bold text-gray-800">{done}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Gráfico Principal */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-700 mb-4">Volume de Chamados por Categoria</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{fontSize: 12}} interval={0} />
                <YAxis />
                <Tooltip 
                  cursor={{fill: '#f3f4f6'}}
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  formatter={(value: number) => [`${value} Chamados`, 'Quantidade']}
                />
                <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]}>
                   {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#6366F1'][index % 5]} />
                    ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Seção de Inteligência Artificial */}
        <div className="lg:col-span-1">
          <AIInsights tickets={tickets} />
        </div>
      </div>

      {/* Tabela de Chamados Recentes (Resumida) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
           <h3 className="font-semibold text-gray-700">Chamados Recentes</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">Local</th>
                <th className="px-6 py-3">Problema</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Prioridade</th>
              </tr>
            </thead>
            <tbody>
              {tickets.slice(0, 5).map(t => (
                <tr key={t.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{t.building} - {t.room}</td>
                  <td className="px-6 py-4 truncate max-w-xs">{t.title}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold
                      ${t.status === TicketStatus.OPEN ? 'bg-red-100 text-red-700' :
                        t.status === TicketStatus.DONE ? 'bg-green-100 text-green-700' :
                        'bg-yellow-100 text-yellow-700'}
                    `}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                     <span className={`text-xs font-bold
                      ${t.priority === Priority.HIGH || t.priority === Priority.CRITICAL ? 'text-red-600' : 'text-gray-600'}
                     `}>
                       {t.priority}
                     </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;