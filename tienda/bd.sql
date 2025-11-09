-- 4. CREAR TABLAS
CREATE TABLE "User" (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  role VARCHAR(20) DEFAULT 'USER',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "Tienda" (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  slug VARCHAR(120) UNIQUE NOT NULL,
  descripcion TEXT,
  logo_url TEXT,
  ubicacion TEXT,
  whatsapp VARCHAR(20),
  email_contacto VARCHAR(100),
  estado BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  owner_id INTEGER NOT NULL,
  CONSTRAINT fk_tienda_owner FOREIGN KEY (owner_id) REFERENCES "User"(id) ON DELETE CASCADE
);

CREATE TABLE "Categoria" (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  slug VARCHAR(120) UNIQUE NOT NULL,
  activa BOOLEAN DEFAULT TRUE,
  tienda_id INTEGER NOT NULL,
  CONSTRAINT fk_categoria_tienda FOREIGN KEY (tienda_id) REFERENCES "Tienda"(id) ON DELETE CASCADE
);

CREATE TABLE "Producto" (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  slug VARCHAR(120) UNIQUE NOT NULL,
  descripcion TEXT,
  imagen_base64 TEXT,
  precio DECIMAL(10,2) NOT NULL,
  talla VARCHAR(20),
  tipo_genero VARCHAR(20),
  stock INTEGER DEFAULT 0,
  activo BOOLEAN DEFAULT TRUE,
  categoria_id INTEGER NOT NULL,
  tienda_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT fk_producto_categoria FOREIGN KEY (categoria_id) REFERENCES "Categoria"(id) ON DELETE CASCADE,
  CONSTRAINT fk_producto_tienda FOREIGN KEY (tienda_id) REFERENCES "Tienda"(id) ON DELETE CASCADE
);

-- 5. ÍNDICES PARA BÚSQUEDA RÁPIDA
CREATE INDEX idx_tienda_slug ON "Tienda"(slug);
CREATE INDEX idx_categoria_slug ON "Categoria"(slug);
CREATE INDEX idx_producto_slug ON "Producto"(slug);
CREATE INDEX idx_producto_tienda ON "Producto"(tienda_id);
CREATE INDEX idx_producto_categoria ON "Producto"(categoria_id);
CREATE INDEX idx_categoria_tienda ON "Categoria"(tienda_id);

-- 6. INSERCIONES DE PRUEBA
-- Usuario admin
INSERT INTO "User" (name, email, password, role) VALUES
('José Ángel', 'jose@example.com', 'password123', 'ADMIN');

-- Tienda
INSERT INTO "Tienda" (nombre, slug, descripcion, logo_url, ubicacion, whatsapp, email_contacto, owner_id) VALUES
('Tienda de Zapatillas', 'tienda-de-zapatillas', 'Zapatillas deportivas de moda', 'https://example.com/logo1.png', 'Lima, Perú', '+51987654321', 'contacto@zapas.com', 1);

-- Categorías
INSERT INTO "Categoria" (nombre, slug, tienda_id) VALUES
('Zapatillas Hombre', 'zapatillas-hombre', 1),
('Zapatillas Mujer', 'zapatillas-mujer', 1);

-- Productos
INSERT INTO "Producto" (
  nombre, slug, descripcion, precio, talla, tipo_genero, stock, categoria_id, tienda_id
) VALUES
('Zapatilla Nike Air', 'zapatilla-nike-air', 'Zapatilla deportiva cómoda', 350.00, '42', 'Hombre', 10, 1, 1),
('Zapatilla Adidas Run', 'zapatilla-adidas-run', 'Perfecta para correr', 320.00, '38', 'Mujer', 8, 2, 1);

-- 7. VERIFICAR DATOS
SELECT 'Usuarios:', COUNT(*) FROM "User";
SELECT 'Tiendas:', COUNT(*) FROM "Tienda";
SELECT 'Categorías:', COUNT(*) FROM "Categoria";
SELECT 'Productos:', COUNT(*) FROM "Producto";

-- ========================================
-- ¡LISTO! BD CREADA CON DATOS E ÍNDICES
-- ========================================