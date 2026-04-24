import { Routes } from '@angular/router';
import { CollectionsPageComponent } from './pages/collections-page.component';
import { HomePageComponent } from './pages/home-page.component';
import { ProductPageComponent } from './pages/product-page.component';
import { ProjectStructurePageComponent } from './pages/project-structure-page.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'collections', component: CollectionsPageComponent },
  { path: 'collections/:handle', component: CollectionsPageComponent },
  { path: 'product/:handle', component: ProductPageComponent },
  { path: 'project-structure', component: ProjectStructurePageComponent },
  { path: '**', redirectTo: '' }
];
