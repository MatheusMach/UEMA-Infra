import React from 'react';
import { UserRole } from '../types';
import { LayoutDashboard, PlusCircle, List, UserCircle, LogOut } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentView: 'dashboard' | 'list' | 'new';
  setCurrentView: (view: 'dashboard' | 'list' | 'new') => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  currentRole, 
  setCurrentRole,
  currentView,
  setCurrentView
}) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar / Mobile Header */}
      <aside className="bg-slate-900 text-white w-full md:w-64 flex-shrink-0 flex flex-col shadow-xl">
        <div className="p-6 border-b border-slate-700 bg-red-800">
          <h1 className="text-xl font-bold tracking-tight">UEMA Infra</h1>
          <p className="text-xs text-red-200 mt-1">Gestão de Manutenção</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {currentRole === UserRole.MANAGER && (
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                currentView === 'dashboard' ? 'bg-red-700 text-white' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <LayoutDashboard size={20} />
              <span>Painel Gerencial</span>
            </button>
          )}

          <button
            onClick={() => setCurrentView('new')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              currentView === 'new' ? 'bg-red-700 text-white' : 'hover:bg-slate-800 text-slate-300'
            }`}
          >
            <PlusCircle size={20} />
            <span>Novo Chamado</span>
          </button>

          <button
            onClick={() => setCurrentView('list')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              currentView === 'list' ? 'bg-red-700 text-white' : 'hover:bg-slate-800 text-slate-300'
            }`}
          >
            <List size={20} />
            <span>Meus Chamados</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center space-x-3 mb-4 px-2">
            <UserCircle className="text-slate-400" />
            <div className="text-sm">
              <p className="font-medium text-white">{currentRole}</p>
              <button 
                onClick={() => setCurrentRole(currentRole === UserRole.MANAGER ? UserRole.REQUESTER : UserRole.MANAGER)}
                className="text-xs text-blue-400 hover:text-blue-300 underline"
              >
                Trocar Perfil
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 p-4 md:p-8 overflow-y-auto h-screen">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;