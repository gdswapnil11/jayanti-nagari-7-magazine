import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home.component').then(m => m.HomeComponent) },
  { path: 'stories', loadComponent: () => import('./pages/stories.component').then(m => m.StoriesComponent) },
  { path: 'articles', loadComponent: () => import('./pages/articles.component').then(m => m.ArticlesComponent) },
  { path: 'articles/:id', loadComponent: () => import('./pages/article-detail.component').then(m => m.ArticleDetailComponent) },
  { path: 'events', loadComponent: () => import('./pages/events.component').then(m => m.EventsComponent) },
  { path: 'gallery', loadComponent: () => import('./pages/gallery.component').then(m => m.GalleryComponent) },
  { path: 'people', loadComponent: () => import('./pages/people.component').then(m => m.PeopleComponent) },
  { path: 'community', loadComponent: () => import('./pages/community.component').then(m => m.CommunityComponent) },
  { path: '**', redirectTo: '' }
];