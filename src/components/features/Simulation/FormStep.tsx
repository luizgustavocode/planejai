import { ArrowLeft, ArrowRight, type LucideIcon } from 'lucide-react'
import { Button } from '@/components/shared/Button'
import { Input, type InputProps } from '@/components/shared/input'
import { useState, type SyntheticEvent } from 'react'
import { formatCurrencyMask } from '@/utils/currency'

export interface FormStepProps {
 id: string
 icon: LucideIcon
 title: string
 question: string
 inputProps: InputProps
 onBack?: () => void
 onNext?: (value: string) => void
 hideBackButton?: boolean
 submitButtonProps?: {
  label: string
  emojiIcon?: string
 }
}

export interface ActionsButtonsProps {
 onBack: () => void
 onNext: (value: string) => void
 hideBackButton?: boolean
}

export function FormStep({
 icon: Icon,
 title,
 question,
 inputProps,
 submitButtonProps,
 hideBackButton,
 onBack,
 onNext,
}: FormStepProps) {
 const [inputValue, setInputValue] = useState('')

 const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
  e.preventDefault()
  if (onNext) {
   onNext(inputValue)
  }
 }

 return (
  <div className="bg-card rounded-2xl p-6 shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)] sm:p-8">
   <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-purple-600">
    <Icon size={32} className="text-white" />
   </div>
   <h2 className="mb-1 text-xs font-semibold tracking-widest text-purple-600 uppercase">
    {title}
   </h2>
   <h3 className="text-foreground mb-6 text-xl leading-snug font-semibold sm:text-2xl">
    {question}
   </h3>
   <form onSubmit={handleSubmit} className="flex flex-col gap-4">
    <Input
     {...inputProps}
     value={inputValue}
     onChange={(e) =>
      setInputValue(
       inputProps.prefix === 'R$'
        ? formatCurrencyMask(e.target.value)
        : e.target.value,
      )
     }
    />
    <div className="mt-4 flex w-full flex-col gap-3 sm:flex-row sm:gap-6">
     {hideBackButton && (
      <Button
       type="button"
       onClick={onBack}
       icon={ArrowLeft}
       className="order-2 flex-1 justify-center rounded-xl py-3 sm:order-1"
       variant="ghost"
      >
       Voltar
      </Button>
     )}

     <Button
      type="submit"
      variant="primary"
      icon={!submitButtonProps ? ArrowRight : undefined}
      className="order-1 flex flex-1 items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-purple-700 sm:order-2"
     >
      {submitButtonProps?.label ?? 'Próximo'}
      {submitButtonProps?.emojiIcon}
     </Button>
    </div>
   </form>
  </div>
 )
}
