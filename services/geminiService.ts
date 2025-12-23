import { GoogleGenAI, Type } from "@google/genai";
import { Ticket, AIAnalysisResult } from "../types";

/**
 * SERVIÇO DE INTELIGÊNCIA ARTIFICIAL (GEMINI)
 * Este arquivo conecta o sistema ao cérebro do Google para analisar chamados.
 */

// Limpa os dados dos chamados para enviar apenas o necessário para a IA (economiza tokens)
const processTicketsForAI = (tickets: Ticket[]) => {
  return tickets.map(t => ({
    id: t.id,
    title: t.title,
    category: t.category,
    status: t.status,
    campus: t.campus,
    building: t.building,
    room: t.room,
    description: t.description,
    createdAt: t.createdAt
  }));
};

export const analyzeMaintenanceData = async (tickets: Ticket[]): Promise<AIAnalysisResult> => {
  try {
    // Inicializa a IA usando a chave de ambiente segura
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Converte os chamados em uma string JSON para o prompt
    const dataSummary = JSON.stringify(processTicketsForAI(tickets));

    // PROMPT ENGINEERING: Instruímos a IA a agir como um engenheiro especialista da UEMA
    const prompt = `
      Você é um Engenheiro de Manutenção Predial Sênior da UEMA.
      Analise os chamados abaixo e forneça diagnósticos técnicos e soluções passo a passo.
      
      Lista de Chamados:
      ${dataSummary}

      Instruções Específicas:
      1. Para cada chamado aberto ou em atraso, identifique a causa provável.
      2. Forneça uma solução técnica "Step-by-Step" (Passo a Passo).
      3. Identifique hotspots (locais críticos) e tendências sazonais no Maranhão (calor intenso, umidade).
    `;

    // Chama o modelo Gemini 3 Flash (equilíbrio entre velocidade e inteligência)
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json', // Força a IA a responder em formato JSON
        // Define o esquema exato que a IA deve seguir para não quebrar o frontend
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            hotspots: { type: Type.ARRAY, items: { type: Type.STRING } },
            preventiveActions: { type: Type.ARRAY, items: { type: Type.STRING } },
            trends: { type: Type.STRING },
            specificSolutions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  ticketId: { type: Type.STRING },
                  ticketTitle: { type: Type.STRING },
                  diagnostic: { type: Type.STRING },
                  stepByStep: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["ticketId", "ticketTitle", "diagnostic", "stepByStep"]
              }
            }
          },
          required: ["summary", "hotspots", "preventiveActions", "trends", "specificSolutions"]
        }
      }
    });

    // Extrai o texto da resposta (que será um JSON válido conforme o esquema acima)
    const text = response.text;
    if (!text) throw new Error("Sem resposta da IA");

    // Converte a string da IA em um objeto Javascript utilizável
    return JSON.parse(text) as AIAnalysisResult;

  } catch (error) {
    // Tratamento de erro: se a IA falhar, o sistema continua funcionando com dados vazios
    console.error("Erro na análise de IA:", error);
    return {
      summary: "Não foi possível gerar a análise técnica no momento. Verifique sua conexão.",
      hotspots: [],
      preventiveActions: ["Revisar conexão com a API Gemini."],
      specificSolutions: [],
      trends: "Indisponível"
    };
  }
};