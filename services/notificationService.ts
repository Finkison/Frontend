import api from './api';

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  notif_type: string;
  action_url: string;
  icon: string;
  is_read: boolean;
  created_at: string;
}

export interface NotificationListResponse {
  success: boolean;
  unread_count: number;
  notifications: NotificationItem[];
}

export interface CreateNotificationPayload {
  target_student_id?: string;
  target_user_id?: string;
  channel?: "PUSH" | "SMS" | "EMAIL" | "TELEGRAM" | "IN_APP";
  notif_type?: string;
  title: string;
  body: string;
  action_url?: string;
  icon?: string;
}

export interface CreateNotificationResponse {
  success: boolean;
  id: string;
  notification: Pick<NotificationItem, "id" | "title" | "body" | "is_read">;
}

const notificationService = {
  list: () => api.get<NotificationListResponse>('/notifications/').then((res) => res.data),
  create: (payload: CreateNotificationPayload) =>
    api.post<CreateNotificationResponse>('/notifications/create/', payload).then((res) => res.data),
  markRead: (id: string) =>
    api.patch<{ success: boolean; id: string; is_read: boolean }>(`/notifications/${id}/read/`).then((res) => res.data),
  markAllRead: () =>
    api.post<{ success: boolean; updated_count: number }>('/notifications/mark-all-read/').then((res) => res.data),
};

export default notificationService;
