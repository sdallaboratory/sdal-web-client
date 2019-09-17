import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'sdal-about-modal',
  templateUrl: './about-modal.component.html',
  styleUrls: ['./about-modal.component.scss']
})
export class AboutModalComponent implements OnInit {

  public comment = '';
  public sent = false;

  constructor(
    public dialogRef: MatDialogRef<AboutModalComponent>,
    private readonly api: ApiService,
  ) { }

  close(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

  send() {
    this.api.sendComment(this.comment);
    this.comment = '';
  }

}
