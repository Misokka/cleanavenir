import cron from 'node-cron';
import { getContainer } from '../bootstrap/instance';

/**
 * Configure et démarre le cron job pour appliquer les intérêts quotidiens
 * S'exécute tous les jours à 00:01
 */
export function startSavingsInterestCron() {
  // Format cron : seconde minute heure jour mois jour_semaine
  // '1 0 * * *' = tous les jours à 00:01
  cron.schedule('1 0 * * *', async () => {
    console.log('[CRON] Début du calcul des intérêts journaliers épargne...');
    
    try {
      const container = getContainer();
      const result = await container.useCases.saving.applySavingDailyInterest.execute();

      if (result.ok) {
        console.log(`[CRON] Intérêts appliqués avec succès !`);
        // console.log(`[CRON] - Comptes traités : ${result.value.processed}`);
        // console.log(`[CRON] - Total intérêts : ${(result.value.totalInterest / 100).toFixed(2)}€`);
      } else {
        console.error(`[CRON] Erreur lors du calcul des intérêts :`, result.error.message);
      }
    } catch (error) {
      console.error('[CRON] Exception lors du calcul des intérêts :', error);
    }
  });

  console.log('[CRON] Cron job intérêts épargne configuré (tous les jours à 00:01)');
}
