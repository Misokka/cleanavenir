<?php

namespace App\Entity;

use App\Repository\PlayerRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: PlayerRepository::class)]
class Player
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $firstName = null;

    #[ORM\Column(length: 255)]
    private ?string $lastName = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $position = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTime $birth = null;

    #[ORM\Column(nullable: true)]
    private ?float $askingPrice = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $profesionalStatus = null;

    /**
     * @var Collection<int, Agent>
     */
    #[ORM\ManyToMany(targetEntity: Agent::class, inversedBy: 'players')]
    private Collection $agent;

    /**
     * @var Collection<int, Club>
     */
    #[ORM\ManyToMany(targetEntity: Club::class, inversedBy: 'players')]
    private Collection $club;

    /**
     * @var Collection<int, Stat>
     */
    #[ORM\ManyToMany(targetEntity: Stat::class, inversedBy: 'players')]
    private Collection $stat;

    public function __construct()
    {
        $this->agent = new ArrayCollection();
        $this->club = new ArrayCollection();
        $this->stat = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFirstName(): ?string
    {
        return $this->firstName;
    }

    public function setFirstName(string $firstName): static
    {
        $this->firstName = $firstName;

        return $this;
    }

    public function getLastName(): ?string
    {
        return $this->lastName;
    }

    public function setLastName(string $lastName): static
    {
        $this->lastName = $lastName;

        return $this;
    }

    public function getPosition(): ?string
    {
        return $this->position;
    }

    public function setPosition(?string $position): static
    {
        $this->position = $position;

        return $this;
    }

    public function getBirth(): ?\DateTime
    {
        return $this->birth;
    }

    public function setBirth(\DateTime $birth): static
    {
        $this->birth = $birth;

        return $this;
    }

    public function getAskingPrice(): ?float
    {
        return $this->askingPrice;
    }

    public function setAskingPrice(?float $askingPrice): static
    {
        $this->askingPrice = $askingPrice;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->profesionalStatus;
    }

    public function setprofesionalStatus(?string $profesionalStatus): static
    {
        $this->profesionalStatus = $profesionalStatus;

        return $this;
    }


    /**
     * @return Collection<int, Agent>
     */
    public function getAgent(): Collection
    {
        return $this->agent;
    }

    public function addAgent(Agent $agent): static
    {
        if (!$this->agent->contains($agent)) {
            $this->agent->add($agent);
        }

        return $this;
    }

    public function removeAgent(Agent $agent): static
    {
        $this->agent->removeElement($agent);

        return $this;
    }

    /**
     * @return Collection<int, Club>
     */
    public function getClub(): Collection
    {
        return $this->club;
    }

    public function addClub(Club $club): static
    {
        if (!$this->club->contains($club)) {
            $this->club->add($club);
        }

        return $this;
    }

    public function removeClub(Club $club): static
    {
        $this->club->removeElement($club);

        return $this;
    }

    /**
     * @return Collection<int, Stat>
     */
    public function getStat(): Collection
    {
        return $this->stat;
    }

    public function addStat(Stat $stat): static
    {
        if (!$this->stat->contains($stat)) {
            $this->stat->add($stat);
        }

        return $this;
    }

    public function removeStat(Stat $stat): static
    {
        $this->stat->removeElement($stat);

        return $this;
    }

}
