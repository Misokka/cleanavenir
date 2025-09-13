<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/auth', methods: ['POST'])]
final class AuthController extends AbstractController
{
    #[Route('/register', name: 'app_register')]
    public function store(
        Request $request, 
        SerializerInterface $serializer, 
        EntityManagerInterface $entityManager,
        ValidatorInterface $validator
    ): JsonResponse
    {

        $newUser = $serializer->deserialize($request->getContent(), User::class, 'json');

        $errors = $validator->validate($newUser);

        if(count($errors) !== 0){
            $errorsArr = [];
            foreach ($errors as $error) {
                $errorsArr[] = $error;
            }

            return $this->json(['errors' => $errorsArr]);
        }

        $entityManager->persist($newUser);
        $entityManager->flush();

        return $this->json([
            'message' => 'utilisateur créé avec succès.'
        ]);
    }
}
