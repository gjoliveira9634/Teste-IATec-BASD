import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface ClienteInfo {
  id: string;
  nome: string;
  email: string;
  contaId: string;
  saldo: number;
  status: string;
}

export interface ContaDetalhes {
  id: string;
  clienteId: string;
  clienteNome: string;
  clienteEmail: string;
  saldo: number;
  status: string;
  dataCriacao: Date;
  ultimaMovimentacao?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ManagerService {
  private apiUrl = '/api/gerente'; // URL base para APIs do gerente via BFF

  constructor(private http: HttpClient) { }

  getClientes(): Observable<ClienteInfo[]> {
    // GET /api/gerente/clientes
    console.log('ManagerService: getClientes chamado');
    // Dados mockados para desenvolvimento
    return of([
      { id: '1', nome: 'Cliente Um', email: 'cliente1@email.com', contaId: 'conta1', saldo: 1500.00, status: 'ATIVA' },
      { id: '2', nome: 'Cliente Dois', email: 'cliente2@email.com', contaId: 'conta2', saldo: 800.50, status: 'ATIVA' },
      { id: '3', nome: 'Cliente Três', email: 'cliente3@email.com', contaId: 'conta3', saldo: 0, status: 'INATIVA' },
    ]).pipe(
      tap(data => console.log('Clientes recebidos:', data)),
      catchError(err => {
        console.error('Erro ao buscar clientes', err);
        throw err;
      })
    );
  }

  getContaDetalhes(contaId: string): Observable<ContaDetalhes> {
    // GET /api/gerente/contas/{id}
    console.log(`ManagerService: getContaDetalhes chamado para conta ${contaId}`);
    // Dados mockados para desenvolvimento
    return of({
      id: contaId,
      clienteId: 'cliente1',
      clienteNome: 'Cliente Um',
      clienteEmail: 'cliente1@email.com',
      saldo: 1500.00,
      status: 'ATIVA',
      dataCriacao: new Date('2024-01-15'),
      ultimaMovimentacao: new Date('2024-05-01')
    }).pipe(
      tap(data => console.log('Detalhes da conta recebidos:', data)),
      catchError(err => {
        console.error('Erro ao buscar detalhes da conta', err);
        throw err;
      })
    );
  }

  criarConta(dadosConta: any): Observable<any> {
    // POST /api/gerente/contas
    console.log('ManagerService: criarConta chamado com', dadosConta);
    // Simulação de resposta de sucesso
    return of({
      id: 'nova-conta-123',
      message: 'Conta criada com sucesso',
      ...dadosConta
    }).pipe(
      tap(data => console.log('Conta criada:', data)),
      catchError(err => {
        console.error('Erro ao criar conta', err);
        throw err;
      })
    );
  }

  atualizarConta(contaId: string, dadosConta: any): Observable<any> {
    // PUT /api/gerente/contas/{id}
    console.log(`ManagerService: atualizarConta chamado para conta ${contaId} com`, dadosConta);
    // Simulação de resposta de sucesso
    return of({
      id: contaId,
      message: 'Conta atualizada com sucesso',
      ...dadosConta
    }).pipe(
      tap(data => console.log('Conta atualizada:', data)),
      catchError(err => {
        console.error('Erro ao atualizar conta', err);
        throw err;
      })
    );
  }

  ativarConta(contaId: string): Observable<any> {
    // PATCH /api/gerente/contas/{id}/ativar
    console.log(`ManagerService: ativarConta chamado para conta ${contaId}`);
    return of({ message: 'Conta ativada com sucesso' }).pipe(
      tap(data => console.log('Resposta de ativação:', data)),
      catchError(err => {
        console.error('Erro ao ativar conta', err);
        throw err;
      })
    );
  }

  inativarConta(contaId: string): Observable<any> {
    // PATCH /api/gerente/contas/{id}/inativar
    console.log(`ManagerService: inativarConta chamado para conta ${contaId}`);
    return of({ message: 'Conta inativada com sucesso' }).pipe(
      tap(data => console.log('Resposta de inativação:', data)),
      catchError(err => {
        console.error('Erro ao inativar conta', err);
        throw err;
      })
    );
  }

  excluirConta(contaId: string): Observable<any> {
    // DELETE /api/gerente/contas/{id}
    console.log(`ManagerService: excluirConta chamado para conta ${contaId}`);
    return of({ message: 'Conta excluída com sucesso' }).pipe(
      tap(data => console.log('Resposta de exclusão:', data)),
      catchError(err => {
        console.error('Erro ao excluir conta', err);
        throw err;
      })
    );
  }
}
