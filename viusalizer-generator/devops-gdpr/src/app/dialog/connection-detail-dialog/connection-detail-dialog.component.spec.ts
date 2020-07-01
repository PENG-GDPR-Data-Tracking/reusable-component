import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectionDetailDialogComponent } from './connection-detail-dialog.component';

describe('ConnectionDetailDialogComponent', () => {
  let component: ConnectionDetailDialogComponent;
  let fixture: ComponentFixture<ConnectionDetailDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectionDetailDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectionDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
