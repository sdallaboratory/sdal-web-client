import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'sdal-about-modal',
  templateUrl: './about-modal.component.html',
  styleUrls: ['./about-modal.component.scss']
})
export class AboutModalComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AboutModalComponent>) { }

  close(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

}
