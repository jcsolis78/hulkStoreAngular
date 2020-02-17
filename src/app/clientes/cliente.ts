import { Region } from './Region';
import { Factura } from '../facturas/models/factura';

export class Cliente {
    id:number;
    nombre:string;
    apellido:string;
    email:string;
    createAt:string;   
    foto: string;
    region: Region;
    facturas: Factura[] = [];
}
