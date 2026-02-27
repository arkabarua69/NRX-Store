import { SiteSettings } from "@/lib/types";

export type { SiteSettings };

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export function subscribeToSettings(callback: (settings: SiteSettings) => void) {
  // Fetch settings initially
  getSettings().then(callback);
  
  // Poll for updates every 10 seconds
  const interval = setInterval(async () => {
    const settings = await getSettings();
    callback(settings);
  }, 10000);
  
  // Return unsubscribe function
  return () => clearInterval(interval);
}

export async function getSettings(): Promise<SiteSettings> {
  try {
    const response = await fetch(`${API_BASE}/settings`);
    if (!response.ok) throw new Error("Failed to fetch settings");
    return response.json();
  } catch (error) {
    console.error("Error fetching settings:", error);
    return getDefaultSettings();
  }
}

export async function updateSettings(updates: Partial<SiteSettings>) {
  const response = await fetch(`${API_BASE}/settings`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!response.ok) throw new Error("Failed to update settings");
}

function getDefaultSettings(): SiteSettings {
  return {
    adminEmails: ["gunjonarka@gmail.com"],
    paymentMethods: {
      bkash: {
        number: "+8801883800356",
        type: "Send Money",
        logo: "https://freelogopng.com/images/all_img/1656234745bkash-app-logo-png.png",
        enabled: true,
      },
      nagad: {
        number: "+8801883800356",
        type: "Send Money",
        logo: "https://freelogopng.com/images/all_img/1679248787Nagad-Logo.png",
        enabled: true,
      },
      rocket: {
        number: "+8801580831611",
        type: "Send Money",
        logo: "https://static.vecteezy.com/system/resources/thumbnails/068/706/013/small/rocket-color-logo-mobile-banking-icon-free-png.png",
        enabled: true,
      },
    },
    siteName: "NRX Store",
    siteNameBn: "এনআরএক্স স্টোর",
    supportWhatsapp: "+8801883800356",
    supportEmail: "support@nrxstore.com",
    maintenanceMode: false,
    announcementBanner: {
      enabled: false,
      message: "",
      messageBn: "",
      type: "info",
    },
  };
}
