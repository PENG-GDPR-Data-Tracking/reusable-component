import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-server-detail-dialog',
  templateUrl: './server-detail-dialog.component.html',
  styleUrls: ['./server-detail-dialog.component.scss'],
})
export class ServerDetailDialogComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {}
}
