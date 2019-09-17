import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { AboutModalComponent } from '../about-modal/about-modal.component';

@Component({
  selector: 'sdal-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  constructor(public dialog: MatDialog) { }

  openModal(): void {
    const dialogRef = this.dialog.open(AboutModalComponent, {
      width: '100vw',
      maxWidth: '700px',
      panelClass: 'about-modal-pane',
      autoFocus: false,
      // maxHeight: '90vh'
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
    //   this.animal = result;
    // });
  }

}
