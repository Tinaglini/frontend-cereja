import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitacaoFormComponent } from './solicitacao-form.component';

describe('SolicitacaoFormComponent', () => {
  let component: SolicitacaoFormComponent;
  let fixture: ComponentFixture<SolicitacaoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitacaoFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitacaoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
