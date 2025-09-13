<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
class User
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups("user:read")] // ✅ Exposer cette propriété dans les réponses json
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups("user:read")]
    #[Assert\NotBlank(message: "Le prénom est requis")]
    private ?string $firstname = null;

    #[ORM\Column(length: 255)]
    #[Groups("user:read")]
    #[Assert\NotBlank(message: "Le nom est requis")]
    private ?string $lastname = null;

    #[ORM\Column(length: 320)]
    #[Groups("user:read")]
    #[Assert\NotBlank(message: "L'email est requis")]
    #[Assert\Email(message: "L'adresse '{{ value }}' n'est pas un email valide.")]
    private ?string $email = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(message: "Le mot de passe es requis")]
    private ?string $password = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFirstname(): ?string
    {
        return $this->firstname;
    }

    public function setFirstname(string $firstname): static
    {
        $this->firstname = $firstname;

        return $this;
    }

    public function getLastname(): ?string
    {
        return $this->lastname;
    }

    public function setLastname(string $lastname): static
    {
        $this->lastname = $lastname;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }
}
