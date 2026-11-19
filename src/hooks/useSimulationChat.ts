import { useCallback, useEffect, useRef, useState } from 'react'
import { useSimulationStorage } from '@/hooks/useSimulationStorage'
import { askFinancialEducator, type ChatMessage } from '@/services/aiServices'

const getChatStorageKey = (simulationId: string) =>
 `simulation-chat:${simulationId}`

const readStoredMessages = (simulationId: string): ChatMessage[] => {
 if (!simulationId) return []
 try {
  const raw = localStorage.getItem(getChatStorageKey(simulationId))
  if (!raw) return []
  const parsed = JSON.parse(raw) as unknown
  return Array.isArray(parsed) ? (parsed as ChatMessage[]) : []
 } catch {
  return []
 }
}

const writeStoredMessages = (simulationId: string, messages: ChatMessage[]) => {
 if (!simulationId) return
 localStorage.setItem(getChatStorageKey(simulationId), JSON.stringify(messages))
}

export const useSimulationChat = (simulationId: string) => {
 const { getFormData } = useSimulationStorage()

 const [messages, setMessages] = useState<ChatMessage[]>(() =>
  readStoredMessages(simulationId),
 )
 const [isSending, setIsSending] = useState(false)
 const [error, setError] = useState<string | null>(null)

 const isSendingRef = useRef(false)
 const messagesEndRef = useRef<HTMLDivElement | null>(null)

 useEffect(() => {
  setMessages(readStoredMessages(simulationId))
  setError(null)
 }, [simulationId])

 useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
 }, [messages, isSending])

 const sendMessage = useCallback(
  async (question: string) => {
   const trimmedQuestion = question.trim()
   if (!trimmedQuestion || isSendingRef.current) return

   const simulation = getFormData(simulationId)
   if (!simulation) {
    setError('Simulação não encontrada.')
    return
   }

   isSendingRef.current = true
   setIsSending(true)
   setError(null)

   const userMessage: ChatMessage = {
    id: crypto.randomUUID(),
    role: 'user',
    content: trimmedQuestion,
    createdAt: new Date().toISOString(),
   }

   const currentHistory = readStoredMessages(simulationId)
   const historyWithUser: ChatMessage[] = [...currentHistory, userMessage]

   setMessages(historyWithUser)
   writeStoredMessages(simulationId, historyWithUser)

   const formattedHistory = currentHistory
    .map(
     (msg) =>
      `${msg.role === 'user' ? 'Utilizador' : 'Educador Financeiro'}: ${msg.content}`,
    )
    .join('\n')

   const prompt = [
    'És um educador financeiro claro, prático e objetivo.',
    'Responde à pergunta do utilizador com base exclusivamente nos dados da simulação abaixo.',
    '',
    'Dados da simulação:',
    `- Meta: ${simulation.goalName} (${simulation.goalAmount}) em ${simulation.goalDeadline} meses`,
    `- Renda mensal: ${simulation.income}`,
    `- Custos fixos: ${simulation.expenses}`,
    `- Dívidas / parcelas: ${simulation.debts}`,
    formattedHistory ? `\nHistórico da conversa:\n${formattedHistory}` : '',
    `\nNova pergunta do utilizador: ${trimmedQuestion}`,
   ]
    .filter(Boolean)
    .join('\n')

   try {
    const replyText = await askFinancialEducator(prompt)

    const assistantMessage: ChatMessage = {
     id: crypto.randomUUID(),
     role: 'assistant',
     content: replyText,
     createdAt: new Date().toISOString(),
    }

    const updatedMessages: ChatMessage[] = [
     ...historyWithUser,
     assistantMessage,
    ]
    setMessages(updatedMessages)
    writeStoredMessages(simulationId, updatedMessages)
   } catch {
    setError(
     'Não foi possível obter a resposta do educador financeiro. Tente novamente.',
    )
   } finally {
    isSendingRef.current = false
    setIsSending(false)
   }
  },
  [getFormData, simulationId],
 )

 return {
  messages,
  isSending,
  error,
  sendMessage,
  messagesEndRef,
 }
}
