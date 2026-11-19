import { useState, type ComponentType } from 'react'
import { StepProgress } from './Simulation/Progress'
import { FormStep as FormStepModule } from './Simulation/FormStep'
import { type SimulationFormData, simulationFormSteps } from '@/data/simulation'
import { useSimulationStorage } from '@/hooks/useSimulationStorage'
import { useNavigate } from 'react-router-dom'

const FormStep = FormStepModule as unknown as ComponentType<any>

export const SimulationForm = () => {
 const { saveFormData } = useSimulationStorage()
 const navigate = useNavigate()
 const [currentStepIndex, setCurrentStepIndex] = useState(0)
 const [formData, setFormData] = useState<SimulationFormData>(
  {} as SimulationFormData,
 )
 const currentStep = simulationFormSteps[currentStepIndex]
 const totalSteps = simulationFormSteps.length

 const handleNextStep = (value: string) => {
  const updateFormData = { ...formData, [currentStep.id]: value }
  setFormData(updateFormData)

  console.log(updateFormData)

  if (currentStepIndex + 1 >= totalSteps) {
   const id = saveFormData(updateFormData)
   void navigate(`/resultado/${id}`)
   return
  }

  setCurrentStepIndex((prev: number) => prev + 1)
 }
 function handlePreviousStep(): void {
  throw new Error('Function not implemented.')
 }

 return (
  <>
   <StepProgress currentStep={currentStepIndex + 1} totalSteps={totalSteps} />
   <FormStep
    key={currentStep.id}
    {...currentStep}
    onBack={handlePreviousStep}
    onNext={handleNextStep}
    hideBackButton={currentStepIndex === 0}
   />
  </>
 )
}
