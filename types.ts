/**
 * DEFINIÇÕES DE TIPOS E REGRAS DE NEGÓCIO
 * Aqui centralizamos como os dados devem parecer em todo o sistema.
 */

// Estados possíveis de um chamado de manutenção
export enum TicketStatus {
  OPEN = 'Aberto',            // Aguardando triagem
  IN_PROGRESS = 'Em Atendimento', // Técnico já está no local ou trabalhando
  DONE = 'Concluído',         // Problema resolvido
  DELAYED = 'Atrasado'        // Passou do prazo estipulado
}

// Níveis de urgência para priorização automática e manual
export enum Priority {
  LOW = 'Baixa',
  MEDIUM = 'Média',
  HIGH = 'Alta',
  CRITICAL = 'Crítica' // Risco de vida ou parada total de setor acadêmico
}

// Categorias de serviço disponíveis na infraestrutura da UEMA
export enum Category {
  AC_REPAIR = 'Manutenção Ar-condicionado',
  AC_CLEANING = 'Limpeza Ar-condicionado',
  HYDRAULIC = 'Hidráulica/Banheiros',
  REFORM = 'Reforma Civil',
  ELECTRICAL = 'Elétrica',
  OTHER = 'Outros'
}

// Estrutura principal de um Chamado (Ticket)
export interface Ticket {
  id: string;             // Identificador único (ID)
  title: string;          // Resumo do problema
  description: string;    // Detalhes textuais
  category: Category;     // Tipo de serviço
  priority: Priority;     // Urgência
  status: TicketStatus;   // Estado atual
  campus: string;         // Unidade da UEMA
  building: string;       // Nome do prédio
  room: string;           // Sala específica
  requesterName: string;  // Quem abriu o chamado
  createdAt: string;      // Data de criação (formato ISO)
  updatedAt?: string;     // Última atualização
  completedAt?: string;   // Data de fechamento
  imageUrl?: string;      // Link ou Base64 da foto do problema
}

// Estrutura da solução técnica sugerida pela Inteligência Artificial
export interface AISolution {
  ticketId: string;       // ID do chamado original
  ticketTitle: string;    // Título para referência rápida
  diagnostic: string;     // O que a IA acha que está acontecendo
  stepByStep: string[];   // Lista de instruções para o técnico
}

// Resposta completa processada pela IA Gemini
export interface AIAnalysisResult {
  summary: string;              // Resumo geral da situação da infraestrutura
  hotspots: string[];           // Locais ou tipos de problemas recorrentes
  preventiveActions: string[];  // Sugestões para evitar novos problemas
  specificSolutions: AISolution[]; // Lista de resoluções técnicas por chamado
  trends: string;               // Tendências (ex: "Aumento de problemas com calor")
}

// Tipos de usuários permitidos no protótipo
export enum UserRole {
  REQUESTER = 'Solicitante', // Professores, alunos e funcionários
  MANAGER = 'Gestor'         // Equipe de infraestrutura e engenharia
}