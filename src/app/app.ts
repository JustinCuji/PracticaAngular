import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductoService } from './services/producto';
import { Producto } from './producto.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private productoService = inject(ProductoService);

  productos: Producto[] = [];
  nuevoProducto: Producto = { nombre: '', precio: 0, stock: 0, categoria: '' };
  editandoId: string | null = null;

  cargando = false;
  mensajeError = '';
  mensajeExito = '';
  erroresValidacion: string[] = [];

  ngOnInit(): void {
    this.cargarProductos();
  }

  async cargarProductos(): Promise<void> {
    this.cargando = true;
    this.mensajeError = '';
    try {
      this.productos = await this.productoService.obtenerProductos();
    } catch (error) {
      console.error(error);
      this.mensajeError = 'Error al consultar los productos en Cloud Firestore. Verifica tu conexión o permisos.';
    } finally {
      this.cargando = false;
    }
  }

  validarFormulario(): boolean {
    this.erroresValidacion = [];

    if (!this.nuevoProducto.nombre || this.nuevoProducto.nombre.trim().length === 0) {
      this.erroresValidacion.push('El nombre del producto es obligatorio y debe contener texto.');
    }

    if (!this.nuevoProducto.categoria || this.nuevoProducto.categoria.trim().length === 0) {
      this.erroresValidacion.push('La categoría es obligatoria y debe contener texto.');
    }

    const precio = Number(this.nuevoProducto.precio);
    if (this.nuevoProducto.precio === null || this.nuevoProducto.precio === undefined || Number.isNaN(precio) || precio < 0) {
      this.erroresValidacion.push('El precio debe ser un valor numérico mayor o igual a 0.');
    }

    const stock = Number(this.nuevoProducto.stock);
    if (
      this.nuevoProducto.stock === null ||
      this.nuevoProducto.stock === undefined ||
      Number.isNaN(stock) ||
      stock < 0 ||
      !Number.isInteger(stock)
    ) {
      this.erroresValidacion.push('El stock debe ser un número entero mayor o igual a 0 (sin decimales).');
    }

    return this.erroresValidacion.length === 0;
  }

  async guardarProducto(): Promise<void> {
    this.mensajeError = '';
    this.mensajeExito = '';

    if (!this.validarFormulario()) {
      return;
    }

    const productoLimpio: Producto = {
      nombre: this.nuevoProducto.nombre.trim(),
      categoria: this.nuevoProducto.categoria.trim(),
      precio: Number(this.nuevoProducto.precio),
      stock: Number(this.nuevoProducto.stock)
    };

    try {
      if (this.editandoId) {
        await this.productoService.actualizarProducto(this.editandoId, productoLimpio);
        this.mensajeExito = 'Producto actualizado correctamente en Firestore.';
      } else {
        await this.productoService.agregarProducto(productoLimpio);
        this.mensajeExito = 'Producto registrado correctamente en Firestore.';
      }

      this.limpiarFormulario();
      await this.cargarProductos();
    } catch (error) {
      console.error(error);
      this.mensajeError = 'Ocurrió un error al guardar el producto en Firebase.';
    }
  }

  seleccionarParaEditar(producto: Producto): void {
    this.erroresValidacion = [];
    this.mensajeError = '';
    this.mensajeExito = '';
    this.editandoId = producto.id || null;
    this.nuevoProducto = { ...producto };
  }

  async eliminarProducto(producto: Producto): Promise<void> {
    if (!producto.id) return;

    const confirmado = window.confirm(`¿Estás seguro de que deseas eliminar el producto "${producto.nombre}"?`);
    if (!confirmado) {
      return;
    }

    this.mensajeError = '';
    this.mensajeExito = '';

    try {
      await this.productoService.eliminarProducto(producto.id);
      if (this.editandoId === producto.id) {
        this.limpiarFormulario();
      }
      this.mensajeExito = 'Producto eliminado correctamente.';
      await this.cargarProductos();
    } catch (error) {
      console.error(error);
      this.mensajeError = 'No se pudo eliminar el producto en Firestore.';
    }
  }

  limpiarFormulario(): void {
    this.editandoId = null;
    this.erroresValidacion = [];
    this.nuevoProducto = { nombre: '', precio: 0, stock: 0, categoria: '' };
  }
}