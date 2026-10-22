import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home.component').then(m => m.HomeComponent) },
  { path: 'stories', loadComponent: () => import('./pages/articles.component').then(m => m.ArticlesComponent) },
  { path: 'stories/:id', loadComponent: () => import('./pages/article-detail.component').then(m => m.ArticleDetailComponent) },
  { path: 'articles', redirectTo: 'stories', pathMatch: 'full' },
  { path: 'articles/:id', redirectTo: 'stories/:id' },
  { path: 'events', loadComponent: () => import('./pages/events.component').then(m => m.EventsComponent) },
  { path: 'gallery', loadComponent: () => import('./pages/gallery.component').then(m => m.GalleryComponent) },
  { path: 'move-in-corner', loadComponent: () => import('./pages/move-in-corner.component').then(m => m.MoveInCornerComponent) },
  { path: 'community', loadComponent: () => import('./pages/community.component').then(m => m.CommunityComponent) },
  { path: 'service-directory', loadComponent: () => import('./pages/service-directory.component').then(m => m.ServiceDirectoryComponent) },
  { path: 'offers', loadComponent: () => import('./pages/offers.component').then(m => m.OffersComponent) },
  { path: 'terms', loadComponent: () => import('./pages/terms.component').then(m => m.TermsComponent) },
  { path: 'archive', loadComponent: () => import('./pages/archive.component').then(m => m.ArchiveComponent) },
  { path: 'editions/:editionId', loadComponent: () => import('./pages/edition-viewer.component').then(m => m.EditionViewerComponent) },
  { path: '**', redirectTo: '' }
];