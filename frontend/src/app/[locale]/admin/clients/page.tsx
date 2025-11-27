'use client';

import React from 'react';
import { DashboardLayout } from '@/components/templates/DashboardLayout';
import { Typography } from '@/components/atoms/Typography';
import { Card } from '@/components/atoms/Card';
import { Button } from '@/components/atoms/Button';
import { ClientsTable } from '@/components/organisms/ClientsTable';
import { useGetClients } from '@/features/admin/useGetClients';

export default function AdminClientsPage() {
  const { clients, loading, error, refetch } = useGetClients();

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="h-8 bg-gray-200 rounded animate-pulse w-64"></div>
          <div className="h-96 bg-gray-200 rounded-xl animate-pulse"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <Card className="text-center py-12 border-red-200 bg-red-50">
          <div className="text-6xl mb-4">⚠️</div>
          <Typography variant="h4" className="mb-2 text-red-700">
            Erreur de chargement
          </Typography>
          <Typography color="muted" className="mb-4">
            {error}
          </Typography>
          <Button variant="primary" onClick={refetch}>
            Réessayer
          </Button>
        </Card>
      </DashboardLayout>
    );
  }

  const activeClients = clients?.filter((c) => c.isActive) || [];
  const bannedClients = clients?.filter((c) => !c.isActive) || [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Typography variant="h2" className="mb-2">
              Gestion des Clients
            </Typography>
            <Typography variant="body" color="muted">
              Administrez les comptes clients de la banque
            </Typography>
          </div>
          <Button variant="outline" onClick={refetch}>
            🔄 Actualiser
          </Button>
        </div>

        {/* Statistiques */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="bg-blue-50 border-blue-200">
            <Typography variant="caption" color="muted" className="mb-1">
              Total Clients
            </Typography>
            <Typography variant="h2" className="text-blue-600 font-bold">
              {clients?.length || 0}
            </Typography>
          </Card>
          <Card className="bg-green-50 border-green-200">
            <Typography variant="caption" color="muted" className="mb-1">
              Clients Actifs
            </Typography>
            <Typography variant="h2" className="text-green-600 font-bold">
              {activeClients.length}
            </Typography>
          </Card>
          <Card className="bg-red-50 border-red-200">
            <Typography variant="caption" color="muted" className="mb-1">
              Clients Bannis
            </Typography>
            <Typography variant="h2" className="text-red-600 font-bold">
              {bannedClients.length}
            </Typography>
          </Card>
        </div>

        {/* Table des clients */}
        <div>
          <Typography variant="h3" className="mb-4">
            Liste des clients
          </Typography>
          <ClientsTable clients={clients || []} onClientBanned={refetch} />
        </div>
      </div>
    </DashboardLayout>
  );
}
