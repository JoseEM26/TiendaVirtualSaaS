"use client"
import React, { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'

// Creamos una sola instancia del cliente de consultas
const queryClient = new QueryClient()


const ThemeProviders = ({ children }: {children:ReactNode}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="bottom-right" />
      
      {children}
    </QueryClientProvider>
  )
}

export default ThemeProviders
