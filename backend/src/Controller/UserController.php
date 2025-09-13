<?php

namespace App\Controller;

use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/users', methods: ['GET'])]
final class UserController extends AbstractController
{
    #[Route('/user/{id}', name: 'getUser')]
    public function index(UserRepository $userRepository, int $id): JsonResponse
    {
        $user = $userRepository->find($id);
        if(!$user){
            return $this->json([
                'message' => 'Utilisateur introuvable',
            ]);
        }

        return $this->json([$user]);
    }
}
