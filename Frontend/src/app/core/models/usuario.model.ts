import { PerfilAcesso } from './perfil-acesso.enum';

export interface Usuario {
    id: string;
    nome: string;
    email: string;
    perfil: PerfilAcesso;
}
