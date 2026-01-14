'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { DashboardLayout } from '@/components/templates/DashboardLayout';
import { Typography } from '@/components/atoms/Typography';
import { activityService, ActivityDTO } from '@/infrastructure/web/services/activityService';

interface ActivitiesClientProps {
  locale: string;
}

export default function ActivitiesClient({ locale }: ActivitiesClientProps) {
  const t = useTranslations('Activities');
  
  const [activities, setActivities] = useState<ActivityDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sseConnected, setSseConnected] = useState(false);

  const loadActivities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await activityService.listActivities(50, 0);
      setActivities(data);
    } catch {
      setError(t('connectionError'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  useEffect(() => {
    const handleNewActivity = (activity: ActivityDTO) => {
      setActivities(prev => [activity, ...prev]);
    };

    const handleError = () => {
      setSseConnected(false);
      setError(t('connectionError'));
    };

    const cleanup = activityService.connectToActivityFeed(
      (activity) => {
        setSseConnected(true);
        handleNewActivity(activity);
      },
      handleError
    );

    setSseConnected(true);

    return cleanup;
  }, [t]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getTypeStyle = (type: string) => {
    const styles: Record<string, string> = {
      news: 'bg-blue-100 text-blue-800',
      update: 'bg-green-100 text-green-800',
      alert: 'bg-red-100 text-red-800',
      promo: 'bg-purple-100 text-purple-800',
    };
    return styles[type] || 'bg-gray-100 text-gray-800';
  };

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      news: t('types.news'),
      update: t('types.update'),
      alert: t('types.alert'),
      promo: t('types.promo'),
    };
    return types[type] || type;
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Typography variant="h2" color="primary">
              {t('title')}
            </Typography>
            <Typography variant="body" color="muted">
              {t('description')}
            </Typography>
          </div>
          <div className="flex items-center gap-2">
            {sseConnected ? (
              <span className="flex items-center gap-1 text-sm text-green-600">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Live
              </span>
            ) : (
              <span className="flex items-center gap-1 text-sm text-gray-500">
                <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                {t('reconnecting')}
              </span>
            )}
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
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
        ) : activities.length === 0 ? (
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
                d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z"
              />
            </svg>
            <Typography variant="body" color="muted">
              {t('noActivities')}
            </Typography>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <article
                key={activity.id}
                className="bg-white rounded-lg shadow border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getTypeStyle(activity.type)}`}>
                      {getTypeLabel(activity.type)}
                    </span>
                    <Typography variant="caption" color="muted">
                      {formatDate(activity.createdAt)}
                    </Typography>
                  </div>
                </div>
                <Typography variant="h4" color="primary" className="mb-2">
                  {activity.title}
                </Typography>
                <Typography variant="body" color="muted" className="whitespace-pre-wrap">
                  {activity.content}
                </Typography>
                {activity.authorName && (
                  <Typography variant="caption" color="muted" className="mt-4 block">
                    Par {activity.authorName}
                  </Typography>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
