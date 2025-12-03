'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { DashboardLayout } from '@/components/templates/DashboardLayout';
import { Card } from '@/components/atoms/Card';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import { getAllClientAccounts, banClientAccount, unbanClientAccount, deleteClientAccount, ClientAccount } from '@/lib/api/director/accounts';
import { useToast } from '@/contexts/ToastProvider';

export default function DirectorAccountsPage() {    
  const t = useTranslations('Director.accounts');
  const { success, error: showError } = useToast();
  const [accounts, setAccounts] = useState<ClientAccount[]>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<ClientAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'banned'>('all');
  const [selectedAccount, setSelectedAccount] = useState<ClientAccount | null>(null);
  const [showBanModal, setShowBanModal] = useState(false);
  const [showUnbanModal, setShowUnbanModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [banReason, setBanReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadAccounts();
  }, []);

  useEffect(() => {
    filterAccounts();
  }, [accounts, searchQuery, filterStatus]);

  const loadAccounts = async () => {
    setLoading(true);
    const data = await getAllClientAccounts();
    setAccounts(data);
    setLoading(false);
  };

  const filterAccounts = () => {
    let filtered = accounts;

    if (searchQuery) {
      filtered = filtered.filter(
        (acc) =>
          acc.accountNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          acc.clientName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterStatus === 'active') {
      filtered = filtered.filter((acc) => acc.isActive && !acc.isBanned);
    } else if (filterStatus === 'banned') {
      filtered = filtered.filter((acc) => acc.isBanned);
    }

    setFilteredAccounts(filtered);
  };

  const handleBan = async () => {
    if (!selectedAccount) return;
    
    setActionLoading(true);
    try {
      await banClientAccount(selectedAccount.id, { reason: banReason });
      success(t('toasts.banSuccess'));
      setShowBanModal(false);
      setBanReason('');
      await loadAccounts();
    } catch (err) {
      console.error('Error banning account:', err);
      showError(t('toasts.banError'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnban = async () => {
    if (!selectedAccount) return;
    
    setActionLoading(true);
    try {
      await unbanClientAccount(selectedAccount.id);
      success(t('toasts.unbanSuccess'));
      setShowUnbanModal(false);
      await loadAccounts();
    } catch (err) {
      console.error('Error unbanning account:', err);
      showError(t('toasts.unbanError'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedAccount) return;
    
    setActionLoading(true);
    try {
      await deleteClientAccount(selectedAccount.id);
      success(t('toasts.deleteSuccess'));
      setShowDeleteModal(false);
      await loadAccounts();
    } catch (err) {
      console.error('Error deleting account:', err);
      showError(t('toasts.deleteError'));
    } finally {
      setActionLoading(false);
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency || 'EUR',
    }).format(amount);
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
                    {t('list.accountNumber')}
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    {t('list.clientName')}
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    {t('list.type')}
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    {t('list.balance')}
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
                {filteredAccounts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">
                      {t('list.noAccounts')}
                    </td>
                  </tr>
                ) : (
                  filteredAccounts.map((account) => {
                    const getStatusClass = () => {
                      if (account.isBanned) return 'bg-red-100 text-red-800';
                      if (account.isActive) return 'bg-green-100 text-green-800';
                      return 'bg-gray-100 text-gray-800';
                    };

                    const getStatusText = () => {
                      if (account.isBanned) return t('status.banned');
                      if (account.isActive) return t('status.active');
                      return t('status.inactive');
                    };

                    return (
                    <tr key={account.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">{account.accountNumber}</td>
                      <td className="py-3 px-4">{account.clientName}</td>
                      <td className="py-3 px-4 capitalize">{account.type}</td>
                      <td className="py-3 px-4">{formatCurrency(account.balance, account.currency)}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass()}`}>
                          {getStatusText()}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          {account.isBanned ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedAccount(account);
                                setShowUnbanModal(true);
                              }}
                            >
                              {t('actions.unban')}
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedAccount(account);
                                setShowBanModal(true);
                              }}
                            >
                              {t('actions.ban')}
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedAccount(account);
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

      {showBanModal && selectedAccount && (
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

      {showUnbanModal && selectedAccount && (
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

      {showDeleteModal && selectedAccount && (
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
