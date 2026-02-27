import { API_URL } from "./config";

export interface FAQ {
  id: string;
  question: string;
  questionBn: string;
  answer: string;
  answerBn: string;
  category: string;
  order: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export async function getAllFAQs(): Promise<FAQ[]> {
  try {
    const response = await fetch(`${API_URL}/faq`);
    
    if (!response.ok) {
      throw new Error("Failed to fetch FAQs");
    }
    
    const result = await response.json();
    
    // Backend returns { success: true, data: [...] }
    if (result.success && result.data) {
      return result.data;
    }
    
    // Fallback if data is directly in result
    return Array.isArray(result) ? result : [];
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    return [];
  }
}

export async function getFAQsByCategory(category: string): Promise<FAQ[]> {
  try {
    const allFAQs = await getAllFAQs();
    return allFAQs.filter(faq => faq.category === category);
  } catch (error) {
    console.error("Error fetching FAQs by category:", error);
    return [];
  }
}
