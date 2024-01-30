export function getUserInfo(value: string | null): any {
    if (typeof localStorage !== 'undefined' && value) {
      const storedValue = localStorage.getItem(value);
      if (storedValue) {
        try {
          const UserInfo: any | {} = JSON.parse(storedValue);
          return UserInfo != null ? UserInfo : null;
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      }
    }
    return null
    }