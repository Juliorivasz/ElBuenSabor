import { DetallePromocionDto } from "./dto/DetallePromocionDTO";

export class Promocion {
    private idPromocion: number;
    private titulo: string;
    private descripcion: string;
    private horarioInicio: string;
    private horarioFin: string;
    private activo: boolean;
    private url: string;
    private precioPromocion!: number;
    private detalles: DetallePromocionDto[];
    private tiempoDeCocina!: number;

    // Constructor con parámetros opcionales
    constructor(params?: {
        idPromocion: number;
        titulo: string;
        descripcion: string;
        horarioInicio: string;
        horarioFin: string;
        activo: boolean;
        url: string;
        precioPromocion: number;
        detalles?: DetallePromocionDto[] | null;
        tiempoDeCocina?: number;
    }) {
        if (params) {
            this.idPromocion = params.idPromocion;
            this.titulo = params.titulo;
            this.descripcion = params.descripcion;
            this.horarioInicio = params.horarioInicio;
            this.horarioFin = params.horarioFin;
            this.activo = params.activo;
            this.url = params.url;
            this.precioPromocion = params.precioPromocion;
            this.detalles = params.detalles || [];
            this.tiempoDeCocina = params.tiempoDeCocina || 0;
        } else {
            // Valores por defecto para constructor vacío
            this.idPromocion = 0;
            this.titulo = '';
            this.descripcion = '';
            this.horarioInicio = '';
            this.horarioFin = '';
            this.activo = false;
            this.url = '';
            this.detalles = [];
            this.tiempoDeCocina = 0;
        }
    }

    // Getters
    public getIdPromocion(): number { return this.idPromocion; }
    public getTitulo(): string { return this.titulo; }
    public getDescripcion(): string { return this.descripcion; }
    public getHorarioInicio(): string { return this.horarioInicio; }
    public getHorarioFin(): string { return this.horarioFin; }
    public getActivo(): boolean { return this.activo; }
    public getUrl(): string { return this.url; }
    public getPrecioPromocion(): number | undefined { return this.precioPromocion; }
    public getDetalles(): DetallePromocionDto[] { return this.detalles; }
    public getTiempoDeCocina(): number { return this.tiempoDeCocina; }

    // Setters
    public setIdPromocion(idPromocion: number): void { this.idPromocion = idPromocion; }
    public setTitulo(titulo: string): void { this.titulo = titulo; }
    public setDescripcion(descripcion: string): void { this.descripcion = descripcion; }
    public setHorarioInicio(horarioInicio: string): void { this.horarioInicio = horarioInicio; }
    public setHorarioFin(horarioFin: string): void { this.horarioFin = horarioFin; }
    public setActivo(activo: boolean): void { this.activo = activo; }
    public setUrl(url: string): void { this.url = url; }
    public setPrecioPromocion(precioPromocion: number): void { this.precioPromocion = precioPromocion; }
    public setDetalles(detalles: DetallePromocionDto[]): void { this.detalles = detalles; }
    public setTiempoDeCocina(tiempoDeCocina: number): void { this.tiempoDeCocina = tiempoDeCocina; }

    // Método seguro para obtener detalles
    public getDetallesSeguro(): DetallePromocionDto[] {
        return this.detalles || [];
    }
}