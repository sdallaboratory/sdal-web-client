import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatCardModule,
  MatInputModule,
  MatSidenavModule,
  MatToolbarModule,
  MatListModule,
  MatIconModule,
  MatTooltipModule,
  MatChipsModule
} from '@angular/material';

const imports = [
  MatButtonModule,
  MatCardModule,
  MatInputModule,
  MatSidenavModule,
  MatToolbarModule,
  MatListModule,
  MatIconModule,
  MatTooltipModule,
  MatChipsModule
];

@NgModule({
  declarations: [],
  imports,
  exports: imports,
})
export class MaterialImportsModule { }
