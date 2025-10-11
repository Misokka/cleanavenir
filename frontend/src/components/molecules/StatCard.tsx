import { Card } from '../atoms/Card';
import { Typography } from '../atoms/Typography';

interface StatCardProps {
  value: string;
  label: string;
  suffix?: string;
}

export const StatCard = ({ value, label, suffix }: StatCardProps) => {
  return (
    <Card className="text-center bg-clean-light">
      <Typography variant="h2" color="secondary" className="mb-2">
        {value}{suffix}
      </Typography>
      <Typography variant="body" color="muted">
        {label}
      </Typography>
    </Card>
  );
};