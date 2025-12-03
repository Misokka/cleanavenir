"use client";
import { useTranslations } from 'next-intl';
import { Typography } from '../atoms/Typography';
import { FeatureCard } from '../molecules/FeatureCard';

export const Features = () => {
  const t = useTranslations('Home.features');

  const features = [
    {
      icon: "", 
      title: t('items.0.title'),
      description: t('items.0.description'),
    },
    {
      icon: "", 
      title: t('items.1.title'),
      description: t('items.1.description'),
    },
    {
      icon: "", 
      title: t('items.2.title'),
      description: t('items.2.description'),
    },
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <Typography variant="h2" className="mb-4">
            {t('title')}
          </Typography>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};