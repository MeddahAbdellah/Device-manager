enum StoredKeys {
  JWT_TOKEN = 'jwt_token',
  USER_ID = '',
}
export class LocalStorageHelper {
  public static storeToken(token: string): void {
    window.localStorage.setItem(StoredKeys.JWT_TOKEN, token);
  }

  public static storeUserId(userId: string): void {
    window.localStorage.setItem(StoredKeys.USER_ID, userId);
  }


  public static getToken(): string {
   return window.localStorage.getItem(StoredKeys.JWT_TOKEN) || '';
  }

  public static getUserId(): string {
    return window.localStorage.getItem(StoredKeys.USER_ID) || '';
   }

  public static cleanLocalStorage(): void {
    localStorage.clear();
  }
}