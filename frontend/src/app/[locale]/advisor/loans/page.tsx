import { Metadata } from 'next';
import { DashboardLayout } from '@/components/templates/DashboardLayout';
import LoansClient from './LoansClient';

export const metadata: Metadata = {
  title: 'Demandes de prêts - Clean Avenir',
  description: 'Gestion des demandes de prêts en attente',
};

export default function LoansPage() {
  return (
    <DashboardLayout>
      <LoansClient />
    </DashboardLayout>
  );
}
