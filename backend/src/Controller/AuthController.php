<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

#[Route('/api/auth', methods: ['POST'])]
final class AuthController extends AbstractController
{
    #[Route('/register', name: 'app_register')]
    public function store(
        Request $request, 
        SerializerInterface $serializer,
        UserPasswordHasherInterface $passwordHasher,
        EntityManagerInterface $entityManager,
        ValidatorInterface $validator
    ): JsonResponse
    {

        $newUser = $serializer->deserialize($request->getContent(), User::class, 'json');

        $errors = $validator->validate($newUser);

        if(count($errors) !== 0){
            $errorsArr = [];
            foreach ($errors as $error) {
                $errorsArr[$error->getPropertyPath()] = $error->getMessage();
            }

            return $this->json(['errors' => $errorsArr]);
        }

        $hashedPassword = $passwordHasher->hashPassword($newUser, $newUser->getPassword());
        $newUser->setPassword($hashedPassword);
        $entityManager->persist($newUser);
        $entityManager->flush();

        return $this->json([
            'message' => 'utilisateur créé avec succès.',
            'user' => $newUser,
        ]);
    }

    #[Route('/login', name: 'app_login')]
    public function login(#[CurrentUser] ?User $user){
        if(null === $user) {
            return $this->json([
                'errorMessage' => 'Identifiants invalides.'
            ], 401);
        }

        return $this->json([
            'message' => 'Connexion réussie',
            'user' => $user
        ]);
    }

    #[Route('/me', name: 'app_me', methods: ['GET'])]
    public function me(#[CurrentUser] ?User $user){
        return $this->json($user, 200, [], ['groups' => 'user:read']);
    }

    #[Route('/logout', name: 'app_logout')]
    public function logout(Security $security){
        $security->logout(false);

        return $this->json([
            'message' => 'Déconnexion réussie.'
        ]);
    }
}
