import { API_URL, API_BASE } from "@/lib/config";

export interface Notification {
  id: string;
  userId: string;
  orderId?: string;
  type: string;
  title: string;
  titleBn: string;
  message: string;
  messageBn: string;
  read: boolean;
  createdAt: Date;
  link?: string;
  isAdmin?: boolean;
}

export async function fetchNotifications(userId: string): Promise<Notification[]> {
  const response = await fetch(`${API_URL}/notifications/user/${userId}`);
  if (!response.ok) throw new Error("Failed to fetch notifications");
  return response.json();
}

export async function markNotificationAsRead(notificationId: string): Promise<void> {
  const response = await fetch(`${API_BASE}/notifications/read/${notificationId}`, {
    method: "PUT",
  });
  if (!response.ok) throw new Error("Failed to mark notification as read");
}

export async function markAllNotificationsAsRead(userId: string): Promise<void> {
  const response = await fetch(`${API_BASE}/notifications/user/${userId}/read-all`, {
    method: "PUT",
  });
  if (!response.ok) throw new Error("Failed to mark all notifications as read");
}
