"use client"

import { ToastProvider } from '@/components/ui/toast'

interface ProvidersProps {
  children: React.ReactNode
}

const Providers = ({ children }: ProvidersProps) => {
  return <ToastProvider>{children}</ToastProvider>
}

export default Providers