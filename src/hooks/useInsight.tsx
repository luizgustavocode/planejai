import { useCallback, useEffect, useRef, useState } from 'react'
import { useSimulationStorage } from '@/hooks/useSimulationStorage'
import { getInsight, type InsightData } from '@/services/aiServices'

const getInsightStorageKey = (simulationId: string) =>
 `simulation-insight:${simulationId}`

const readStoredInsight = (simulationId: string): InsightData | null => {
 if (!simulationId) return null
 try {
  const raw = localStorage.getItem(getInsightStorageKey(simulationId))
  return raw ? (JSON.parse(raw) as InsightData) : null
 } catch {
  return null
 }
}

const writeStoredInsight = (simulationId: string, data: InsightData) => {
 if (!simulationId) return
 localStorage.setItem(getInsightStorageKey(simulationId), JSON.stringify(data))
}

export const useInsight = (simulationId: string) => {
 const { getFormData } = useSimulationStorage()

 const [insight, setInsight] = useState<InsightData | null>(() =>
  readStoredInsight(simulationId),
 )
 const [isLoading, setIsLoading] = useState<boolean>(
  () => !readStoredInsight(simulationId),
 )
 const [error, setError] = useState<string | null>(null)

 const isFetchingRef = useRef(false)

 const fetchInsight = useCallback(
  async (id: string, forceRefresh = false) => {
   if (!id) return

   if (!forceRefresh) {
    const cached = readStoredInsight(id)
    if (cached) {
     setInsight(cached)
     setIsLoading(false)
     setError(null)
     return
    }
   }

   if (isFetchingRef.current) return

   const simulation = getFormData(id)
   if (!simulation) {
    setError('Simulação não encontrada.')
    setIsLoading(false)
    return
   }

   isFetchingRef.current = true
   setIsLoading(true)
   setError(null)

   const prompt = [
    'Gera um diagnóstico financeiro objetivo com base nos dados abaixo:',
    `- Meta: ${simulation.goalName} (${simulation.goalAmount}) em ${simulation.goalDeadline} meses`,
    `- Renda mensal: ${simulation.income}`,
    `- Custos fixos: ${simulation.expenses}`,
    `- Dívidas / parcelas: ${simulation.debts}`,
   ].join('\n')

   try {
    const result = await getInsight(prompt)
    setInsight(result)
    writeStoredInsight(id, result)
   } catch {
    setError('Não foi possível gerar o insight financeiro.')
   } finally {
    isFetchingRef.current = false
    setIsLoading(false)
   }
  },
  [getFormData],
 )

 useEffect(() => {
  const cached = readStoredInsight(simulationId)
  if (cached) {
   setInsight(cached)
   setIsLoading(false)
   setError(null)
   return
  }

  setInsight(null)
  fetchInsight(simulationId)
 }, [simulationId, fetchInsight])

 return {
  insight,
  isLoading,
  error,
  fetchInsight,
 }
}
