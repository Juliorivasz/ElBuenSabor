import React, { useEffect, useState } from "react";
import { Categoria } from "../../models/Categoria";
import { fetchCategorias } from "../../services/categoriaServicio";
import { Category } from "./category/Category";
import { ArticuloManufacturado } from "../../models/ArticuloManufacturado";
import { fetchArticulosManufacturados } from "../../services/articuloManufacturadoServicio";
import { ModalProduct } from "./modal/ModalProduct";
import { ProductsList } from "./ProductsList";
import { CategoryFilters } from "./CategoryFilters";
import { useCartStore } from "../../store/cart/useCartStore";

export const ProductsGrid: React.FC = () => {
  const [selectedParentCategory, setSelectedParentCategory] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("Todos");
  const [selectedProduct, setSelectedProduct] = useState<ArticuloManufacturado | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [productos, setProductos] = useState<ArticuloManufacturado[]>([]);

  const addItemToCart = useCartStore((state) => state.addItem);

  useEffect(() => {
    fetchCategorias().then(setCategorias).catch(console.error);
    fetchArticulosManufacturados()
      .then((data) => {
        setProductos(data);
      })
      .catch(console.error);
  }, []);

  // Categorías padre
  const categoriasPadre = categorias.filter((cat) => !cat.getcategoriaPadre());

  // Subcategorías según el padre seleccionado
  const subcategorias =
    selectedParentCategory === null
      ? ["Todos"]
      : categorias
          .filter(
            (cat) =>
              cat.getcategoriaPadre() && cat.getcategoriaPadre()?.getcategoriaNombre() === selectedParentCategory,
          )
          .map((cat) => cat.getcategoriaNombre());

  // Agregamos "Todos" al inicio del array de subcategorias
  const subcategoriasConTodos = ["Todos", ...subcategorias];

  // Filtra los productos basados en la categoría padre y la subcategoría seleccionada.
  const filteredProducts = productos.filter((producto) => {
    const perteneceACategoriaPadre =
      selectedParentCategory === null ||
      producto.getCategoria()?.getcategoriaNombre() === selectedParentCategory ||
      producto.getCategoria()?.getcategoriaPadre()?.getcategoriaNombre() === selectedParentCategory;

    const perteneceASubcategoria =
      selectedSubCategory === "Todos" || producto.getCategoria()?.getcategoriaNombre() === selectedSubCategory;

    return perteneceACategoriaPadre && perteneceASubcategoria;
  });

  return (
    <section className="flex flex-col sm:items-start w-full">
      {/* Categorías padre */}
      <Category
        categorias={categoriasPadre}
        selected={selectedParentCategory}
        onSelect={(cat) => {
          setSelectedParentCategory(cat);
          setSelectedSubCategory("Todos");
        }}
      />

      {/* Subcategorías */}
      {selectedParentCategory && (
        <CategoryFilters
          categories={subcategoriasConTodos}
          selected={selectedSubCategory}
          onSelect={(cat) => setSelectedSubCategory(cat)}
        />
      )}

      {/* Productos */}
      <ProductsList
        products={filteredProducts}
        onSelectProduct={(product) => setSelectedProduct(product)}
        categoryKey={selectedSubCategory}
      />

      {/* Modal */}
      {selectedProduct && (
        <ModalProduct
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(p, quantity) => {
            for (let i = 0; i < quantity; i++) {
              addItemToCart(p, p.getUrlImagen()[0]);
            }
            setSelectedProduct(null);
          }}
        />
      )}
    </section>
  );
};
