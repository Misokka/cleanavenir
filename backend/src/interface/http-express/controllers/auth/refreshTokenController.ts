import { Request, Response } from 'express';
import { getContainer } from '../../../../infrastructure/bootstrap/instance';
import { RefreshTokenUseCase } from '../../../../application/use-cases/user/auth/RefreshTokenUseCase';
import { generateToken, generateRefreshToken, setTokenCookie, setRefreshTokenCookie, verifyToken } from '../../../../infrastructure/adapters/JwtService';
import { asyncHandler } from '../../middlewares/errorMiddleware';

export const refreshTokenController = asyncHandler(async (req: Request, res: Response) => {
  const container = getContainer();
  const refreshTokenUseCase = container.useCases.auth.refreshToken;

  // Get refresh token from cookie
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    res.status(401).json({
      success: false,
      error: 'REFRESH_TOKEN_MISSING',
      message: 'Refresh token manquant',
    });
    return;
  }

  try {
    // Verify refresh token
    const decoded = verifyToken(refreshToken);

    // Execute use case
    const result = await refreshTokenUseCase.execute(decoded.userId);

    if (!result.ok) {
      res.status(401).json({
        success: false,
        error: 'REFRESH_FAILED',
        message: result.error.message,
      });
      return;
    }

    const { user, profile } = result.value;

    // Generate new tokens
    const newAccessToken = generateToken({
      userId: user.userIdentifier,
      email: user.email,
      role: user.role,
    });

    const newRefreshToken = generateRefreshToken({
      userId: user.userIdentifier,
      email: user.email,
      role: user.role,
    });

    // Set new cookies
    setTokenCookie(res, newAccessToken);
    setRefreshTokenCookie(res, newRefreshToken);

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.userIdentifier,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          role: user.role,
        },
        profile: {
          firstName: profile.userIdentifier,
        },
      },
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'TokenExpiredError') {
      res.status(401).json({
        success: false,
        error: 'REFRESH_TOKEN_EXPIRED',
        message: 'Refresh token expiré',
      });
      return;
    }

    res.status(401).json({
      success: false,
      error: 'INVALID_REFRESH_TOKEN',
      message: 'Refresh token invalide',
    });
  }
});
