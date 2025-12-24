'use client';

import React, { useState } from 'react';
import { Typography } from '../atoms/Typography';
import { Button } from '../atoms/Button';
import { Card } from '../atoms/Card';
import type { ClientDTO } from '@/infrastructure/web/services/adminService';
import { useBanClient } from '@/features/admin/useBanClient';

interface ClientsTableProps {
  clients: ClientDTO[];
  onClientBanned?: () => void;
}

export const ClientsTable: React.FC<ClientsTableProps> = ({ clients, onClientBanned }) => {
  const { banClient, unbanClient, loading } = useBanClient();
  const [banningClientId, setBanningClientId] = useState<string | null>(null);

  const handleBanClient = async (clientId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir bannir ce client ?')) {
      return;
    }

    setBanningClientId(clientId);
    const result = await banClient(clientId);
    setBanningClientId(null);

    if (result && onClientBanned) {
      onClientBanned();
    }
  };

  const handleUnbanClient = async (clientId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir réintégrer ce client ?')) {
      return;
    }

    const result = await unbanClient(clientId);

    if (result && onClientBanned) {
      onClientBanned();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rôle
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Inscrit le
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {clients.map((client) => (
              <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">
                        {client.user.firstname?.[0]}{client.user.lastname?.[0]}
                      </span>
                    </div>
                    <div className="ml-4">
                      <Typography variant="body" className="font-medium text-gray-900">
                        {client.user.firstname} {client.user.lastname}
                      </Typography>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Typography variant="caption" color="muted">
                    {client.user.email}
                  </Typography>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                    {client.user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      client.user.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {client.user.isActive ? 'Actif' : 'Banni'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Typography variant="caption" color="muted">
                    {formatDate(client.user.createdAt)}
                  </Typography>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {client.user.isActive ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBanClient(client.user.id)}
                      disabled={loading && banningClientId === client.user.id}
                      className="text-red-600 hover:text-red-700 border-red-300"
                    >
                      {loading && banningClientId === client.user.id ? 'En cours...' : 'Bannir'}
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => handleUnbanClient(client.user.id)}>
                      Réintégrer
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {clients.length === 0 && (
        <div className="text-center py-12">
          <Typography variant="h4" color="muted">
            Aucun client trouvé
          </Typography>
        </div>
      )}
    </Card>
  );
};

export default ClientsTable;
