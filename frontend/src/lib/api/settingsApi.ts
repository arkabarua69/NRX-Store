import { API_URL, API_BASE } from "@/lib/config";

export interface SiteSettings {
  adminEmails: string[];
  paymentMethods: {
    bkash: { enabled: boolean; number: string; type: string };
    nagad: { enabled: boolean; number: string; type: string };
    rocket: { enabled: boolean; number: string; type: string };
    rupantorpay: { enabled: boolean; number: string; type: string };
  };
  siteName: string;
  siteNameBn: string;
  announcement: {
    enabled: boolean;
    message: string;
    messageBn: string;
  };
}

export async function fetchSettings(): Promise<SiteSettings> {
  const response = await fetch(`${API_URL}/settings`);
  if (!response.ok) throw new Error("Failed to fetch settings");
  return response.json();
}

export async function updateSettings(settings: Partial<SiteSettings>): Promise<void> {
  const response = await fetch(`${API_BASE}/settings`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(settings),
  });
  if (!response.ok) throw new Error("Failed to update settings");
}
