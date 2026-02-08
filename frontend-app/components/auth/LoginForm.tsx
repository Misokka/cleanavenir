import { authManager } from '@/features/auth/auth';
import { LoginDTO } from '@/features/auth/login.dto';
import React, { SyntheticEvent, useState } from 'react'

function LoginForm() {
  const [credentials, setCredentials] = useState<LoginDTO>({
    email: "",
    password: "",
  })
 
  const [error, setError] = useState("");

  async function handleSubmit (e: SyntheticEvent) {
    e.preventDefault();
    setError("");
    try {
      const response = await authManager.login(credentials);
      if (!response.ok) {
        throw new Error("Identifiants invalides");
      }
    } catch (err: any) {
      setError(err.message || "Erreur lors de la connexion");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={credentials.email}
            onChange={e => setCredentials({ ...credentials, email: e.target.value })}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Mot de passe</label>
          <input
            type="password"
            id="password"
            value={credentials.password}
            onChange={e => setCredentials({ ...credentials, password: e.target.value })}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Se connecter</button>
      </form>
    </>
  )
}

export default LoginForm