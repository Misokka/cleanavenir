<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\DependencyInjection\Attribute\Value;

final class TestController extends AbstractController
{

    #[Route('/', name: 'app_test', methods: ['GET'])]
    public function index(): JsonResponse
    {
        return $this->json([
            'message' => 'Welcome to your new controller!',
            'path' => 'src/Controller/TestController.php',
        ]);
    }

    #[Route('/param/{id}', methods: ['GET'])]
    public function testParam(int $id): JsonResponse{
        return $this->json([
            'id' => $id
        ]);
    }
}
