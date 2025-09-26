<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
#[UniqueEntity('email', message: "Utilisateur existant.")]
class User implements UserInterface, PasswordAuthenticatedUserInterface
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

    #[ORM\Column(type: "string", length: 320, unique: true)]
    #[Groups("user:read")]
    #[Assert\NotBlank(message: "L'email est requis")]
    #[Assert\Email(message: "L'adresse '{{ value }}' n'est pas un email valide.")]
    private ?string $email = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(message: "Le mot de passe es requis")]
    private ?string $password = null;

    #[ORM\Column(type: 'json')]
    private array $roles = [];

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $resetPasswordToken = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTime $resetPasswordTokenExpiry = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $resetTokenSelector = null;

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

    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    public function eraseCredentials()
    {
        
    }

    public function getResetPasswordToken(): ?string
    {
        return $this->resetPasswordToken;
    }

    public function setResetPasswordToken(?string $resetPasswordToken): static
    {
        $this->resetPasswordToken = $resetPasswordToken;

        return $this;
    }

    public function getResetPasswordTokenExpiry(): ?\DateTime
    {
        return $this->resetPasswordTokenExpiry;
    }

    public function setResetPasswordTokenExpiry(?\DateTime $resetPasswordTokenExpiry): static
    {
        $this->resetPasswordTokenExpiry = $resetPasswordTokenExpiry;

        return $this;
    }

    public function getResetTokenSelector(): ?string
    {
        return $this->resetTokenSelector;
    }

    public function setResetTokenSelector(?string $resetTokenSelector): static
    {
        $this->resetTokenSelector = $resetTokenSelector;

        return $this;
    }
}
