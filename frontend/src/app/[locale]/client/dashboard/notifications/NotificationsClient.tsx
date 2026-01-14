'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { DashboardLayout } from '@/components/templates/DashboardLayout';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { notificationService, NotificationDTO } from '@/infrastructure/web/services/notificationService';

interface NotificationsClientProps {
  locale: string;
}

export default function NotificationsClient({ locale }: NotificationsClientProps) {
  const t = useTranslations('Notifications');
  
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
      info: { bg: 'bg-blue-100 text-blue-600', icon: '' },
      warning: { bg: 'bg-yellow-100 text-yellow-600', icon: '' },
      success: { bg: 'bg-green-100 text-green-600', icon: '' },
      alert: { bg: 'bg-red-100 text-red-600', icon: '' },
    };
    return icons[type] || icons.info;
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8 text-clean-dark"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
            <div>
              <Typography variant="h2" color="primary">
                {t('title')}
              </Typography>
              {unreadCount > 0 && (
                <Typography variant="caption" color="muted">
                  {unreadCount} {t('unread')}
                </Typography>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {sseConnected && (
              <span className="flex items-center gap-1 text-sm text-green-600">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Live
              </span>
            )}
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
                {t('markAllAsRead')}
              </Button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-20 bg-gray-100 rounded-lg"></div>
              ))}
            </div>
            <Typography variant="body" color="muted" className="mt-4">
              {t('loading')}
            </Typography>
          </div>
        ) : error ? (
          <div className="bg-red-50 rounded-lg p-6 text-center">
            <Typography variant="body" color="muted">
              {error}
            </Typography>
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="currentColor"
              className="w-16 h-16 mx-auto mb-4 text-gray-300"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
              />
            </svg>
            <Typography variant="body" color="muted">
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
                  className={`bg-white rounded-lg shadow border p-4 transition-all ${
                    notification.isRead 
                      ? 'border-gray-200 opacity-70' 
                      : 'border-clean-dark border-l-4'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${typeStyle.bg}`}>
                      <span>{typeStyle.icon}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <Typography variant="body" className="font-medium">
                            {notification.title}
                          </Typography>
                          <Typography variant="caption" color="muted">
                            {formatDate(notification.createdAt)}
                            {notification.senderName && ` • ${notification.senderName}`}
                          </Typography>
                        </div>
                        {!notification.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="text-sm text-clean-dark hover:underline"
                          >
                            {t('markAsRead')}
                          </button>
                        )}
                      </div>
                      <Typography variant="body" color="muted" className="mt-2">
                        {notification.message}
                      </Typography>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
