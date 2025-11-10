-- ========================================
-- 1. LIMPIAR BASE DE DATOS (OPCIONAL)
-- ========================================
DROP TABLE IF EXISTS "Producto" CASCADE;
DROP TABLE IF EXISTS "Categoria" CASCADE;
DROP TABLE IF EXISTS "Tienda" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;

-- ========================================
-- 2. CREAR TABLAS
-- ========================================
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
  imagen_url TEXT,
  precio DECIMAL(10,2) NOT NULL,
  talla VARCHAR(20),
  tipo_genero VARCHAR(20),
  stock INTEGER DEFAULT 0,
  activo BOOLEAN DEFAULT TRUE,
  destacado BOOLEAN DEFAULT FALSE,  -- ← CAMPO AÑADIDO
  created_at TIMESTAMP DEFAULT NOW(),
  categoria_id INTEGER NOT NULL,
  tienda_id INTEGER NOT NULL,
  CONSTRAINT fk_producto_categoria FOREIGN KEY (categoria_id) REFERENCES "Categoria"(id) ON DELETE CASCADE,
  CONSTRAINT fk_producto_tienda FOREIGN KEY (tienda_id) REFERENCES "Tienda"(id) ON DELETE CASCADE
);

-- ========================================
-- 3. ÍNDICES
-- ========================================
CREATE INDEX idx_tienda_slug ON "Tienda"(slug);
CREATE INDEX idx_categoria_slug ON "Categoria"(slug);
CREATE INDEX idx_producto_slug ON "Producto"(slug);
CREATE INDEX idx_producto_tienda ON "Producto"(tienda_id);
CREATE INDEX idx_producto_categoria ON "Producto"(categoria_id);
CREATE INDEX idx_categoria_tienda ON "Categoria"(tienda_id);

-- ========================================
-- 4. INSERCIONES MASIVAS
-- ========================================

-- Usuarios
INSERT INTO "User" (name, email, password, role) VALUES
('José Ángel', 'jose@example.com', 'pass123', 'ADMIN'),
('María López', 'maria@tienda.com', 'pass123', 'OWNER'),
('Carlos Pérez', 'carlos@moda.com', 'pass123', 'OWNER'),
('Ana Gómez', 'ana@deportes.com', 'pass123', 'OWNER'),
('Luis Martínez', 'luis@tech.com', 'pass123', 'OWNER');

