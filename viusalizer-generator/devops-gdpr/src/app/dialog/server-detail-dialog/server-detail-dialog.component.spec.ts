import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerDetailDialogComponent } from './server-detail-dialog.component';

describe('ServerDetailDialogComponent', () => {
  let component: ServerDetailDialogComponent;
  let fixture: ComponentFixture<ServerDetailDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServerDetailDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServerDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
