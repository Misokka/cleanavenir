export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'client' | 'business' | 'premium';
}

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'client' | 'business' | 'premium';
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  user?: AuthUser;
  token?: string;
  error?: string;
}

const mockUsers: AuthUser[] = [
  {
    id: '1',
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@email.com',
    role: 'client',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    firstName: 'Marie',
    lastName: 'Martin',
    email: 'marie.martin@business.com',
    role: 'business',
    createdAt: '2024-02-01T14:30:00Z'
  }
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockLogin = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  await delay(1500); 
  
  const { email, password } = credentials;
  
  const user = mockUsers.find(u => u.email === email);
  
  if (!user || password !== 'password123') {
    return {
      success: false,
      error: 'Identifiants incorrects'
    };
  }
  
  return {
    success: true,
    user,
    token: `mock-jwt-token-${user.id}-${Date.now()}`
  };
};

export const mockRegister = async (data: RegisterData): Promise<AuthResponse> => {
  await delay(2000); 
  const { firstName, lastName, email, password, confirmPassword, role } = data;
  
  if (password !== confirmPassword) {
    return {
      success: false,
      error: 'Les mots de passe ne correspondent pas'
    };
  }
  
  if (password.length < 8) {
    return {
      success: false,
      error: 'Le mot de passe doit contenir au moins 8 caractères'
    };
  }
  
  const existingUser = mockUsers.find(u => u.email === email);
  if (existingUser) {
    return {
      success: false,
      error: 'Cette adresse e-mail est déjà utilisée'
    };
  }
  
  const newUser: AuthUser = {
    id: `${mockUsers.length + 1}`,
    firstName,
    lastName,
    email,
    role,
    createdAt: new Date().toISOString()
  };
  
  mockUsers.push(newUser);
  
  return {
    success: true,
    user: newUser,
    token: `mock-jwt-token-${newUser.id}-${Date.now()}`
  };
};

export const mockLoginWithRandomError = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  await delay(1000);
  
  if (Math.random() < 0.2) {
    throw new Error('Erreur réseau : impossible de se connecter au serveur');
  }
  
  return mockLogin(credentials);
};