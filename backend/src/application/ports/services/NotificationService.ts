export interface NotificationService {
    notifyUser(userId: string, message: string): Promise<void>
}