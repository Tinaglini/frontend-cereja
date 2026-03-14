import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoEventoFormComponent } from './tipo-evento-form.component';

describe('TipoEventoFormComponent', () => {
  let component: TipoEventoFormComponent;
  let fixture: ComponentFixture<TipoEventoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipoEventoFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipoEventoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
