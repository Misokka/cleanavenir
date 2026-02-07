'use client'
import { useAuth } from '@/context/AuthProvider';
import { authManager } from '@/features/auth/auth';
import { useRouter } from 'next/navigation';

function AppHeader() {
  const { user, updateUser } = useAuth();
  const router = useRouter();

  async function handleLogout(){
    try{
      const response = await authManager.logout();
      if(response.ok) {
        updateUser(null);
        router.push('/auth/login');
      }
    } catch (error: any) {
      console.error('Logout error:', error);
    }
  }
  return (
    <header className='bg-green-200 px-6 py-4 flex items-center justify-between'>
      <p>Header</p>
      {user && <>
        <button onClick={handleLogout} className='bg-red-400 px-6 py-2 rounded-md'>Déconnexion</button>
      </>}
    </header>
  )
}

export default AppHeader