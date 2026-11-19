import { AIInsightsCard } from '@/components/features/Simulation/SimulationResults/AIInsightCardProps'
import type { SimulationFormData } from '@/data/simulation'
import { useSimulationStorage } from '@/hooks/useSimulationStorage'
import {
 CalendarClock,
 CreditCardIcon,
 Goal,
 Landmark,
 PiggyBank,
 Wallet,
} from 'lucide-react'
import { useParams } from 'react-router-dom'

interface PageHeroProps {
 title: string
 subtitle: string
}

function PageHero({ title, subtitle }: PageHeroProps) {
 return (
  <header className="mb-8">
   <h1 className="text-3xl font-bold">{title}</h1>
   <p className="text-muted-foreground mt-2">{subtitle}</p>
  </header>
 )
}

interface CardProps {
 icon: React.ComponentType<{ className?: string }>
 label: string
 value: string
 subtitle: string
 variant?: 'primary'
}

function Card({ icon: Icon, label, value, subtitle, variant }: CardProps) {
 return (
  <article
   className={
    variant === 'primary'
     ? 'bg-primary text-primary-foreground rounded-2xl p-5 shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)]'
     : 'bg-card rounded-2xl p-5 shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)]'
   }
  >
   <div className="mb-3 flex items-center gap-2">
    <Icon className="size-5" />
    <span className="text-sm font-medium">{label}</span>
   </div>
   <strong className="block text-2xl">{value}</strong>
   <span className="mt-1 block text-sm opacity-80">{subtitle}</span>
  </article>
 )
}

function parseCurrency(value: string) {
 return Number(value.replace(/[^0-9,-]/g, '').replace(',', '.'))
}

function calcMonthlySavings(data: SimulationFormData) {
 const income = parseCurrency(data.income)
 const expenses = parseCurrency(data.expenses)
 const debts = parseCurrency(data.debts)
 const goalAmount = parseCurrency(data.goalAmount)
 const deadline = Number(data.goalDeadline)

 if (!deadline || Number.isNaN(deadline)) return 0

 const goalMonthlySavings = goalAmount / deadline
 return Math.max(income - expenses - debts - goalMonthlySavings, 0)
}

export function SimulationResultsPage() {
 const { id } = useParams<{ id: string }>()
 const { getFormData } = useSimulationStorage()

 const data = id ? getFormData(id) : null

 if (!data) {
  return <p>Simulação não encontrada.</p>
 }

 const monthlySavings = calcMonthlySavings(data)

 return (
  <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
   <PageHero
    title="Resultado da sua simulação"
    subtitle="Com base no seu perfil financeiro e objetivos."
   />
   <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
    <Card
     icon={Goal}
     label="Custo da Meta"
     value={data.goalAmount}
     subtitle={data.goalName}
    />
    <Card
     icon={CalendarClock}
     label="Prazo"
     value={`${data.goalDeadline} meses`}
     subtitle="Prazo para atingir a meta"
    />
    <Card
     variant="primary"
     icon={PiggyBank}
     label="Economia mensal"
     value={`R$ ${monthlySavings.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
     subtitle="Economia mensal necessária"
    />
   </div>
   <div className="grid gap-6 lg:grid-cols-3">
    <AIInsightsCard simulationId={data.id} />
    <div className="order-1 flex flex-col gap-6 lg:order-2">
     <Card
      icon={Wallet}
      label="Renda mensal"
      value={data.income}
      subtitle="Renda total bruta por mês"
     />
     <Card
      icon={CreditCardIcon}
      label="Custos Fixos de Vida"
      value={data.expenses}
      subtitle="Gastos essenciais por mês"
     />
     <Card
      icon={Landmark}
      label="Dívidas / Parcelas"
      value={data.debts}
      subtitle="Valor comprometido em parcelas/depósito"
     />
    </div>
   </div>
  </main>
 )
}
