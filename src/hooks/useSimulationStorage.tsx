import {
 type SimulationFormData,
 type SimulationRecord,
} from '@/data/simulation'

const LOCAL_STORAGE_KEY = 'simulation-data'

export const useSimulationStorage = () => {
 const readStorage = (): SimulationRecord[] => {
  const storage = localStorage.getItem(LOCAL_STORAGE_KEY)
  if (!storage) return []

  try {
   const parsed = JSON.parse(storage)
   return Array.isArray(parsed) ? (parsed as SimulationRecord[]) : []
  } catch {
   return []
  }
 }

 const saveFormData = (FormData: SimulationFormData) => {
  const id = crypto.randomUUID()
  const record: SimulationRecord = { ...FormData, id }

  const savedData = readStorage()
  localStorage.setItem(
   LOCAL_STORAGE_KEY,
   JSON.stringify([...savedData, record]),
  )

  return id
 }

 const getFormData = (id: string): SimulationRecord | null => {
  const savedData = readStorage()
  return savedData.find((record) => record.id === id) || null
 }

 const getAllSimulations = (): SimulationRecord[] => {
  const savedData = readStorage()
  return [...savedData].reverse()
 }

 const updateSimulation = (id: string, data: SimulationRecord) => {
  const savedData = readStorage()
  const update = savedData.map((record) =>
   record.id === id ? { ...record, ...data, id: record.id } : record,
  )

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(update))
 }

 const deleteSimulation = (id: string) => {
  const savedData = readStorage()
  const filtered = savedData.filter((record) => record.id !== id)
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered))
 }

 return {
  saveFormData,
  getFormData,
  getAllSimulations,
  updateSimulation,
  deleteSimulation,
 }
}
