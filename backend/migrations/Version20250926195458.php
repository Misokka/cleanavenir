<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250926195458 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SEQUENCE agent_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE club_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE negociation_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE player_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE stat_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE transfert_player_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE agent (id INT NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE club (id INT NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE negociation (id INT NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE player (id INT NOT NULL, first_name VARCHAR(255) NOT NULL, last_name VARCHAR(255) NOT NULL, position VARCHAR(255) DEFAULT NULL, birth DATE NOT NULL, asking_price DOUBLE PRECISION DEFAULT NULL, profesional_status VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE player_agent (player_id INT NOT NULL, agent_id INT NOT NULL, PRIMARY KEY(player_id, agent_id))');
        $this->addSql('CREATE INDEX IDX_99F9E7DB99E6F5DF ON player_agent (player_id)');
        $this->addSql('CREATE INDEX IDX_99F9E7DB3414710B ON player_agent (agent_id)');
        $this->addSql('CREATE TABLE player_club (player_id INT NOT NULL, club_id INT NOT NULL, PRIMARY KEY(player_id, club_id))');
        $this->addSql('CREATE INDEX IDX_1AF4684199E6F5DF ON player_club (player_id)');
        $this->addSql('CREATE INDEX IDX_1AF4684161190A32 ON player_club (club_id)');
        $this->addSql('CREATE TABLE player_stat (player_id INT NOT NULL, stat_id INT NOT NULL, PRIMARY KEY(player_id, stat_id))');
        $this->addSql('CREATE INDEX IDX_82A2AF1299E6F5DF ON player_stat (player_id)');
        $this->addSql('CREATE INDEX IDX_82A2AF129502F0B ON player_stat (stat_id)');
        $this->addSql('CREATE TABLE stat (id INT NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE transfert_player (id INT NOT NULL, PRIMARY KEY(id))');
        $this->addSql('ALTER TABLE player_agent ADD CONSTRAINT FK_99F9E7DB99E6F5DF FOREIGN KEY (player_id) REFERENCES player (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE player_agent ADD CONSTRAINT FK_99F9E7DB3414710B FOREIGN KEY (agent_id) REFERENCES agent (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE player_club ADD CONSTRAINT FK_1AF4684199E6F5DF FOREIGN KEY (player_id) REFERENCES player (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE player_club ADD CONSTRAINT FK_1AF4684161190A32 FOREIGN KEY (club_id) REFERENCES club (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE player_stat ADD CONSTRAINT FK_82A2AF1299E6F5DF FOREIGN KEY (player_id) REFERENCES player (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE player_stat ADD CONSTRAINT FK_82A2AF129502F0B FOREIGN KEY (stat_id) REFERENCES stat (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE "user" ADD reset_password_token VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE "user" ADD reset_password_token_expiry TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP SEQUENCE agent_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE club_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE negociation_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE player_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE stat_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE transfert_player_id_seq CASCADE');
        $this->addSql('ALTER TABLE player_agent DROP CONSTRAINT FK_99F9E7DB99E6F5DF');
        $this->addSql('ALTER TABLE player_agent DROP CONSTRAINT FK_99F9E7DB3414710B');
        $this->addSql('ALTER TABLE player_club DROP CONSTRAINT FK_1AF4684199E6F5DF');
        $this->addSql('ALTER TABLE player_club DROP CONSTRAINT FK_1AF4684161190A32');
        $this->addSql('ALTER TABLE player_stat DROP CONSTRAINT FK_82A2AF1299E6F5DF');
        $this->addSql('ALTER TABLE player_stat DROP CONSTRAINT FK_82A2AF129502F0B');
        $this->addSql('DROP TABLE agent');
        $this->addSql('DROP TABLE club');
        $this->addSql('DROP TABLE negociation');
        $this->addSql('DROP TABLE player');
        $this->addSql('DROP TABLE player_agent');
        $this->addSql('DROP TABLE player_club');
        $this->addSql('DROP TABLE player_stat');
        $this->addSql('DROP TABLE stat');
        $this->addSql('DROP TABLE transfert_player');
        $this->addSql('ALTER TABLE "user" DROP reset_password_token');
        $this->addSql('ALTER TABLE "user" DROP reset_password_token_expiry');
    }
}
