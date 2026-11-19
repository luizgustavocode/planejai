import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { type SimulationRecord } from '@/data/simulation'
import { useSimulationStorage } from '../hooks/useSimulationStorage'

export function SimulationHistoryPage() {
 const navigate = useNavigate()
 const { getAllSimulations, deleteSimulation } = useSimulationStorage()
 const [simulations, setSimulations] = useState<SimulationRecord[]>([])

 useEffect(() => {
  setSimulations(getAllSimulations())
 }, [])

 const handleDelete = (id: string) => {
  deleteSimulation(id)
  setSimulations((prev) => prev.filter((item) => item.id !== id))
 }

 return (
  <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
   <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div>
     <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
      Histórico de Simulações
     </h1>
     <p className="mt-1 text-sm opacity-80">
      Veja suas simulações salvas, abra os detalhes ou exclua itens do
      histórico.
     </p>
    </div>

    <Link
     to="/"
     className="inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium ring-1 ring-current transition hover:opacity-85"
    >
     Nova simulação
    </Link>
   </div>

   {simulations.length === 0 ? (
    <div className="rounded-xl border border-dashed p-10 text-center">
     <p className="text-base font-medium">Nenhuma simulação salva ainda.</p>
     <p className="mt-1 text-sm opacity-75">
      Faça uma simulação para ver o resumo e o diagnóstico aqui.
     </p>
     <Link
      to="/"
      className="mt-5 inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium ring-1 ring-current transition hover:opacity-85"
     >
      Criar simulação
     </Link>
    </div>
   ) : (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
     {simulations.map((simulation, index) => (
      <article
       key={simulation.id}
       className="flex flex-col justify-between rounded-2xl border p-5 shadow-sm transition hover:shadow-md"
      >
       <div>
        <div className="mb-3 flex items-center justify-between gap-2">
         <span className="text-xs font-semibold tracking-wider uppercase opacity-70">
          Simulação #{simulations.length - index}
         </span>
         <span className="text-xs opacity-75">
          {simulation.goalDeadline} meses
         </span>
        </div>

        <h2 className="mb-4 text-lg font-bold">{simulation.goalName}</h2>

        <dl className="space-y-2 text-sm">
         <div className="flex items-center justify-between gap-2">
          <dt className="opacity-75">Custo da Meta</dt>
          <dd className="font-semibold">{simulation.goalAmount}</dd>
         </div>
         <div className="flex items-center justify-between gap-2">
          <dt className="opacity-75">Renda mensal</dt>
          <dd className="font-semibold">{simulation.income}</dd>
         </div>
         <div className="flex items-center justify-between gap-2">
          <dt className="opacity-75">Custos Fixos</dt>
          <dd className="font-semibold">{simulation.expenses}</dd>
         </div>
         <div className="flex items-center justify-between gap-2">
          <dt className="opacity-75">Dívidas / Parcelas</dt>
          <dd className="font-semibold">{simulation.debts}</dd>
         </div>
        </dl>
       </div>

       <div className="mt-6 flex items-center justify-between gap-3 border-t pt-4">
        <button
         type="button"
         onClick={() => handleDelete(simulation.id)}
         className="rounded-lg px-3 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
        >
         Excluir
        </button>

        <button
         type="button"
         onClick={() => navigate(`/resultado/${simulation.id}`)}
         className="rounded-lg px-4 py-2 text-sm font-semibold ring-1 ring-current transition hover:opacity-85"
        >
         Ver detalhes
        </button>
       </div>
      </article>
     ))}
    </div>
   )}
  </section>
 )
}
