import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, map, of, shareReplay, switchMap, tap, throwError } from 'rxjs';
import {
  MagazineEdition,
  MagazineManifest
} from '../models/magazine.model';

@Injectable({ providedIn: 'root' })
export class MagazineService {
  private readonly http = inject(HttpClient);
  private manifestRequest?: Observable<MagazineManifest>;
  private requestId = 0;

  readonly manifest = signal<MagazineManifest | null>(null);
  readonly edition = signal<MagazineEdition | null>(null);
  readonly loading = signal(true);
  readonly loadError = signal<string | null>(null);
  readonly availableEditions = computed(() => this.manifest()?.editions ?? []);

  load(): Observable<void> {
    this.loading.set(true);
    this.loadError.set(null);

    return this.getManifest().pipe(
      switchMap(manifest => this.loadEdition(manifest.currentEdition)),
      catchError(error => {
        this.setError(error);
        return of(undefined);
      })
    );
  }

  loadEdition(id: string): Observable<void> {
    const requestId = ++this.requestId;
    this.loading.set(true);
    this.loadError.set(null);

    return this.getManifest().pipe(
      switchMap(manifest => {
        if (!/^\d{4}-q[1-4]$/.test(id) || !manifest.editions.some(edition => edition.id === id && edition.published)) {
          return throwError(() => new Error(`Edition "${id}" is not available.`));
        }

        return this.http.get<MagazineEdition>(`assets/data/editions/${id}.json`).pipe(
          map(edition => {
            if (!this.isValidEdition(edition, id)) {
              throw new Error(`Edition "${id}" contains invalid magazine data.`);
            }
            return edition;
          }),
          tap(edition => {
            if (requestId === this.requestId) {
              this.edition.set(edition);
              this.loading.set(false);
            }
          }),
          map(() => undefined)
        );
      }),
      catchError(error => {
        if (requestId === this.requestId) {
          this.setError(error);
        }
        return of(undefined);
      })
    );
  }

  private getManifest(): Observable<MagazineManifest> {
    if (!this.manifestRequest) {
      this.manifestRequest = this.http.get<MagazineManifest>('assets/data/manifest.json').pipe(
        map(manifest => {
          if (!manifest
            || typeof manifest.currentEdition !== 'string'
            || !Array.isArray(manifest.editions)
            || manifest.editions.some(edition =>
              !edition
              || !/^\d{4}-q[1-4]$/.test(edition.id)
              || typeof edition.title !== 'string'
              || !/^Q[1-4]$/.test(edition.quarter)
              || typeof edition.year !== 'number'
              || typeof edition.published !== 'boolean')
            || !manifest.editions.some(edition => edition.id === manifest.currentEdition && edition.published)) {
            throw new Error('The magazine manifest has an invalid format.');
          }
          return manifest;
        }),
        tap(manifest => this.manifest.set(manifest)),
        shareReplay(1),
        catchError(error => {
          this.manifestRequest = undefined;
          return throwError(() => error);
        })
      );
    }

    return this.manifestRequest;
  }

  private isValidEdition(edition: MagazineEdition, id: string): boolean {
    return !!edition
      && edition.id === id
      && typeof edition.title === 'string'
      && /^Q[1-4]$/.test(edition.quarter)
      && typeof edition.year === 'number'
      && Array.isArray(edition.stories)
      && Array.isArray(edition.events)
      && Array.isArray(edition.community)
      && Array.isArray(edition.articles)
      && Array.isArray(edition.gallery)
      && Array.isArray(edition.announcements)
      && Array.isArray(edition.advertisements);
  }

  private setError(error: unknown): void {
    this.edition.set(null);
    this.loading.set(false);
    this.loadError.set(
      error instanceof HttpErrorResponse
        ? 'Magazine content could not be loaded. Check that the manifest and edition JSON files are available.'
        : error instanceof Error
          ? error.message
          : 'Magazine content could not be loaded.'
    );
  }
}
