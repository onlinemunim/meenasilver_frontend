import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomizeService {
  // --- STATE MANAGEMENT FOR FORM FIELD VISIBILITY (Used by other components) ---
  // This part of the service can coexist with the new functionality.
  private generalFieldsVisibility = new BehaviorSubject<Set<string>>(new Set());
  private priceFieldsVisibility = new BehaviorSubject<Set<string>>(new Set());
  public generalFieldsVisibility$ = this.generalFieldsVisibility.asObservable();
  public priceFieldsVisibility$ = this.priceFieldsVisibility.asObservable();

  constructor(private apiService: ApiService) {
    // The cross-tab synchronization logic can remain if other parts of
    // your app use it. It does not interfere with the database calls.
  }

  /**
   * Updates field visibility state for other components.
   */
  public updateFieldVisibility(generalFields: string[], priceFields: string[]): void {
    this.generalFieldsVisibility.next(new Set(generalFields));
    this.priceFieldsVisibility.next(new Set(priceFields));
    // Any localStorage logic for cross-tab sync can remain here if needed.
  }

  // --- API METHODS FOR DATABASE INTERACTION ---

  /**
   * Fetches the settings for the currently authenticated user and a specific firm.
   * @param firmId The ID of the firm to get settings for.
   */
  getUserSettings(firmId: number): Observable<any> {
    return this.apiService.get(`customize-settings/my-settings?firm_id=${firmId}`);
  }

  /**
   * Saves settings for the currently authenticated user.
   * The backend uses updateOrCreate to handle both new and existing settings.
   * @param settingsData The settings object to save.
   */
  saveUserSettings(settingsData: any): Observable<any> {
    return this.apiService.post('customize-settings/my-settings', settingsData);
  }

  // --- Other existing service methods ---

  getCustomizeSettings(): Observable<any> {
    return this.apiService.get('customize_settings');
  }

  getCustomizeSettingById(id: any): Observable<any> {
    return this.apiService.get(`customize_settings/${id}`);
  }

  createCustomizeSetting(data: any): Observable<any> {
    return this.apiService.post('customize_settings', data);
  }

  updateCustomizeSetting(id: any, data: any): Observable<any> {
    return this.apiService.update(`customize_settings/${id}`, data);
  }

  deleteCustomizeSetting(id: any): Observable<any> {
    return this.apiService.delete(`customize_settings/${id}`);
  }

  // Methods for fetching next codes can remain as they are utility functions.
  getNextMetalCode(prefix: string) { return this.apiService.get(`stocks/next-code?prefix=${prefix}`); }
  getNextBarcode(prefix: string) { return this.apiService.get(`stock_details/next-code?prefix=${prefix}`); }
  getNextReadyProductCode(prefix: string): Observable<{ code: string }> { return this.apiService.get(`order_creation/next-code?prefix=${prefix}`); }
  getNextStoneCode(prefix: string): Observable<{ code: string }> { return this.apiService.get(`stocks/next-code?prefix=${prefix}`); }
}
