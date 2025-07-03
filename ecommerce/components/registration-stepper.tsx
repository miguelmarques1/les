interface RegistrationStepperProps {
  currentStep: number
  totalSteps: number
}

export default function RegistrationStepper({ currentStep, totalSteps }: RegistrationStepperProps) {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1)

  return (
    <div className="flex items-center justify-between">
      {steps.map((step) => (
        <div key={step} className="flex items-center">
          {/* Step circle */}
          <div
            className={`flex items-center justify-center h-8 w-8 rounded-full ${
              step === currentStep
                ? "bg-amber-500 text-white"
                : step < currentStep
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-600"
            }`}
          >
            {step < currentStep ? "✓" : step}
          </div>

          {/* Step label */}
          <div className="ml-2 hidden sm:block">
            <p className={`text-sm ${step === currentStep ? "font-medium text-amber-700" : "text-gray-600"}`}>
              {step === 1 ? "Dados Pessoais" : step === 2 ? "Endereço de Cobrança" : "Endereço de Entrega"}
            </p>
          </div>

          {/* Connector line */}
          {step < totalSteps && (
            <div className="flex-1 h-1 mx-4 bg-gray-200">
              <div className={`h-full ${step < currentStep ? "bg-green-500" : "bg-gray-200"}`}></div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
