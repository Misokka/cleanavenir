'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/templates/DashboardLayout';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { notificationService, NotificationDTO } from '@/infrastructure/web/services/notificationService';

interface NotificationsAdvisorClientProps {
  locale: string;
}

export default function NotificationsAdvisorClient({ locale }: NotificationsAdvisorClientProps) {
  const t = useTranslations('Notifications');
  const router = useRouter();
  
  const [notifications, setNotifications] = useState<NotificationDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sseConnected, setSseConnected] = useState(false);

  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await notificationService.listNotifications(50, 0);
      setNotifications(data);
    } catch {
      setError(t('connectionError'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  useEffect(() => {
    const handleNewNotification = (notification: NotificationDTO) => {
      setNotifications(prev => [notification, ...prev]);
    };

    const handleError = () => {
      setSseConnected(false);
    };

    const cleanup = notificationService.connectToNotifications(
      (notification) => {
        setSseConnected(true);
        handleNewNotification(notification);
      },
      handleError
    );

    setSseConnected(true);

    return cleanup;
  }, []);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      );
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    const unreadNotifications = notifications.filter(n => !n.isRead);
    for (const notification of unreadNotifications) {
      await handleMarkAsRead(notification.id);
    }
  };

  const handleNotificationClick = async (notification: NotificationDTO) => {
    if (!notification.isRead) {
      await handleMarkAsRead(notification.id);
    }

    if (notification.type === 'MESSAGE' && notification.discussionId) {
      router.push(`/${locale}/advisor/messaging?discussionId=${notification.discussionId}`);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, { bg: string; icon: string }> = {
      MESSAGE: { bg: 'bg-blue-100 text-blue-600', icon: '💬' },
      info: { bg: 'bg-blue-100 text-blue-600', icon: 'ℹ️' },
      warning: { bg: 'bg-yellow-100 text-yellow-600', icon: '⚠️' },
      success: { bg: 'bg-green-100 text-green-600', icon: '✓' },
      alert: { bg: 'bg-red-100 text-red-600', icon: '❗' },
    };
    return icons[type] || icons.info;
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Typography variant="h2" color="primary" className="mb-2">
              {t('title')}
            </Typography>
            <div className="flex items-center gap-3">
              {sseConnected && (
                <span className="flex items-center text-sm text-green-600">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-2 animate-pulse"></span>
                </span>
              )}
              {unreadCount > 0 && (
                <span className="text-sm text-gray-600">
                  {unreadCount} {t('unread')}
                </span>
              )}
            </div>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllAsRead}
            >
              {t('markAllRead')}
            </Button>
          )}
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-lg shadow border border-gray-200 p-4 animate-pulse">
                <div className="h-4 bg-gray-100 rounded w-1/4 mb-2"></div>
                <div className="h-4 bg-gray-100 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-white rounded-lg shadow border border-gray-200 p-8 text-center">
            <Typography variant="body" className="text-gray-500">
              {t('noNotifications')}
            </Typography>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => {
              const typeStyle = getTypeIcon(notification.type);
              return (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`bg-white rounded-lg shadow border p-4 transition-all hover:shadow-md cursor-pointer ${
                    notification.isRead
                      ? 'border-gray-200 opacity-75'
                      : 'border-clean-dark bg-blue-50/30'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${typeStyle.bg}`}>
                        {typeStyle.icon} {notification.type}
                      </span>
                      {!notification.isRead && (
                        <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatDate(notification.createdAt)}
                    </span>
                  </div>
                  
                  <Typography variant="h4" className="mb-1 text-gray-900">
                    {notification.title}
                  </Typography>
                  
                  <Typography variant="body" className="text-gray-600 mb-2">
                    {notification.message}
                  </Typography>

                  {notification.senderName && (
                    <Typography variant="caption" className="text-gray-400">
                      De : {notification.senderName}
                    </Typography>
                  )}

                  {notification.type === 'MESSAGE' && notification.discussionId && (
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <Typography variant="caption" className="text-clean-dark">
                        → {t('clickToViewMessage')}
                      </Typography>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
