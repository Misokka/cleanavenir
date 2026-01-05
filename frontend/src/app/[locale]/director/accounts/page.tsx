'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { DashboardLayout } from '@/components/templates/DashboardLayout';
import { Card } from '@/components/atoms/Card';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import { adminService, Client } from '@/infrastructure/web/services/adminService';
import type { CreateClientPayload, UpdateClientPayload } from '@/infrastructure/web/services/adminService';
import { useToast } from '@/contexts/ToastProvider';

export default function DirectorAccountsPage() {    
  const t = useTranslations('Director.accounts');
  const { success, error: showError } = useToast();
  
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'banned'>('all');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  
  const [showBanModal, setShowBanModal] = useState(false);
  const [showUnbanModal, setShowUnbanModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  const [banReason, setBanReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  
  const [createEmail, setCreateEmail] = useState('');
  const [createFirstName, setCreateFirstName] = useState('');
  const [createLastName, setCreateLastName] = useState('');
  const [createPassword, setCreatePassword] = useState('');
  const [createError, setCreateError] = useState('');
  
  const [editEmail, setEditEmail] = useState('');
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editError, setEditError] = useState('');

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    filterClients();
  }, [clients, searchQuery, filterStatus]);

  const loadClients = async () => {
    setLoading(true);
    const data = await adminService.getClients();
    setClients(data);
    setLoading(false);
  };

  const filterClients = () => {
    let filtered = clients;

    if (searchQuery) {
      filtered = filtered.filter(
        (client) =>
          client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          client.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          client.lastName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterStatus === 'active') {
      filtered = filtered.filter((client) => client.isActive);
    } else if (filterStatus === 'banned') {
      filtered = filtered.filter((client) => !client.isActive);
    }

    setFilteredClients(filtered);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError('');
    
    // Validations
    if (!createEmail || !createFirstName || !createLastName || !createPassword) {
      setCreateError('Tous les champs sont requis');
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(createEmail)) {
      setCreateError('Email invalide');
      return;
    }
    
    if (createPassword.length < 8) {
      setCreateError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }
    
    setActionLoading(true);
    try {
      await adminService.createClient({
        email: createEmail,
        firstName: createFirstName,
        lastName: createLastName,
        password: createPassword,
      });
      success(t('toasts.createSuccess'));
      setShowCreateModal(false);
      setCreateEmail('');
      setCreateFirstName('');
      setCreateLastName('');
      setCreatePassword('');
      setCreateError('');
      await loadClients();
    } catch (err: any) {
      console.error('Error creating client:', err);
      showError(err.message || t('toasts.createError'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) return;
    
    setEditError('');
    
    if (editEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editEmail)) {
      setEditError('Email invalide');
      return;
    }
    
    if (editPassword && editPassword.length < 8) {
      setEditError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }
    
    if (!editEmail && !editFirstName && !editLastName && !editPassword) {
      setEditError('Veuillez modifier au moins un champ');
      return;
    }
    
    setActionLoading(true);
    try {
      const payload: UpdateClientPayload = {};
      if (editEmail) payload.email = editEmail;
      if (editFirstName) payload.firstName = editFirstName;
      if (editLastName) payload.lastName = editLastName;
      if (editPassword) payload.password = editPassword;
      
      await adminService.updateClient(selectedClient.id, payload);
      success(t('toasts.updateSuccess'));
      setShowEditModal(false);
      setEditEmail('');
      setEditFirstName('');
      setEditLastName('');
      setEditPassword('');
      setEditError('');
      await loadClients();
    } catch (err: any) {
      console.error('Error updating client:', err);
      showError(err.message || t('toasts.updateError'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleBan = async () => {
    if (!selectedClient) return;
    
    setActionLoading(true);
    try {
      await adminService.banClient(selectedClient.id);
      success(t('toasts.banSuccess'));
      setShowBanModal(false);
      setBanReason('');
      await loadClients();
    } catch (err) {
      console.error('Error banning client:', err);
      showError(t('toasts.banError'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnban = async () => {
    if (!selectedClient) return;
    
    setActionLoading(true);
    try {
      await adminService.unbanClient(selectedClient.id);
      success(t('toasts.unbanSuccess'));
      setShowUnbanModal(false);
      await loadClients();
    } catch (err) {
      console.error('Error unbanning client:', err);
      showError(t('toasts.unbanError'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedClient) return;
    
    setActionLoading(true);
    try {
      await adminService.deleteClient(selectedClient.id);
      success(t('toasts.deleteSuccess'));
      setShowDeleteModal(false);
      await loadClients();
    } catch (err) {
      console.error('Error deleting client:', err);
      showError(t('toasts.deleteError'));
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Typography variant="h2">{t('title')}</Typography>
          <Card className="animate-pulse">
            <div className="h-96 bg-gray-200 rounded"></div>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Typography variant="h2">{t('title')}</Typography>
          <Button
            variant="primary"
            size="md"
            onClick={() => setShowCreateModal(true)}
          >
            {t('actions.createClient')}
          </Button>
        </div>

        <Card>
          <div className="mb-6 space-y-4">
            <Input
              type="text"
              placeholder={t('list.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />

            <div className="flex gap-2">
              <Button
                variant={filterStatus === 'all' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('all')}
              >
                {t('list.filterAll')}
              </Button>
              <Button
                variant={filterStatus === 'active' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('active')}
              >
                {t('list.filterActive')}
              </Button>
              <Button
                variant={filterStatus === 'banned' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('banned')}
              >
                {t('list.filterBanned')}
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    {t('list.email')}
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    {t('list.clientName')}
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    {t('list.role')}
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    {t('list.status')}
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    {t('list.actions')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-500">
                      {t('list.noAccounts')}
                    </td>
                  </tr>
                ) : (
                  filteredClients.map((client) => {
                    const getStatusClass = () => {
                      return client.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800';
                    };

                    const getStatusText = () => {
                      return client.isActive 
                        ? t('status.active') 
                        : t('status.banned');
                    };

                    return (
                      <tr key={client.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">{client.email}</td>
                        <td className="py-3 px-4">{`${client.firstName} ${client.lastName}`}</td>
                        <td className="py-3 px-4 capitalize">{client.role}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass()}`}>
                            {getStatusText()}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedClient(client);
                                setEditEmail(client.email);
                                setEditFirstName(client.firstName);
                                setEditLastName(client.lastName);
                                setEditPassword('');
                                setEditError('');
                                setShowEditModal(true);
                              }}
                            >
                              {t('actions.edit')}
                            </Button>
                            {client.isActive ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedClient(client);
                                  setShowBanModal(true);
                                }}
                              >
                                {t('actions.ban')}
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedClient(client);
                                  setShowUnbanModal(true);
                                }}
                              >
                                {t('actions.unban')}
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedClient(client);
                                setShowDeleteModal(true);
                              }}
                              className="text-red-600 hover:text-red-700"
                            >
                              {t('actions.delete')}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-md w-full m-4">
            <Typography variant="h3" className="mb-4">
              {t('modals.createTitle')}
            </Typography>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <Typography variant="caption" className="mb-2 block">
                  {t('modals.createEmailLabel')}
                </Typography>
                <Input
                  type="email"
                  value={createEmail}
                  onChange={(e) => setCreateEmail(e.target.value)}
                  placeholder={t('modals.createEmailPlaceholder')}
                  fullWidth
                />
              </div>
              <div>
                <Typography variant="caption" className="mb-2 block">
                  {t('modals.createFirstNameLabel')}
                </Typography>
                <Input
                  type="text"
                  value={createFirstName}
                  onChange={(e) => setCreateFirstName(e.target.value)}
                  placeholder={t('modals.createFirstNamePlaceholder')}
                  fullWidth
                />
              </div>
              <div>
                <Typography variant="caption" className="mb-2 block">
                  {t('modals.createLastNameLabel')}
                </Typography>
                <Input
                  type="text"
                  value={createLastName}
                  onChange={(e) => setCreateLastName(e.target.value)}
                  placeholder={t('modals.createLastNamePlaceholder')}
                  fullWidth
                />
              </div>
              <div>
                <Typography variant="caption" className="mb-2 block">
                  {t('modals.createPasswordLabel')}
                </Typography>
                <Input
                  type="password"
                  value={createPassword}
                  onChange={(e) => setCreatePassword(e.target.value)}
                  placeholder={t('modals.createPasswordPlaceholder')}
                  fullWidth
                />
              </div>
              {createError && (
                <Typography variant="caption" className="text-red-600">
                  {createError}
                </Typography>
              )}
              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowCreateModal(false);
                    setCreateEmail('');
                    setCreateFirstName('');
                    setCreateLastName('');
                    setCreatePassword('');
                    setCreateError('');
                  }}
                >
                  {t('modals.cancel')}
                </Button>
                <Button type="submit" size="sm" disabled={actionLoading}>
                  {t('modals.create')}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {showEditModal && selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-md w-full m-4">
            <Typography variant="h3" className="mb-4">
              {t('modals.editTitle')}
            </Typography>
            <form onSubmit={handleEdit} className="space-y-4">
              <div>
                <Typography variant="caption" className="mb-2 block">
                  {t('modals.editEmailLabel')}
                </Typography>
                <Input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  fullWidth
                />
              </div>
              <div>
                <Typography variant="caption" className="mb-2 block">
                  {t('modals.editFirstNameLabel')}
                </Typography>
                <Input
                  type="text"
                  value={editFirstName}
                  onChange={(e) => setEditFirstName(e.target.value)}
                  fullWidth
                />
              </div>
              <div>
                <Typography variant="caption" className="mb-2 block">
                  {t('modals.editLastNameLabel')}
                </Typography>
                <Input
                  type="text"
                  value={editLastName}
                  onChange={(e) => setEditLastName(e.target.value)}
                  fullWidth
                />
              </div>
              <div>
                <Typography variant="caption" className="mb-2 block">
                  {t('modals.editPasswordLabel')}
                </Typography>
                <Input
                  type="password"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  placeholder={t('modals.editPasswordPlaceholder')}
                  fullWidth
                />
              </div>
              {editError && (
                <Typography variant="caption" className="text-red-600">
                  {editError}
                </Typography>
              )}
              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditEmail('');
                    setEditFirstName('');
                    setEditLastName('');
                    setEditPassword('');
                    setEditError('');
                  }}
                >
                  {t('modals.cancel')}
                </Button>
                <Button type="submit" size="sm" disabled={actionLoading}>
                  {t('modals.save')}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {showBanModal && selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-md w-full m-4">
            <Typography variant="h3" className="mb-4">
              {t('modals.banTitle')}
            </Typography>
            <Typography variant="body" className="mb-4">
              {t('modals.banMessage')}
            </Typography>
            <div className="mb-4">
              <Typography variant="caption" className="mb-2">
                {t('modals.banReason')}
              </Typography>
              <Input
                type="text"
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                fullWidth
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => setShowBanModal(false)}>
                {t('modals.cancel')}
              </Button>
              <Button size="sm" onClick={handleBan} disabled={actionLoading}>
                {t('modals.confirm')}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {showUnbanModal && selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-md w-full m-4">
            <Typography variant="h3" className="mb-4">
              {t('modals.unbanTitle')}
            </Typography>
            <Typography variant="body" className="mb-4">
              {t('modals.unbanMessage')}
            </Typography>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => setShowUnbanModal(false)}>
                {t('modals.cancel')}
              </Button>
              <Button size="sm" onClick={handleUnban} disabled={actionLoading}>
                {t('modals.confirm')}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {showDeleteModal && selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-md w-full m-4">
            <Typography variant="h3" className="mb-4 text-red-600">
              {t('modals.deleteTitle')}
            </Typography>
            <Typography variant="body" className="mb-4">
              {t('modals.deleteMessage')}
            </Typography>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => setShowDeleteModal(false)}>
                {t('modals.cancel')}
              </Button>
              <Button
                size="sm"
                onClick={handleDelete}
                disabled={actionLoading}
                className="bg-red-600 hover:bg-red-700"
              >
                {t('modals.confirm')}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
}
