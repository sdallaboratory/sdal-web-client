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
  MatChipsModule,
  MatSlideToggleModule,
  MatMenuModule,
  MatDialogModule
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
  MatChipsModule,
  MatSlideToggleModule,
  MatDialogModule
];

@NgModule({
  declarations: [],
  imports,
  exports: imports,
})
export class MaterialImportsModule { }
