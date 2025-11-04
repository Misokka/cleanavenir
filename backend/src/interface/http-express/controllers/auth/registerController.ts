import { Request, Response } from 'express';
import { db } from '../../../../infrastructure/drizzle/client';
import { users } from '../../../../infrastructure/drizzle/schema';
import { eq } from 'drizzle-orm';
import { toUserDTO } from '../../mappers/dtoMappers';
import { asyncHandler } from '../../middlewares/errorMiddleware';

export const registerController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { firstname, lastname, email, password } = req.body;

    if (!firstname || !lastname || !email || !password) {
      res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Tous les champs sont requis',
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Email invalide',
      });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Le mot de passe doit contenir au moins 6 caractères',
      });
      return;
    }

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email.toLowerCase()),
    });

    if (existingUser) {
      res.status(409).json({
        error: 'EMAIL_ALREADY_EXISTS',
        message: 'Un compte existe déjà avec cet email',
      });
      return;
    }

    // TODO: En production, hasher le mot de passe avec bcrypt
    // const hashedPassword = await bcrypt.hash(password, 10);

    const userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    const now = new Date().toISOString();

    const [newUser] = await db
      .insert(users)
      .values({
        id: userId,
        firstname,
        lastname,
        email: email.toLowerCase(),
        password, // En dev, stocké en clair (à hasher en prod)
        role: 'CLIENT', 
        isActive: 1,
        emailVerifiedAt: null,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    // TODO: En production, générer un vrai JWT
    // const token = jwt.sign(
    //   { userId: newUser.id, email: newUser.email, role: newUser.role },
    //   process.env.JWT_SECRET!,
    //   { expiresIn: '7d' }
    // );

    // Pour le dev, token simple
    const token = `${newUser.id}:${newUser.email}`;

    res.status(201).json({
      token,
      user: toUserDTO(newUser),
    });
  }
);
