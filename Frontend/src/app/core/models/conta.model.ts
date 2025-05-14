import { StatusConta } from './status-conta.enum';

export interface Conta {
    id: string;
    saldo: number;
    status: StatusConta;
    // Adicionar outras propriedades conforme necessário, ex: clienteId, nomeCliente
}
