# Gestión de Productos — CRUD con Angular y Firebase Cloud Firestore

Aplicación web desarrollada en **Angular** e integrada con **Firebase Cloud Firestore** para administrar un catálogo de productos en tiempo real con persistencia en la nube.

## Funcionalidades del CRUD
- **Crear:** Registro de nuevos productos mediante formulario reactivo/controlado con validaciones estrictas (nombre y categoría con texto obligatorio, precio numérico $\ge 0$ y stock entero $\ge 0$).
- **Consultar:** Lectura en tiempo real de la colección `productos` desde Cloud Firestore y visualización en tabla HTML.
- **Actualizar:** Carga de datos de un producto existente en el formulario y actualización directa en Firestore mediante su identificador único (`id`).
- **Eliminar:** Eliminación de registros previa confirmación del usuario, conservando el producto si se cancela la acción.

## Modelo de Datos (`Producto`)
```typescript
export interface Producto {
  id?: string;
  nombre: string;
  precio: number;
  stock: number;
  categoria: string;
}