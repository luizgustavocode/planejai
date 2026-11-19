import 'react-loading-skeleton/dist/skeleton.css'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { useState, type FormEvent } from 'react'
import { useInsight } from '@/hooks/useInsight'
import { useSimulationChat } from '@/hooks/useSimulationChat'
import { Content } from '@/components/features/Insights/Content'
import { Error } from '../../Insights/Error'

interface AIInsightCardProps {
 simulationId: string
}

export function AIInsightCard({ simulationId }: AIInsightCardProps) {
 const { insight, isLoading, error, fetchInsight } = useInsight(simulationId)
 const {
  messages,
  isSending,
  error: chatError,
  sendMessage,
  messagesEndRef,
 } = useSimulationChat(simulationId)

 const [question, setQuestion] = useState('')

 const handleSubmit = async (e: FormEvent) => {
  e.preventDefault()
  if (!question.trim() || isSending) return

  const currentQuestion = question
  setQuestion('')
  await sendMessage(currentQuestion)
 }

 return (
  <div className="bg-card order-2 rounded-2xl p-6 shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)] lg:order-1 lg:col-span-2">
   <div className="mb-3 flex items-center justify-between gap-2">
    <div className="flex items-center gap-1.5">
     <span>✨</span>
     <span className="text-primary text-xs font-semibold tracking-widest uppercase">
      Insight Financeiro Personalizado
     </span>
    </div>

    {!isLoading && insight && (
     <button
      type="button"
      onClick={() => fetchInsight(simulationId, true)}
      className="text-xs opacity-70 transition hover:opacity-100"
     >
      Atualizar diagnóstico
     </button>
    )}
   </div>

   {isLoading && (
    <SkeletonTheme baseColor="#1e293b" highlightColor="#334155">
     <div className="space-y-4">
      <Skeleton height={24} width="45%" />
      <Skeleton count={3} height={16} />

      <div className="pt-2">
       <Skeleton height={20} width="35%" className="mb-2" />
       <Skeleton count={3} height={14} />
      </div>

      <div className="pt-2">
       <Skeleton height={20} width="30%" className="mb-2" />
       <Skeleton count={2} height={14} />
      </div>
     </div>
    </SkeletonTheme>
   )}

   {!isLoading && error && (
    <Error
     simulationId={simulationId}
     message={error}
     onRetry={() => fetchInsight(simulationId, true)}
    />
   )}

   {!isLoading && insight && !error && (
    <>
     <Content insight={insight} />

     <div className="mt-6 border-t pt-5">
      <h3 className="mb-3 text-sm font-semibold tracking-wider uppercase opacity-80">
       Conversar com o Educador Financeiro
      </h3>

      <div className="max-h-72 space-y-3 overflow-y-auto rounded-xl border p-3">
       {messages.length === 0 ? (
        <p className="text-sm opacity-70">
         Faça uma pergunta sobre a sua meta, orçamento, custos fixos ou dívidas.
        </p>
       ) : (
        messages.map((msg) => (
         <div
          key={msg.id}
          className={
           msg.role === 'user'
            ? 'bg-primary text-primary-foreground ml-auto max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm'
            : 'mr-auto max-w-[85%] rounded-xl border px-3.5 py-2.5 text-sm whitespace-pre-line'
          }
         >
          <span className="mb-1 block text-[11px] font-semibold opacity-75">
           {msg.role === 'user' ? 'Você' : 'Educador Financeiro'}
          </span>
          {msg.content}
         </div>
        ))
       )}

       {isSending && (
        <p className="text-xs italic opacity-75">
         Educador financeiro a responder...
        </p>
       )}

       <div ref={messagesEndRef} />
      </div>

      {chatError && (
       <p className="mt-2 text-xs font-medium text-red-400">{chatError}</p>
      )}

      <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
       <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ex.: Como posso reduzir o prazo da meta?"
        disabled={isSending}
        className="focus:ring-primary flex-1 rounded-lg border bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 disabled:opacity-50"
       />
       <button
        type="submit"
        disabled={isSending || !question.trim()}
        className="bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-semibold transition hover:opacity-90 disabled:opacity-50"
       >
        {isSending ? 'A enviar...' : 'Enviar'}
       </button>
      </form>
     </div>
    </>
   )}
  </div>
 )
}
