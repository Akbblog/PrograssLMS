export interface SchoolBranding {
  logo?: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  motto?: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export const defaultSchoolBranding: SchoolBranding = {
  name: "Modern School",
  address: "123 Education Street, Learning City",
  phone: "+1 (555) 123-4567",
  email: "info@modernschool.edu",
  website: "www.modernschool.edu",
  motto: "Excellence in Education",
  colors: {
    primary: "#3B82F6", // blue-500
    secondary: "#10B981", // emerald-500
    accent: "#F59E0B", // amber-500
  }
};

// Function to get school branding from localStorage or API
export async function getSchoolBranding(): Promise<SchoolBranding> {
  try {
    // Try to get from localStorage first
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('schoolBranding');
      if (stored) {
        return JSON.parse(stored);
      }
    }
    
    // If not in localStorage, fetch from API
    const response = await fetch('/api/school/branding');
    if (response.ok) {
      const branding = await response.json();
      // Store in localStorage for future use
      if (typeof window !== 'undefined') {
        localStorage.setItem('schoolBranding', JSON.stringify(branding));
      }
      return branding;
    }
  } catch (error) {
    console.error('Failed to fetch school branding:', error);
  }
  
  // Return default branding as fallback
  return defaultSchoolBranding;
}

// Function to update school branding
export async function updateSchoolBranding(branding: SchoolBranding): Promise<void> {
  try {
    const response = await fetch('/api/school/branding', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(branding),
    });
    
    if (response.ok) {
      // Update localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('schoolBranding', JSON.stringify(branding));
      }
    } else {
      throw new Error('Failed to update school branding');
    }
  } catch (error) {
    console.error('Failed to update school branding:', error);
    throw error;
  }
}

// Function to get CSS variables for school branding
export function getBrandingCSSVariables(branding: SchoolBranding): string {
  return `
    :root {
      --school-primary: ${branding.colors.primary};
      --school-secondary: ${branding.colors.secondary};
      --school-accent: ${branding.colors.accent};
      --school-name: "${branding.name}";
      --school-motto: "${branding.motto || ''}";
    }
  `;
}

// Function to apply branding to a card template
export function applyBrandingToCard(branding: SchoolBranding, cardContent: string): string {
  return cardContent
    .replace(/#3B82F6/g, branding.colors.primary)
    .replace(/#10B981/g, branding.colors.secondary)
    .replace(/#F59E0B/g, branding.colors.accent)
    .replace(/Modern School/g, branding.name)
    .replace(/Excellence in Education/g, branding.motto || '');
}