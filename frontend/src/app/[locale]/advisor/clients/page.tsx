import { Metadata } from 'next';
import { DashboardLayout } from '@/components/templates/DashboardLayout';
import ClientsClient from './ClientsClient';

export const metadata: Metadata = {
  title: 'Mes clients - Clean Avenir',
  description: 'Liste de mes clients et leurs prêts',
};

export default function ClientsPage() {
  return (
    <DashboardLayout>
      <ClientsClient />
    </DashboardLayout>
  );
}