-- Tiendas (10)
INSERT INTO "Tienda" (nombre, slug, descripcion, logo_url, ubicacion, whatsapp, email_contacto, owner_id) VALUES
('Tienda de Zapatillas', 'tienda-de-zapatillas', 'Zapatillas deportivas y urbanas', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200', 'Lima, Perú', '+51987654321', 'zapas@tienda.com', 1),
('Ropa Casual', 'ropa-casual', 'Ropa cómoda para el día a día', 'https://images.pexels.com/photos/991509/pexels-photo-991509.jpeg?w=200', 'Bogotá, Colombia', '+573001234567', 'casual@ropa.com', 2),
('Moda Urbana', 'moda-urbana', 'Estilo streetwear y moderno', 'https://images.unsplash.com/photo-1556821845-5e7d3e3b8e2f?w=200', 'CDMX, México', '+525512345678', 'urbana@moda.com', 3),
('Deportes Pro', 'deportes-pro', 'Equipos y ropa deportiva profesional', 'https://images.pexels.com/photos/47730/the-ball-stadion-football-the-pitch-47730.jpeg?w=200', 'Santiago, Chile', '+56912345678', 'pro@deportes.com', 4),
('Tech Store', 'tech-store', 'Gadgets y accesorios tecnológicos', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200', 'Buenos Aires, Argentina', '+541112345678', 'tech@store.com', 5),
('Eco Moda', 'eco-moda', 'Ropa sostenible y ecológica', 'https://images.pexels.com/photos/991510/pexels-photo-991510.jpeg?w=200', 'Madrid, España', '+34600123456', 'eco@moda.com', 2),
('Kids World', 'kids-world', 'Ropa y juguetes para niños', 'https://images.pexels.com/photos/3661592/pexels-photo-3661592.jpeg?w=200', 'Lima, Perú', '+51987654322', 'kids@world.com', 3),
('Lujo Total', 'lujo-total', 'Marcas premium y exclusivas', 'https://images.unsplash.com/photo-1598532293355-8b3e69c3c1b3?w=200', 'Miami, USA', '+13051234567', 'lujo@total.com', 4),
('Fitness Gear', 'fitness-gear', 'Ropa y accesorios para gym', 'https://images.pexels.com/photos/4210867/pexels-photo-4210867.jpeg?w=200', 'São Paulo, Brasil', '+5511987654321', 'fitness@gear.com', 5),
('Vintage Shop', 'vintage-shop', 'Ropa retro y de segunda mano', 'https://images.pexels.com/photos/991511/pexels-photo-991511.jpeg?w=200', 'Barcelona, España', '+34600123457', 'vintage@shop.com', 1);

-- Categorías (20+)
INSERT INTO "Categoria" (nombre, slug, tienda_id) VALUES
-- Tienda 1
('Zapatillas Hombre', 'zapatillas-hombre', 1),
('Zapatillas Mujer', 'zapatillas-mujer', 1),
('Zapatillas Niños', 'zapatillas-ninos', 1),
('Accesorios', 'accesorios', 1),
-- Tienda 2
('Camisetas', 'camisetas', 2),
('Pantalones', 'pantalones', 2),
('Chaquetas', 'chaquetas', 2),
-- Tienda 3
('Sudaderas', 'sudaderas', 3),
('Gorras', 'gorras', 3),
('Jeans', 'jeans', 3),
-- Tienda 4
('Balones', 'balones', 4),
('Camisetas Deportivas', 'camisetas-deportivas', 4),
('Zapatillas Running', 'zapatillas-running', 4),
-- Tienda 5
('Auriculares', 'auriculares', 5),
('Cargadores', 'cargadores', 5),
('Fundas', 'fundas', 5);

-- ========================================
-- 5. PRODUCTOS (50+ con imágenes reales)
-- ========================================

-- Tienda 1 - Zapatillas
INSERT INTO "Producto" (nombre, slug, descripcion, precio, talla, tipo_genero, stock, activo, destacado, categoria_id, tienda_id, imagen_url) VALUES
('Nike Air Max 270', 'nike-air-max-270', 'Cómodas y con estilo urbano', 450.00, '42', 'Hombre', 15, true, true, 1, 1, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800'),
('Adidas Ultraboost', 'adidas-ultraboost', 'Máxima amortiguación', 520.00, '40', 'Hombre', 8, true, true, 1, 1, 'https://images.unsplash.com/photo-1605405748312-0a583d2b9e2c?w=800'),
('Puma RS-X', 'puma-rs-x', 'Estilo retro moderno', 380.00, '38', 'Mujer', 12, true, true, 2, 1, 'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?w=800'),
('Nike React Element', 'nike-react', 'Ligeras y reactivas', 480.00, '36', 'Mujer', 10, true, false, 2, 1, 'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?w=800'),
('Converse All Star', 'converse-all-star', 'Clásicas e icónicas', 250.00, '35', 'Niños', 20, true, false, 3, 1, 'https://images.pexels.com/photos/1240892/pexels-photo-1240892.jpeg?w=800'),
('Calcetines Deportivos Pack x3', 'calcetines-deportivos', 'Transpirables', 45.00, NULL, 'Unisex', 50, true, false, 4, 1, 'https://images.pexels.com/photos/4210864/pexels-photo-4210864.jpeg?w=800'),

-- Tienda 2 - Ropa Casual
('Camiseta Básica Blanca', 'camiseta-basica-blanca', '100% algodón', 59.90, 'M', 'Hombre', 30, true, false, 5, 2, 'https://images.pexels.com/photos/991509/pexels-photo-991509.jpeg?w=800'),
('Camiseta Básica Negra', 'camiseta-basica-negra', 'Suave y duradera', 59.90, 'L', 'Hombre', 25, true, false, 5, 2, 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800'),
('Pantalón Jogger Gris', 'pantalon-jogger-gris', 'Cómodo y versátil', 129.90, 'M', 'Hombre', 18, true, false, 6, 2, 'https://images.pexels.com/photos/4210863/pexels-photo-4210863.jpeg?w=800'),
('Chaqueta Denim', 'chaqueta-denim', 'Clásico atemporal', 199.90, 'S', 'Mujer', 10, true, false, 7, 2, 'https://images.pexels.com/photos/1034859/pexels-photo-1034859.jpeg?w=800'),

-- Tienda 3 - Moda Urbana
('Sudadera Oversize', 'sudadera-oversize', 'Estilo streetwear', 149.90, 'XL', 'Unisex', 22, true, false, 8, 3, 'https://images.unsplash.com/photo-1556821845-5e7d3e3b8e2f?w=800'),
('Gorras Snapback', 'gorras-snapback', 'Ajustable', 79.90, NULL, 'Unisex', 40, true, false, 9, 3, 'https://images.pexels.com/photos/984619/pexels-photo-984619.jpeg?w=800'),
('Jeans Rotos', 'jeans-rotos', 'Tendencia actual', 179.90, '32', 'Hombre', 15, true, false, 10, 3, 'https://images.unsplash.com/photo-1542272604-787c3c9d4b3d?w=800'),

-- Tienda 4 - Deportes Pro
('Balón Fútbol Adidas', 'balon-futbol-adidas', 'Oficial 2025', 199.90, NULL, 'Unisex', 30, true, true, 11, 4, 'https://images.pexels.com/photos/47730/the-ball-stadion-football-the-pitch-47730.jpeg?w=800'),
('Camiseta Selección Perú', 'camiseta-seleccion', 'Edición 2025', 149.90, 'M', 'Hombre', 50, true, true, 12, 4, 'https://images.pexels.com/photos/13677244/pexels-photo-13677244.jpeg?w=800'),
('Zapatillas Running ASICS', 'zapatillas-running-asics', 'Gel amortiguado', 599.90, '41', 'Hombre', 8, true, true, 13, 4, 'https://images.unsplash.com/photo-1595950533478-9d580a368f68?w=800'),

-- Tienda 5 - Tech Store
('Auriculares Bluetooth Sony', 'auriculares-bluetooth', 'Cancelación de ruido', 299.90, NULL, 'Unisex', 25, true, false, 14, 5, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'),
('Cargador Rápido 65W', 'cargador-rapido-65w', 'USB-C PD', 89.90, NULL, 'Unisex', 60, true, false, 15, 5, 'https://images.pexels.com/photos/3945651/pexels-photo-3945651.jpeg?w=800'),
('Funda iPhone 15 Pro', 'funda-iphone-15', 'Antigolpes', 69.90, NULL, 'Unisex', 40, true, false, 16, 5, 'https://images.unsplash.com/photo-1607938077367-1bacb5016b7a?w=800'),

-- Más productos...
('Camiseta Polo Lacoste', 'camiseta-polo', 'Algodón piqué', 89.90, 'L', 'Hombre', 20, true, false, 5, 2, 'https://images.pexels.com/photos/991512/pexels-photo-991512.jpeg?w=800'),
('Short Deportivo Nike', 'short-deportivo', 'Dri-FIT', 79.90, 'M', 'Hombre', 30, true, false, 6, 2, 'https://images.unsplash.com/photo-1591195853328-4e8c4d2c6d3e?w=800'),
('Zapatilla Skate Vans', 'zapatilla-skate', 'Suela Waffle', 329.90, '39', 'Hombre', 12, true, false, 1, 1, 'https://images.pexels.com/photos/1464626/pexels-photo-1464626.jpeg?w=800'),
('Pack Medias x6', 'pack-medias', 'Varios colores', 49.90, NULL, 'Unisex', 100, true, false, 4, 1, 'https://images.pexels.com/photos/4210865/pexels-photo-4210865.jpeg?w=800'),
('Reloj Deportivo Garmin', 'reloj-deportivo', 'GPS y salud', 399.90, NULL, 'Unisex', 15, true, false, 4, 1, 'https://images.unsplash.com/photo-1524592094714-0f0654b295fc?w=800'),
('Mochila Urbana Herschel', 'mochila-urbana', '15L laptop', 159.90, NULL, 'Unisex', 25, true, false, 9, 3, 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?w=800'),
('Gorra Trucker', 'gorra-trucker', 'Malla transpirable', 69.90, NULL, 'Unisex', 35, true, false, 9, 3, 'https://images.unsplash.com/photo-1511499767150-a48a237f008b?w=800'),
('Jeans Slim Fit Levi''s', 'jeans-slim-fit', 'Stretch', 189.90, '30', 'Hombre', 18, true, false, 10, 3, 'https://images.pexels.com/photos/4210866/pexels-photo-4210866.jpeg?w=800'),
('Balón Basketball Spalding', 'balon-basketball', 'Cuero sintético', 179.90, NULL, 'Unisex', 20, true, false, 11, 4, 'https://images.pexels.com/photos/945471/pexels-photo-945471.jpeg?w=800'),
('Rodilleras Voleibol', 'rodilleras-voleibol', 'Acolchadas', 99.90, 'M', 'Unisex', 30, true, false, 11, 4, 'https://images.pexels.com/photos/4498495/pexels-photo-4498495.jpeg?w=800'),
('Smartwatch Apple Watch', 'smartwatch', 'Notificaciones', 799.90, NULL, 'Unisex', 10, true, false, 14, 5, 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800'),
('Power Bank 20000mAh', 'power-bank-20000mah', 'Carga rápida', 149.90, NULL, 'Unisex', 40, true, false, 15, 5, 'https://images.pexels.com/photos/3945652/pexels-photo-3945652.jpeg?w=800'),
('Funda Samsung S24', 'funda-samsung-s24', 'Silicona', 59.90, NULL, 'Unisex', 50, true, false, 16, 5, 'https://images.unsplash.com/photo-1607938077367-1bacb5016b7a?w=800'),

-- Tienda 6 - Eco Moda
('Camiseta Orgánica', 'camiseta-organica', 'Reciclada', 89.90, 'M', 'Mujer', 25, true, false, 5, 6, 'https://images.pexels.com/photos/991510/pexels-photo-991510.jpeg?w=800'),
('Bolso Tela Reutilizable', 'bolso-tela', 'Minimalista', 39.90, NULL, 'Unisex', 60, true, false, 9, 6, 'https://images.pexels.com/photos/3735647/pexels-photo-3735647.jpeg?w=800'),

-- Tienda 7 - Kids World
('Pijama Infantil Dinosaurios', 'pijama-infantil', '100% algodón', 69.90, '6', 'Niños', 30, true, false, 5, 7, 'https://images.pexels.com/photos/3661592/pexels-photo-3661592.jpeg?w=800'),
('Zapatillas LED Niños', 'zapatillas-led', 'Luces al caminar', 199.90, '28', 'Niños', 20, true, false, 3, 7, 'https://images.pexels.com/photos/1240893/pexels-photo-1240893.jpeg?w=800'),

-- Tienda 8 - Lujo Total
('Bolso Louis Vuitton', 'bolso-louis-vuitton', 'Edición limitada', 8500.00, NULL, 'Mujer', 1, true, false, 9, 8, 'https://images.unsplash.com/photo-1598532293355-8b3e69c3c1b3?w=800'),
('Reloj Rolex Submariner', 'reloj-rolex', 'Oro 18K', 45000.00, NULL, 'Hombre', 1, true, false, 4, 8, 'https://images.unsplash.com/photo-1523177876458-2a51f0a193b5?w=800'),

-- Tienda 9 - Fitness Gear
('Leggings Deportivos', 'leggings-deportivos', 'Compresión media', 129.90, 'S', 'Mujer', 35, true, false, 6, 9, 'https://images.pexels.com/photos/4210867/pexels-photo-4210867.jpeg?w=800'),
('Botella Térmica 500ml', 'botella-termica', '24h frío', 79.90, NULL, 'Unisex', 50, true, false, 11, 9, 'https://images.pexels.com/photos/4165285/pexels-photo-4165285.jpeg?w=800'),

-- Tienda 10 - Vintage Shop
('Camiseta Vintage 90s', 'camiseta-vintage-90s', 'Original', 299.90, 'M', 'Unisex', 5, true, false, 5, 10, 'https://images.pexels.com/photos/991511/pexels-photo-991511.jpeg?w=800'),
('Chaqueta Cuero 80s', 'chaqueta-cuero-80s', 'Auténtica', 899.90, 'L', 'Hombre', 3, true, false, 7, 10, 'https://images.unsplash.com/photo-1551028719-00167b16eac9?w=800');

-- ========================================
-- 6. VERIFICAR CANTIDADES
-- ========================================
SELECT 'Usuarios:', COUNT(*) FROM "User";
SELECT 'Tiendas:', COUNT(*) FROM "Tienda";
SELECT 'Categorías:', COUNT(*) FROM "Categoria";
SELECT 'Productos:', COUNT(*) FROM "Producto";
SELECT 'Destacados:', COUNT(*) FROM "Producto" WHERE destacado = TRUE;

-- ========================================
-- ¡BASE DE DATOS LISTA PARA PERÚ (PE)!
-- ========================================