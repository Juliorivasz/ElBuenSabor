export class NuevoRubroInsumoDto {
  nombre: string;
  dadoDeBaja: boolean;
  idRubroInsumoPadre: number | null;

  constructor(nombre: string, dadoDeBaja = false, idRubroInsumoPadre: number | null = null) {
    this.nombre = nombre;
    this.dadoDeBaja = dadoDeBaja;
    this.idRubroInsumoPadre = idRubroInsumoPadre;
  }

  toJSON() {
    return {
      nombre: this.nombre,
      dadoDeBaja: this.dadoDeBaja,
      idRubroInsumoPadre: this.idRubroInsumoPadre || 0,
    };
  }
}
