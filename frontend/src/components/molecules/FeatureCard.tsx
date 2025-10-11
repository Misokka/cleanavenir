import { Card } from '../atoms/Card';
import { Typography } from '../atoms/Typography';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

export const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <Card className="text-center hover:shadow-lg transition-shadow">
      <div className="text-4xl mb-4">{icon}</div>
      <Typography variant="h4" className="mb-3">
        {title}
      </Typography>
      <Typography color="muted">
        {description}
      </Typography>
    </Card>
  );
};