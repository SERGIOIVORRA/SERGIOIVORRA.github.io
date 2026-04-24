import { Routes } from '@angular/router';
import { AngularProPageComponent } from './pages/angular-pro-page.component';
import { CollectionDetailPageComponent } from './pages/collection-detail-page.component';
import { CollectionsPageComponent } from './pages/collections-page.component';
import { HomePageComponent } from './pages/home-page.component';
import { ProductPageComponent } from './pages/product-page.component';
import { ProjectStructurePageComponent } from './pages/project-structure-page.component';
import { PerformanceLabPageComponent } from './pages/performance-lab-page.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'collections', component: CollectionsPageComponent },
  { path: 'collections/:handle', component: CollectionDetailPageComponent },
  { path: 'angular-pro', component: AngularProPageComponent },
  { path: 'performance-lab', component: PerformanceLabPageComponent },
  { path: 'product/:handle', component: ProductPageComponent },
  { path: 'project-structure', component: ProjectStructurePageComponent },
  { path: '**', redirectTo: '' }
];
