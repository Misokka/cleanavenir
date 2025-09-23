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
    private ?string $status = null;

    #[ORM\Column]
    private ?bool $isPublished = null;

    /**
     * @var Collection<int, Contract>
     */
    #[ORM\ManyToMany(targetEntity: Contract::class, inversedBy: 'players')]
    private Collection $contract;

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

    /**
     * @var Collection<int, Career>
     */
    #[ORM\ManyToMany(targetEntity: Career::class, inversedBy: 'players')]
    private Collection $career;

    public function __construct()
    {
        $this->contract = new ArrayCollection();
        $this->agent = new ArrayCollection();
        $this->club = new ArrayCollection();
        $this->stat = new ArrayCollection();
        $this->career = new ArrayCollection();
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
        return $this->status;
    }

    public function setStatus(?string $status): static
    {
        $this->status = $status;

        return $this;
    }

    public function isPublished(): ?bool
    {
        return $this->isPublished;
    }

    public function setIsPublished(bool $isPublished): static
    {
        $this->isPublished = $isPublished;

        return $this;
    }

    /**
     * @return Collection<int, Contract>
     */
    public function getContract(): Collection
    {
        return $this->contract;
    }

    public function addContract(Contract $contract): static
    {
        if (!$this->contract->contains($contract)) {
            $this->contract->add($contract);
        }

        return $this;
    }

    public function removeContract(Contract $contract): static
    {
        $this->contract->removeElement($contract);

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

    /**
     * @return Collection<int, Career>
     */
    public function getCareer(): Collection
    {
        return $this->career;
    }

    public function addCareer(Career $career): static
    {
        if (!$this->career->contains($career)) {
            $this->career->add($career);
        }

        return $this;
    }

    public function removeCareer(Career $career): static
    {
        $this->career->removeElement($career);

        return $this;
    }

}
