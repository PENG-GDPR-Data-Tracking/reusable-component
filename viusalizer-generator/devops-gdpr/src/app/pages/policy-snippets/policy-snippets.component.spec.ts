import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicySnippetsComponent } from './policy-snippets.component';

describe('PolicySnippetsComponent', () => {
  let component: PolicySnippetsComponent;
  let fixture: ComponentFixture<PolicySnippetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolicySnippetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicySnippetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
