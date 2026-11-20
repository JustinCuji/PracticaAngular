import { Injectable } from '@angular/core';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from 'firebase/firestore';
import { db } from '../firebase.config';
import { Producto } from '../producto.model';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private coleccionProductos = collection(db, 'productos');

  // READ: Obtener todos los productos
  async obtenerProductos(): Promise<Producto[]> {
    const snapshot = await getDocs(this.coleccionProductos);
    return snapshot.docs.map((documento) => ({
      id: documento.id,
      ...(documento.data() as Producto)
    }));
  }

  // CREATE: Agregar un nuevo producto
  async agregarProducto(producto: Producto): Promise<void> {
    await addDoc(this.coleccionProductos, {
      nombre: producto.nombre,
      precio: Number(producto.precio),
      stock: Number(producto.stock),
      categoria: producto.categoria
    });
  }

  // UPDATE: Actualizar un producto existente
  async actualizarProducto(id: string, producto: Partial<Producto>): Promise<void> {
    const docRef = doc(db, 'productos', id);
    await updateDoc(docRef, {
      nombre: producto.nombre,
      precio: Number(producto.precio),
      stock: Number(producto.stock),
      categoria: producto.categoria
    });
  }

  // DELETE: Eliminar un producto
  async eliminarProducto(id: string): Promise<void> {
    const docRef = doc(db, 'productos', id);
    await deleteDoc(docRef);
  }
}