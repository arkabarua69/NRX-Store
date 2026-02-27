import { Product } from "@/lib/types";

export const ADMIN_EMAILS = ["admin@nrxstore.com", "nrxadmin@gmail.com"];

export const PAYMENT_METHODS = {
  bkash: {
    number: "+8801883800356",
    type: "Send Money",
    logo: "https://freelogopng.com/images/all_img/1656234745bkash-app-logo-png.png",
  },
  nagad: {
    number: "+8801883800356",
    type: "Send Money",
    logo: "https://freelogopng.com/images/all_img/1679248787Nagad-Logo.png",
  },
  rocket: {
    number: "+8801580831611",
    type: "Send Money",
    logo: "https://static.vecteezy.com/system/resources/thumbnails/068/706/013/small/rocket-color-logo-mobile-banking-icon-free-png.png",
  },
} as const;

export const PRODUCTS: Product[] = [
  { id: "d1", name: "Mini Pack", nameBn: "মিনি প্যাক", diamonds: 25, price: 30, category: "budget", rating: 4.2, image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=400&fit=crop" },
  { id: "d2", name: "Starter Pack", nameBn: "স্টার্টার প্যাক", diamonds: 50, price: 45, category: "budget", rating: 4.5, image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=400&fit=crop" },
  { id: "d3", name: "Basic Pack", nameBn: "বেসিক প্যাক", diamonds: 115, price: 85, category: "budget", rating: 4.6, badge: "Best Value", image: "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=400&h=400&fit=crop" },
  { id: "d4", name: "Standard Pack", nameBn: "স্ট্যান্ডার্ড প্যাক", diamonds: 240, price: 160, category: "standard", rating: 4.7, image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&h=400&fit=crop" },
  { id: "d5", name: "Value Pack", nameBn: "ভ্যালু প্যাক", diamonds: 355, price: 240, category: "standard", rating: 4.7, image: "https://images.unsplash.com/photo-1556438064-2d7646166914?w=400&h=400&fit=crop" },
  { id: "d6", name: "Gamer Choice", nameBn: "গেমার্স চয়েস", diamonds: 405, price: 275, category: "standard", rating: 4.8, badge: "Popular", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=400&fit=crop" },
  { id: "d7", name: "Elite Pack", nameBn: "এলিট প্যাক", diamonds: 505, price: 330, category: "standard", rating: 4.8, image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&h=400&fit=crop" },
  { id: "d8", name: "Pro Pack", nameBn: "প্রো প্যাক", diamonds: 610, price: 410, category: "standard", rating: 4.7, image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400&h=400&fit=crop" },
  { id: "d9", name: "Mega Bundle", nameBn: "মেগা বান্ডেল", diamonds: 850, price: 570, category: "premium", rating: 4.9, image: "https://images.unsplash.com/photo-1614294148960-9aa740632a87?w=400&h=400&fit=crop" },
  { id: "d10", name: "Super Bundle", nameBn: "সুপার বান্ডেল", diamonds: 1090, price: 710, category: "premium", rating: 4.9, image: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400&h=400&fit=crop" },
  { id: "d11", name: "Master Pack", nameBn: "মাস্টার প্যাক", diamonds: 1240, price: 800, category: "premium", rating: 4.9, image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=400&h=400&fit=crop" },
  { id: "d12", name: "Grand Pack", nameBn: "গ্র্যান্ড প্যাক", diamonds: 1505, price: 950, category: "premium", rating: 5.0, image: "https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=400&h=400&fit=crop" },
  { id: "d13", name: "Royal Pack", nameBn: "রয়্যাল প্যাক", diamonds: 1850, price: 1175, category: "premium", rating: 5.0, image: "https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=400&h=400&fit=crop" },
  { id: "d14", name: "Titan Pack", nameBn: "টাইটান প্যাক", diamonds: 2090, price: 1325, category: "premium", rating: 5.0, image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=400&fit=crop" },
  { id: "d15", name: "Supreme Pack", nameBn: "সুপ্রিম প্যাক", diamonds: 2530, price: 1550, category: "premium", rating: 5.0, image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400&h=400&fit=crop" },
  { id: "d16", name: "Legendary Pack", nameBn: "কিংবদন্তি প্যাক", diamonds: 3010, price: 1800, category: "premium", rating: 5.0, badge: "HOT", image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&h=400&fit=crop" },
  { id: "d17", name: "Ultimate Pack", nameBn: "আল্টিমেট প্যাক", diamonds: 5060, price: 3050, category: "premium", rating: 5.0, image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=400&fit=crop" },
  { id: "d18", name: "Whale Pack", nameBn: "হোয়েল প্যাক", diamonds: 10120, price: 6060, category: "premium", rating: 5.0, badge: "VIP", image: "https://images.unsplash.com/photo-1556438064-2d7646166914?w=400&h=400&fit=crop" },
  { id: "m1", name: "Weekly Lite", nameBn: "উইকলি লাইট", diamonds: "LITE", price: 45, category: "membership", rating: 4.5, isMembership: true, image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=400&fit=crop" },
  { id: "m2", name: "Weekly Offer", nameBn: "উইকলি মেম্বারশিপ", diamonds: "WEEKLY", price: 150, category: "membership", rating: 4.9, isMembership: true, badge: "Best Offer", image: "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=400&h=400&fit=crop" },
  { id: "m3", name: "Monthly Offer", nameBn: "মান্থলি মেম্বারশিপ", diamonds: "MONTHLY", price: 750, category: "membership", rating: 5.0, isMembership: true, image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&h=400&fit=crop" },
];

export const CATEGORIES = [
  { id: "all", name: "সব প্যাকেজ", icon: "💎" },
  { id: "budget", name: "বাজেট প্যাক", icon: "✨" },
  { id: "standard", name: "জনপ্রিয়", icon: "⭐" },
  { id: "premium", name: "বিগ প্যাক", icon: "🔥" },
  { id: "membership", name: "মেম্বারশিপ", icon: "👑" },
] as const;
