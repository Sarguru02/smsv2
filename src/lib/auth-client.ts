export class AuthClient {
  private static readonly TOKEN_KEY = 'auth-token';

  static setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  static getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  static removeToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.TOKEN_KEY);
    }
  }

  static getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  static async authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
    const authHeaders = this.getAuthHeaders();
    
    return fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
        ...options.headers,
      },
    });
  }

  static async login(username: string, password: string): Promise<{ success: boolean; error?: string; user?: {id: string, username: string, role: string} }> {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        this.setToken(data.token);
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch {
      return { success: false, error: 'An error occurred during login' };
    }
  }

  static async logout(): Promise<void> {
    try {
      await this.authenticatedFetch('/api/auth/logout', {
        method: 'POST',
      });
    } catch {
      // Silently handle logout errors
    } finally {
      this.removeToken();
    }
  }

  static isAuthenticated(): boolean {
    return this.getToken() !== null;
  }
}
