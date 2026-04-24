import { Routes } from '@angular/router';
import { CollectionDetailPageComponent } from './pages/collection-detail-page.component';
import { CollectionsPageComponent } from './pages/collections-page.component';
import { HomePageComponent } from './pages/home-page.component';
import { ProductPageComponent } from './pages/product-page.component';
import { ProjectStructurePageComponent } from './pages/project-structure-page.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'collections', component: CollectionsPageComponent },
  { path: 'collections/:handle', component: CollectionDetailPageComponent },
  { path: 'product/:handle', component: ProductPageComponent },
  { path: 'project-structure', component: ProjectStructurePageComponent },
  { path: '**', redirectTo: '' }
];
