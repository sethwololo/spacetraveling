import { format as fnsFormat } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

export function format(date: string): string {
  return fnsFormat(new Date(date), 'd MMM yyyy', {
    locale: ptBR,
  });
}
