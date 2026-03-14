import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitacaoListComponent } from './solicitacao-list.component';

describe('SolicitacaoListComponent', () => {
  let component: SolicitacaoListComponent;
  let fixture: ComponentFixture<SolicitacaoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitacaoListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitacaoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
