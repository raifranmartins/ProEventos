import { Evento } from "./Evento";
import { RedeSocial } from "./RedeSocial";

export interface Palestrante {
  id: number;
  nome: string;
  imagemUrl: string;
  email: string;
  telefone: string;
  miniCurriculo: string ;
  redesSociais: RedeSocial[];
  palestrantesEventos : Evento[]
}
