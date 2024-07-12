import { ClickOutsideDirective } from './click-outside.directive';
import { ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';

@Component({
  template: `<div appClickOutside (clickOutside)="onClickOutside()">Content</div>`
})
class TestComponent {
  onClickOutside() {}
}

describe('ClickOutsideDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClickOutsideDirective, TestComponent]
    });

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    const directive = new ClickOutsideDirective(new ElementRef(null));
    expect(directive).toBeTruthy();
  });

  it('should emit event when clicking outside', () => {
    spyOn(component, 'onClickOutside');

    const outsideElement = document.createElement('div');
    document.body.appendChild(outsideElement);

    outsideElement.click();
    fixture.detectChanges();

    expect(component.onClickOutside).toHaveBeenCalled();

    document.body.removeChild(outsideElement);
  });

  it('should not emit event when clicking inside', () => {
    spyOn(component, 'onClickOutside');

    const insideElement = fixture.debugElement.query(By.directive(ClickOutsideDirective)).nativeElement;
    insideElement.click();
    fixture.detectChanges();

    expect(component.onClickOutside).not.toHaveBeenCalled();
  });
});
