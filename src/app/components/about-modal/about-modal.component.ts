import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { ThemeService } from 'src/app/services/theme.service';

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
    public readonly theme: ThemeService,
  ) { }

  close(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

  async send() {
    this.sent = true;
    await this.api.sendComment(this.comment).toPromise();
    this.comment = '';
  }

}
