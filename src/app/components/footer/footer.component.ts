import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { AboutModalComponent } from '../about-modal/about-modal.component';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'sdal-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements AfterViewInit {

  constructor(
    public dialog: MatDialog,
    private readonly storage: StorageService,
  ) { }

  openModal(): void {
    const dialogRef = this.dialog.open(AboutModalComponent, {
      width: '100vw',
      maxWidth: '700px',
      panelClass: 'about-modal-pane',
      autoFocus: false,
      // maxHeight: '90vh'
    });
  }

  ngAfterViewInit() {
    const user = this.storage.getUser();
    if (!user) {
      this.storage.setUser({});
      this.openModal();
    }
  }

}
