export const DEFAULT_OBSERVEES = [
  'Lazijmatul Hilma Kau, M.Pd',
  'Irfan Syahrul Basri, S.Pd',
  'Rizal Abdul, S.Kom',
  'Abdurrahman Abdullah, S.Pd.I',
  'Tomy P. Lawani, S.Pd',
  'Megawati Lihawa'
] as const;

export const STORAGE_KEY_OBSERVEES = 'pmm_custom_observees';

export function getStoredObservees(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_OBSERVEES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Ensure all default observees are included
        const set = new Set([...DEFAULT_OBSERVEES, ...parsed]);
        return Array.from(set);
      }
    }
  } catch (e) {
    console.warn('Error reading observees from localStorage:', e);
  }
  return [...DEFAULT_OBSERVEES];
}

export function saveStoredObservees(list: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_OBSERVEES, JSON.stringify(list));
  } catch (e) {
    console.warn('Error saving observees to localStorage:', e);
  }
}
