import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppStateService {
  endpoints: string[] = [];

  constructor() {}
}
