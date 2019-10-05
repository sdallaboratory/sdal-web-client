import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VkOauthComponent } from './vk-oauth.component';

describe('VkOauthComponent', () => {
  let component: VkOauthComponent;
  let fixture: ComponentFixture<VkOauthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VkOauthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VkOauthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
