import React, { type ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
}

function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`rounded-2xl border-2 border-brand-purple gradient-card p-8 shadow-2xl backdrop-blur-xl ${className}`}
    >
      {children}
    </div>
  )
}

export default Card
