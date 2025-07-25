# 🍽️ El Buen Sabor - Sistema Ecommerce y Gestión Interna

Bienvenido al proyecto **El Buen Sabor**, una plataforma ecommerce desarrollada con **React + TypeScript + Vite**, diseñada para clientes y también para empleados del negocio gastronómico, incluyendo administración, cocina, delivery y caja.

Este repositorio corresponde al **frontend** del sistema.

---

## 🚀 Tecnologías principales

- ⚛️ React 19
- ⚡ Vite
- 🎨 TailwindCSS
- 🧠 Zustand o Context API
- 🧭 React Router DOM
- 💳 Integración con pasarelas de pago (Mercado Pago, Binance)
- TypeScript

---

## 🧩 Módulos del frontend implementados

### 👥 Usuario

- Landing page
- Catálogo de productos
- Carrito de compras
- Proceso de compra con integración a Mercado Pago
- Gestión del perfil del cliente (datos personales y direcciones)
- Visualización de historial de pedidos

### 🛠️ Administrador

- Gestión de artículos manufacturados e insumos
- Gestión de empleados
- Gestión de pedidos (panel general)

---

## ⏳ Módulos pendientes por desarrollar (frontend)

### 🛠️ Administrador

- Panel de cocina (gestión de pedidos en preparación)
- Panel de delivery (gestión de pedidos listos para entrega)
- Módulo de estadísticas (resúmenes de ventas, consumos, métricas)

---

## 📦 Clonación e instalación del proyecto

### 1. Clonar el repositorio

```bash
git clone https://github.com/Juliorivasz/ElBuenSabor.git
cd ElBuenSabor
```

### 2. Cambiar a la rama develop

```bash
git checkout develop
```

### 3. instalar dependencias

```bash
npm install
```

### 4. Crear archivo .env

```bash
backend_url
```

## Flujo de trabajo con ramas

- La rama principal de desarrollo es develop
- Cada nueva funcionalidad o corrección debe hacerse en una rama propia creada a partir de develop

### Crear una nueva rama y subir rama

```bash
git checkout develop
git pull origin develop
git checkout -b feature/nombre-de-la-funcionalidad
git push origin feature/nombre-de-la-funcionalidad
```

Luego, crea un Pull Request (PR) hacia develop desde el github (recomendado).

## Recomendaciones para desarrollo

- Utiliza nombres de ramas con prefijo claro: feature/, fix/, hotfix/, refactor/

- Commits claros y descriptivos.

- Realiza pull de develop antes de iniciar nuevas ramas.

- Usa componentes reutilizables y mantén el código tipado.

---

## 👨‍🏫 Integrantes del grupo:

👤 Rivas, Julio

👤 Giannoni, Giovanni

👤 Nuñez, Maximiliano

👤 Vicari, David

👤 Torresi, Luca

👤 Gómez Garcia, Ignacio
