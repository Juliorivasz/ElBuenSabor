export class PromocionResumenDto {
  
  private precioBase: number;
  private precioPromocional: number;
  private ahorro: number;

  constructor(precioBase: number, precioPromocional: number, ahorro: number) {
    this.precioBase = precioBase;
    this.precioPromocional = precioPromocional;
    this.ahorro = ahorro;
  } 

  getPrecioBase(): number {
    return this.precioBase;
  }
  getPrecioPromocional(): number {
    return this.precioPromocional;
  }

  getAhorro(): number {
    return this.ahorro;
  }

  setPrecioBase(precioBase: number): void {
    this.precioBase = precioBase;
  }
  setPrecioPromocional(precioPromocional: number): void {
    this.precioPromocional = precioPromocional;
  }
  setAhorro(ahorro: number): void {
    this.ahorro = ahorro;
  }
  
  calcularDescuentoAplicado(): number {
    if (this.precioBase === 0) return 0;
    const descuentoReal = ((this.precioBase - this.precioPromocional) / this.precioBase) * 100;
    return Math.round(descuentoReal / 5) * 5;
  }
  
}