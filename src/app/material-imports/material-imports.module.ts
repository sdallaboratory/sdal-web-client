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
  MatDialogModule,
  MatProgressSpinnerModule,
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
  MatDialogModule,
  MatProgressSpinnerModule,
];

@NgModule({
  declarations: [],
  imports,
  exports: imports,
})
export class MaterialImportsModule { }
