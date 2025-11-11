
-- ========================================
-- 2. CREAR TABLAS
-- ========================================
CREATE TABLE "User" (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'USER' CHECK (role IN ('ADMIN', 'OWNER', 'CUSTOMER', 'USER')),
  tienda_id INTEGER,
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
  owner_id INTEGER UNIQUE NOT NULL,
  CONSTRAINT fk_tienda_owner FOREIGN KEY (owner_id) REFERENCES "User"(id) ON DELETE CASCADE
);

-- Resto de tablas (igual)
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
  imagen_url TEXT,
  precio DECIMAL(10,2) NOT NULL,
  talla VARCHAR(20),
  tipo_genero VARCHAR(20),
  stock INTEGER DEFAULT 0,
  activo BOOLEAN DEFAULT TRUE,
  destacado BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  categoria_id INTEGER NOT NULL,
  tienda_id INTEGER NOT NULL,
  CONSTRAINT fk_producto_categoria FOREIGN KEY (categoria_id) REFERENCES "Categoria"(id) ON DELETE CASCADE,
  CONSTRAINT fk_producto_tienda FOREIGN KEY (tienda_id) REFERENCES "Tienda"(id) ON DELETE CASCADE
);

CREATE TABLE "Log" (
  id SERIAL PRIMARY KEY,
  user_id INTEGER,
  tienda_id INTEGER,
  accion VARCHAR(100) NOT NULL,
  entidad VARCHAR(50) NOT NULL,
  entidad_id INTEGER,
  detalles TEXT,
  ip VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT fk_log_user FOREIGN KEY (user_id) REFERENCES "User"(id) ON DELETE SET NULL,
  CONSTRAINT fk_log_tienda FOREIGN KEY (tienda_id) REFERENCES "Tienda"(id) ON DELETE SET NULL
);

-- ========================================
-- 3. ÍNDICES
-- ========================================
CREATE INDEX idx_user_email ON "User"(email);
CREATE INDEX idx_user_role ON "User"(role);
CREATE INDEX idx_user_tienda ON "User"(tienda_id);
CREATE INDEX idx_tienda_slug ON "Tienda"(slug);
CREATE INDEX idx_tienda_owner ON "Tienda"(owner_id);
CREATE INDEX idx_categoria_slug ON "Categoria"(slug);
CREATE INDEX idx_categoria_tienda ON "Categoria"(tienda_id);
CREATE INDEX idx_producto_slug ON "Producto"(slug);
CREATE INDEX idx_producto_tienda ON "Producto"(tienda_id);
CREATE INDEX idx_producto_categoria ON "Producto"(categoria_id);
CREATE INDEX idx_producto_destacado ON "Producto"(destacado);
CREATE INDEX idx_log_user ON "Log"(user_id);
CREATE INDEX idx_log_tienda ON "Log"(tienda_id);
CREATE INDEX idx_log_accion ON "Log"(accion);
CREATE INDEX idx_log_created ON "Log"(created_at);

-- ========================================
-- 4. INSERCIONES MASIVAS (CORREGIDAS)
-- ========================================

-- 1. Usuarios (5: 1 ADMIN + 4 OWNERS)
INSERT INTO "User" (name, email, password, role) VALUES
('José Ángel', 'admin@tienda.pe', '$2b$10$z8K3x9vF7jLmNqRtYpQw0e6sX5vT9uYhGfD4cB2aZ1eWqRtYpQw0e', 'ADMIN'),
('María López', 'maria@zapatillas.pe', '$2b$10$z8K3x9vF7jLmNqRtYpQw0e6sX5vT9uYhGfD4cB2aZ1eWqRtYpQw0e', 'OWNER'),
('Carlos Pérez', 'carlos@casual.pe', '$2b$10$z8K3x9vF7jLmNqRtYpQw0e6sX5vT9uYhGfD4cB2aZ1eWqRtYpQw0e', 'OWNER'),
('Ana Gómez', 'ana@urbana.pe', '$2b$10$z8K3x9vF7jLmNqRtYpQw0e6sX5vT9uYhGfD4cB2aZ1eWqRtYpQw0e', 'OWNER'),
('Luis Martínez', 'luis@deportes.pe', '$2b$10$z8K3x9vF7jLmNqRtYpQw0e6sX5vT9uYhGfD4cB2aZ1eWqRtYpQw0e', 'OWNER');

