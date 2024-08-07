export interface Productos {
  id: number,
  nombre_producto: string,
  descripcion: string,
  precio: number,
  cantidad_stock: number,
  estado: string,
  id_categoria: number,
  id_almacen: number,
  imagen_producto: string
}