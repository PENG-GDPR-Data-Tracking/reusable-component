import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-connection-detail-dialog',
  templateUrl: './connection-detail-dialog.component.html',
  styleUrls: ['./connection-detail-dialog.component.scss'],
})
export class ConnectionDetailDialogComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {}
}
