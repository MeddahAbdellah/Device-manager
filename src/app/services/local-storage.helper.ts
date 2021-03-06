enum StoredKeys {
  JWT_TOKEN = 'jwt_token',
}
export class LocalStorageHelper {
  public static storeToken(token: string): void {
    window.localStorage.setItem(StoredKeys.JWT_TOKEN, token);
  }

  public static getToken(): string {
   return window.localStorage.getItem(StoredKeys.JWT_TOKEN) || '';
  }

  public static cleanLocalStorage(): void {
    localStorage.clear();
  }
}