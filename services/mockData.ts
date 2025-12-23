import { Ticket, TicketStatus, Priority, Category } from '../types';

const generateId = () => Math.random().toString(36).substr(2, 9);

const now = new Date();
const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
const tenDaysAgo = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);
const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

export const INITIAL_TICKETS: Ticket[] = [
  {
    id: generateId(),
    title: "Ar-condicionado pingando muito",
    description: "O aparelho split da sala de aula está pingando em cima das carteiras.",
    category: Category.AC_REPAIR,
    priority: Priority.HIGH,
    status: TicketStatus.OPEN,
    campus: "Campus Paulo VI",
    building: "Prédio de História",
    room: "Sala 102",
    requesterName: "Prof. Ana Souza",
    createdAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    title: "Vazamento na pia do banheiro masculino",
    description: "Torneira não fecha, desperdício de água.",
    category: Category.HYDRAULIC,
    priority: Priority.MEDIUM,
    status: TicketStatus.IN_PROGRESS,
    campus: "Campus Paulo VI",
    building: "CCSA",
    room: "Banheiro 1º Andar",
    requesterName: "João Silva (Zelador)",
    createdAt: threeDaysAgo.toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: generateId(),
    title: "Limpeza Preventiva AC",
    description: "Solicito limpeza dos filtros, cheiro de mofo.",
    category: Category.AC_CLEANING,
    priority: Priority.LOW,
    status: TicketStatus.DONE,
    campus: "Campus Paulo VI",
    building: "Reitoria",
    room: "Gabinete",
    requesterName: "Secretaria",
    createdAt: twoWeeksAgo.toISOString(),
    completedAt: tenDaysAgo.toISOString()
  },
  {
    id: generateId(),
    title: "Ar-condicionado não gela",
    description: "Aparelho liga mas só ventila.",
    category: Category.AC_REPAIR,
    priority: Priority.HIGH,
    status: TicketStatus.OPEN,
    campus: "Campus Paulo VI",
    building: "Prédio de História",
    room: "Sala 104",
    requesterName: "Coordenação",
    createdAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    title: "Buraco no gesso do teto",
    description: "Infiltração causou queda de parte do gesso.",
    category: Category.REFORM,
    priority: Priority.MEDIUM,
    status: TicketStatus.DELAYED,
    campus: "Campus CCT",
    building: "Bloco de Engenharia",
    room: "Lab 03",
    requesterName: "Prof. Carlos",
    createdAt: tenDaysAgo.toISOString(),
  }
];