-- 2. Tiendas (5: 1 por OWNER)
INSERT INTO "Tienda" (nombre, slug, descripcion, logo_url, ubicacion, whatsapp, email_contacto, owner_id) VALUES
('Zapatillas Perú', 'zapatillas-peru', 'Las mejores zapatillas en Lima', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200', 'Av. Larco 123, Miraflores', '+51987654321', 'ventas@zapatillas.pe', 2),
('Ropa Casual Lima', 'ropa-casual-lima', 'Ropa cómoda para el día a día', 'https://images.pexels.com/photos/991509/pexels-photo-991509.jpeg?w=200', 'Jr. de la Unión 567, Centro', '+51911223344', 'casual@ropa.pe', 3),
('Moda Urbana PE', 'moda-urbana-pe', 'Estilo streetwear peruano', 'https://images.unsplash.com/photo-1556821845-5e7d3e3b8e2f?w=200', 'Av. Brasil 890, Magdalena', '+51955667788', 'urbana@moda.pe', 4),
('Deportes Pro Lima', 'deportes-pro-lima', 'Equipos deportivos profesionales', 'https://images.pexels.com/photos/47730/the-ball-stadion-football-the-pitch-47730.jpeg?w=200', 'Av. La Marina 234, San Miguel', '+51999887766', 'pro@deportes.pe', 5),
('Tech Store Perú', 'tech-store-peru', 'Gadgets y accesorios', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200', 'Av. Arequipa 456, Lince', '+51933445566', 'tech@store.pe', 1);

-- 3. Actualizar User.tienda_id (opcional)
UPDATE "User" SET tienda_id = 1 WHERE id = 2;
UPDATE "User" SET tienda_id = 2 WHERE id = 3;
UPDATE "User" SET tienda_id = 3 WHERE id = 4;
UPDATE "User" SET tienda_id = 4 WHERE id = 5;

-- 4. Categorías
INSERT INTO "Categoria" (nombre, slug, tienda_id) VALUES
('Zapatillas Hombre', 'zapatillas-hombre', 1),
('Zapatillas Mujer', 'zapatillas-mujer', 1),
('Camisetas', 'camisetas', 2),
('Pantalones', 'pantalones', 2),
('Sudaderas', 'sudaderas', 3),
('Gorras', 'gorras', 3),
('Balones', 'balones', 4),
('Camisetas Deportivas', 'camisetas-deportivas', 4),
('Auriculares', 'auriculares', 5),
('Cargadores', 'cargadores', 5);

-- 5. Productos (10+)
INSERT INTO "Producto" (nombre, slug, descripcion, precio, talla, tipo_genero, stock, activo, destacado, categoria_id, tienda_id, imagen_url) VALUES
('Nike Air Max 270', 'nike-air-max-270', 'Cómodas y con estilo', 450.00, '42', 'Hombre', 15, true, true, 1, 1, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800'),
('Adidas Ultraboost', 'adidas-ultraboost', 'Máxima amortiguación', 520.00, '40', 'Hombre', 8, true, true, 1, 1, 'https://images.unsplash.com/photo-1605405748312-0a583d2b9e2c?w=800'),
('Camiseta Básica Blanca', 'camiseta-basica-blanca', '100% algodón', 59.90, 'M', 'Hombre', 30, true, false, 3, 2, 'https://images.pexels.com/photos/991509/pexels-photo-991509.jpeg?w=800'),
('Pantalón Jogger Gris', 'pantalon-jogger-gris', 'Cómodo', 129.90, 'M', 'Hombre', 18, true, false, 4, 2, 'https://images.pexels.com/photos/4210863/pexels-photo-4210863.jpeg?w=800'),
('Sudadera Oversize', 'sudadera-oversize', 'Streetwear', 149.90, 'XL', 'Unisex', 22, true, false, 5, 3, 'https://images.unsplash.com/photo-1556821845-5e7d3e3b8e2f?w=800'),
('Balón Fútbol Adidas', 'balon-futbol-adidas', 'Oficial 2025', 199.90, NULL, 'Unisex', 30, true, true, 7, 4, 'https://images.pexels.com/photos/47730/the-ball-stadion-football-the-pitch-47730.jpeg?w=800'),
('Auriculares Bluetooth Sony', 'auriculares-bluetooth', 'Cancelación de ruido', 299.90, NULL, 'Unisex', 25, true, false, 9, 5, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800');

-- 6. Logs de prueba
INSERT INTO "Log" (user_id, tienda_id, accion, entidad, entidad_id, detalles, ip, user_agent) VALUES
(1, NULL, 'LOGIN_EXITOSO', 'User', 1, 'Admin inició sesión', '127.0.0.1', 'Chrome/130.0'),
(2, 1, 'CREAR_TIENDA', 'Tienda', 1, 'Tienda "Zapatillas Perú" creada', '192.168.1.100', 'Firefox/129.0');

-- ========================================
-- 7. VERIFICAR
-- ========================================
SELECT 'Usuarios:', COUNT(*) FROM "User";
SELECT 'Tiendas:', COUNT(*) FROM "Tienda";
SELECT 'Categorías:', COUNT(*) FROM "Categoria";
SELECT 'Productos:', COUNT(*) FROM "Producto";
SELECT 'Logs:', COUNT(*) FROM "Log";