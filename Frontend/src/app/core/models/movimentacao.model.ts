import { TipoMovimentacao } from './tipo-movimentacao.enum';

export interface Movimentacao {
    id: string;
    data: Date;
    valor: number;
    tipo: TipoMovimentacao;
    contaId: string;
    // Adicionar outras propriedades conforme necessário, ex: descricao, contaDestinoId
}
