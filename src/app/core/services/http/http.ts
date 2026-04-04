import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Http {
  private httpClient = inject(HttpClient);

  get<T>(path: string, params?: HttpParams): Promise<T> {
    return firstValueFrom(this.httpClient.get<T>(path, { params: params }));
  }

  post<T>(path: string, body?: unknown, params?: HttpParams): Promise<T> {
    return firstValueFrom(this.httpClient.post<T>(path, body, { params: params }));
  }

  put<T>(path: string, body?: unknown, params?: HttpParams): Promise<T> {
    return firstValueFrom(this.httpClient.put<T>(path, body, { params: params }));
  }

  patch<T>(path: string, body?: unknown, params?: HttpParams): Promise<T> {
    return firstValueFrom(this.httpClient.patch<T>(path, body, { params: params }));
  }

  delete<T>(path: string, body?: unknown, params?: HttpParams): Promise<T> {
    return firstValueFrom(this.httpClient.delete<T>(path, { body: body, params: params }));
  }
}

export function url(...fragments: string[]): string {
  return fragments.map(encodeURIComponent).join('/');
}
