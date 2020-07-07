import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PolicySnippetsComponent } from './pages/policy-snippets/policy-snippets.component';
import { AppComponent } from './app.component';
import { VisualizerComponent } from './pages/visualizer/visualizer.component';

const routes: Routes = [
  {
    component: PolicySnippetsComponent,
    path: 'policy-snippets',
  },
  {
    component: VisualizerComponent,
    path: 'visualizer',
  },
  {
    path: '**',
    redirectTo: 'visualizer',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
