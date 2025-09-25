import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment'; // Assuming environment.ts

@Injectable({
  providedIn: 'root'
})
export class RawStoneService {
  private rawStoneEntryIdSubject = new BehaviorSubject<number | null>(null);
  rawStoneEntryId$ = this.rawStoneEntryIdSubject.asObservable();

  private apiUrl = environment.apiBaseUrl; // Ensure this is correctly set up in your environments
  private createdRawStoneEntry: any = null;

  constructor(private http: HttpClient) { } // Removed ApiService as HttpClient is sufficient for direct calls

  /**
   * Creates a new stock entry for a stone.
   * Note: The `data` parameter here is FormData, and the field names within it
   * are expected to already be the 'st_' prefixed names from the component.
   * @param data The FormData containing the data for the new stock entry.
   * @returns Observable<any>
   */
  createRawStoneEntry(data: FormData): Observable<any> {
    // Assuming your API for creating stocks is POST /api/stocks
    return this.http.post(`${this.apiUrl}stocks`, data);
  }

  // You can add other CRUD operations here if needed, similar to RawMetalService
  // For example:
  getRawStoneEntries(): Observable<any> {
    return this.http.get(`${this.apiUrl}stocks?st_category=Stone`); // Example: filter by category 'Stone'
  }

  getRawStoneEntryById(id: any): Observable<any> {
    return this.http.get(`${this.apiUrl}stocks/${id}`);
  }

  updateRawStoneEntry(id: string | number, formData: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = {
      'X-HTTP-Method-Override': 'PUT',
      Authorization: `Bearer ${token}`,
    };
    return this.http.post(`${this.apiUrl}stocks/${id}`, formData, { headers });
  }

  deleteRawStoneEntry(id: any): Observable<any> {
    return this.http.delete(`${this.apiUrl}stocks/${id}`);
  }

  // Setters and getters for ID/created entry (optional, but good for shared state)
  setRawStoneEntryId(id: number): void {
    this.rawStoneEntryIdSubject.next(id);
  }

  getRawStoneEntryId(): number | null {
    return this.rawStoneEntryIdSubject.getValue();
  }

  setCreatedRawStoneEntry(entry: any): void {
    this.createdRawStoneEntry = entry;
  }

  getCreatedRawStoneEntry(): any {
    return this.createdRawStoneEntry;
  }

}
