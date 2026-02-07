import RegisterForm from '@/components/auth/RegisterForm'
import React from 'react'

function page() {
  return (
    <div>
      <div className="px-6 py-8">
        <h1>Inscription</h1>
      </div>
      <RegisterForm />
    </div>
  )
}

export default page