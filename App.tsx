import React, { useState, useEffect } from 'react';
import { HashRouter } from 'react-router-dom';
import Layout from './components/Layout';
import TicketForm from './components/TicketForm';
import TicketList from './components/TicketList';
import Dashboard from './components/Dashboard';
import { Ticket, UserRole, TicketStatus } from './types';
import { INITIAL_TICKETS } from './services/mockData';

/**
 * COMPONENTE PRINCIPAL (App)
 * Gerencia o estado global, a navegação interna e as permissões de acesso.
 */

function App() {
  // Estado que guarda todos os chamados ativos no sistema
  const [tickets, setTickets] = useState<Ticket[]>([]);
  
  // Perfil atual (Gestor vê tudo, Solicitante só abre chamados)
  const [currentRole, setCurrentRole] = useState<UserRole>(UserRole.MANAGER);
  
  // Controla qual página/aba está ativa no momento
  const [currentView, setCurrentView] = useState<'dashboard' | 'list' | 'new'>('dashboard');

  // Inicializa o sistema com dados fictícios ao carregar a página
  useEffect(() => {
    setTickets(INITIAL_TICKETS);
  }, []);

  // Função para adicionar um novo chamado à lista global
  const handleCreateTicket = (ticket: Ticket) => {
    // Adiciona o novo ticket no topo da lista (spread operator)
    setTickets([ticket, ...tickets]);
    
    // Simula uma transição suave: após 2 segundos (tempo do feedback de sucesso),
    // leva o usuário para a lista de chamados para ele ver o que acabou de criar.
    setTimeout(() => setCurrentView('list'), 2000);
  };

  // Função para atualizar o status de um chamado (ex: de Aberto para Em Atendimento)
  const handleUpdateStatus = (id: string, newStatus: TicketStatus) => {
    setTickets(prev => prev.map(t => 
      t.id === id 
        ? { 
            ...t, 
            status: newStatus, 
            updatedAt: new Date().toISOString(),
            // Se o status for "Concluído", salva o horário exato da finalização
            completedAt: newStatus === TicketStatus.DONE ? new Date().toISOString() : undefined 
          } 
        : t
    ));
  };

  // Lógica de "Roteamento" Manual: Define o que exibir no corpo do site
  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        // Apenas Gestores podem ver o Dashboard de métricas
        return currentRole === UserRole.MANAGER ? (
          <Dashboard tickets={tickets} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <p>Acesso restrito a gestores. Por favor, use a aba "Meus Chamados".</p>
            <button onClick={() => setCurrentView('list')} className="mt-4 text-blue-600 underline">Ir para meus chamados</button>
          </div>
        );
      case 'new':
        // Formulário para abertura de novos incidentes
        return <TicketForm onSubmit={handleCreateTicket} />;
      case 'list':
        // Listagem geral com filtros e busca
        return <TicketList tickets={tickets} role={currentRole} onUpdateStatus={handleUpdateStatus} />;
      default:
        return <Dashboard tickets={tickets} />;
    }
  };

  return (
    <HashRouter>
      {/* O componente Layout envolve todo o conteúdo, provendo a Sidebar e Header */}
      <Layout 
        currentRole={currentRole} 
        setCurrentRole={(role) => {
          setCurrentRole(role);
          // Segurança: Se mudar para solicitante enquanto estiver no Dashboard, expulsa para a lista
          if (role === UserRole.REQUESTER && currentView === 'dashboard') {
            setCurrentView('list');
          }
        }}
        currentView={currentView}
        setCurrentView={setCurrentView}
      >
        {/* Renderiza o componente decidido na função renderContent() */}
        {renderContent()}
      </Layout>
    </HashRouter>
  );
}

export default App;