import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../auth/login/login.component';
import { AuthGuard } from '../auth/auth.guard';
import { HomeComponent } from 'src/app/feature-modules/components/home/home.component';
import { SearchComponent } from 'src/app/feature-modules/components/search/search.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'flight-search', component: SearchComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
