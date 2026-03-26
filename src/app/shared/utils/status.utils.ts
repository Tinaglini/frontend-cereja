export type StatusOrcamento = 'PENDENTE' | 'APROVADO' | 'REJEITADO' | 'CANCELADO';

export function getStatusClass(status: string): string {
  switch (status) {
    case 'PENDENTE': return 'bg-warning text-dark';
    case 'APROVADO': return 'bg-success text-white';
    case 'REJEITADO': return 'bg-danger text-white';
    case 'CANCELADO': return 'bg-secondary text-white';
    default: return 'bg-light text-dark';
  }
}

export function getStatusIcon(status: string): string {
  switch (status) {
    case 'PENDENTE': return 'fas fa-clock';
    case 'APROVADO': return 'fas fa-check-circle';
    case 'REJEITADO': return 'fas fa-times-circle';
    case 'CANCELADO': return 'fas fa-ban';
    default: return 'fas fa-info-circle';
  }
}
