'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { DashboardLayout } from '@/components/templates/DashboardLayout';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { activityService, ActivityDTO, CreateActivityInput } from '@/infrastructure/web/services/activityService';

interface ActivitiesAdvisorClientProps {
  locale: string;
}

export default function ActivitiesAdvisorClient({ locale }: ActivitiesAdvisorClientProps) {
  const t = useTranslations('Activities');
  
  const [activities, setActivities] = useState<ActivityDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('news');
  const [submitting, setSubmitting] = useState(false);

  const loadActivities = useCallback(async () => {
    try {
      setLoading(true);
      const data = await activityService.listActivities(20, 0);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || submitting) return;

    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);

      const input: CreateActivityInput = {
        title: title.trim(),
        content: content.trim(),
        type,
      };

      const newActivity = await activityService.createActivity(input);
      setActivities(prev => [newActivity, ...prev]);
      setTitle('');
      setContent('');
      setType('news');
      setSuccess(t('create.success'));
      
      setTimeout(() => setSuccess(null), 3000);
    } catch {
      setError(t('create.error'));
    } finally {
      setSubmitting(false);
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

  const getTypeStyle = (activityType: string) => {
    const styles: Record<string, string> = {
      news: 'bg-blue-100 text-blue-800',
      update: 'bg-green-100 text-green-800',
      alert: 'bg-red-100 text-red-800',
      promo: 'bg-purple-100 text-purple-800',
    };
    return styles[activityType] || 'bg-gray-100 text-gray-800';
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <Typography variant="h2" color="primary" className="mb-6">
          {t('create.title')}
        </Typography>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('create.titleField')}
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t('create.titlePlaceholder')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clean-dark"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('create.content')}
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={t('create.contentPlaceholder')}
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clean-dark resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('create.type')}
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clean-dark"
                >
                  <option value="news">{t('types.news')}</option>
                  <option value="update">{t('types.update')}</option>
                  <option value="alert">{t('types.alert')}</option>
                  <option value="promo">{t('types.promo')}</option>
                </select>
              </div>

              {error && (
                <div className="bg-red-50 text-red-700 px-4 py-2 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg text-sm">
                  {success}
                </div>
              )}

              <Button
                type="submit"
                disabled={!title.trim() || !content.trim() || submitting}
                className="w-full"
              >
                {submitting ? '...' : t('create.submit')}
              </Button>
            </form>
          </div>

          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <Typography variant="h4" color="primary" className="mb-4">
              {t('title')}
            </Typography>

            {loading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-20 bg-gray-100 rounded-lg"></div>
                ))}
              </div>
            ) : activities.length === 0 ? (
              <Typography variant="body" color="muted">
                {t('noActivities')}
              </Typography>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto">
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="border-l-4 border-clean-dark pl-4 py-2"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getTypeStyle(activity.type)}`}>
                        {activity.type}
                      </span>
                      <Typography variant="caption" color="muted">
                        {formatDate(activity.createdAt)}
                      </Typography>
                    </div>
                    <Typography variant="body" className="font-medium">
                      {activity.title}
                    </Typography>
                    <Typography variant="caption" color="muted" className="line-clamp-2">
                      {activity.content}
                    </Typography>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
