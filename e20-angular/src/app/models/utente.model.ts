export interface Utente {
  username: string;
  nome: string;
  cognome: string;
  email: string;
  luogo: string;
  dataNascita: string;
  seguiti: string[];
  seguaci: string[];
  preferiti: number[];
}
