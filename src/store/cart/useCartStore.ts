import { create } from "zustand";
import type { CartStore } from "./types/cart"; // Importa las interfaces que definimos antes

// `create` es una función de Zustand que nos permite crear un "store".
// Un store es como un lugar donde guardamos toda la información que necesita nuestra aplicación
// sobre el carrito de compras.
export const useCartStore = create<CartStore>((set, get) => ({
  items: [], // `items` es un array que guarda los productos que el usuario agregó al carrito.
  // Cada producto en este array tiene información como el nombre, precio, cantidad, etc.

  // `addItem` es una función que se llama cuando el usuario agrega un producto al carrito.
  // Recibe el producto (`articulo`) que se va a agregar y, opcionalmente, la URL de la imagen del producto y el descuento promocional.
  addItem: (articulo, imagenUrl, promocionalDiscount) => {
    set((state) => {
      // `set` es una función que nos da Zustand para cambiar la información en el store.
      const existingItem = state.items.find((item) => item.articulo.getIdArticulo() === articulo.getIdArticulo());
      // Aquí buscamos si el producto que el usuario quiere agregar ya está en el carrito.
      // Lo buscamos por su ID.

      if (existingItem) {
        // Si el producto ya está en el carrito (ya existe un `existingItem`):
        const updatedItems = state.items.map(
          (item) =>
            item.articulo.getIdArticulo() === articulo.getIdArticulo()
              ? { ...item, quantity: item.quantity + 1 } // Aumentamos la cantidad del producto en 1.
              : item, // Si no es el producto que estamos buscando, lo dejamos como está.
        );
        return { items: updatedItems }; // Devolvemos el nuevo array de productos con la cantidad actualizada.
      } else {
        // Si el producto no está en el carrito (no existe un `existingItem`):
        return { items: [...state.items, { articulo, quantity: 1, imagenUrl, promocionalDiscount }] };
        // Agregamos el nuevo producto al array `items`.
        // La cantidad inicial es 1, y guardamos también la URL de la imagen (si la tenemos) y el descuento promocional.
      }
    });
  },

  // `removeItem` es una función para eliminar un producto del carrito.
  // Recibe el ID del producto (`articuloId`) que se va a eliminar.
  removeItem: (articuloId) => {
    set((state) => ({
      items: state.items.filter((item) => item.articulo.getIdArticulo() !== articuloId),
      // `filter` crea un nuevo array con todos los productos que NO tienen el ID que queremos eliminar.
      // Así, eliminamos el producto del carrito.
    }));
  },

  // `increaseQuantity` es una función para aumentar la cantidad de un producto en el carrito.
  increaseQuantity: (articuloId) => {
    set((state) => ({
      items: state.items.map(
        (item) =>
          item.articulo.getIdArticulo() === articuloId
            ? { ...item, quantity: item.quantity + 1 } // Aumentamos la cantidad en 1.
            : item, // Los demás productos los dejamos igual.
      ),
    }));
  },

  // `decreaseQuantity` es una función para disminuir la cantidad de un producto en el carrito.
  decreaseQuantity: (articuloId) => {
    set((state) => ({
      items: state.items.map(
        (item) =>
          item.articulo.getIdArticulo() === articuloId && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 } // Disminuimos la cantidad en 1, pero solo si es mayor que 1.
            : item, // Los demás productos los dejamos igual.
      ),
    }));
  },

  // `clearCart` es una función para vaciar el carrito completamente.
  clearCart: () => {
    set({ items: [] }); // Simplemente ponemos el array `items` a un array vacío.
  },

  // `getTotalItems` es una función para obtener la cantidad total de productos en el carrito.
  // `get` es una función que nos da Zustand para acceder al estado actual del store.
  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
    // `reduce` es una función de los arrays que nos permite calcular un valor a partir de los elementos del array.
    // En este caso, sumamos la cantidad de cada producto para obtener el total.
  },

  // `getTotalPrice` es una función para obtener el precio total de los productos en el carrito.
  getTotalPrice: () => {
    return get().items.reduce((total, item) => {
      const basePrice = item.articulo.getPrecioVenta() * item.quantity;
      const discountedPrice = item.promocionalDiscount ? basePrice * (1 - item.promocionalDiscount) : basePrice;
      return total + discountedPrice;
    }, 0);
    // Similar a `getTotalItems`, pero aplicamos el descuento promocional si existe
  },

  isPromocionalDiscount: () => {
    return get().items.some((item) => typeof item.promocionalDiscount === "number" && item.promocionalDiscount > 0);
  },
}));
