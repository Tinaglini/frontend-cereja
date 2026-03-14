import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoEventoListComponent } from './tipo-evento-list.component';

describe('TipoEventoListComponent', () => {
  let component: TipoEventoListComponent;
  let fixture: ComponentFixture<TipoEventoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipoEventoListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipoEventoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
