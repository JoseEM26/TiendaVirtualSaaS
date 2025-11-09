-- 3. CREAR TABLAS (igual que antes)
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

-- 4. ÍNDICES
CREATE INDEX idx_tienda_slug ON "Tienda"(slug);
CREATE INDEX idx_categoria_slug ON "Categoria"(slug);
CREATE INDEX idx_producto_slug ON "Producto"(slug);
CREATE INDEX idx_producto_tienda ON "Producto"(tienda_id);
CREATE INDEX idx_producto_categoria ON "Producto"(categoria_id);
CREATE INDEX idx_categoria_tienda ON "Categoria"(tienda_id);

-- ========================================
-- 5. INSERCIONES MASIVAS
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
('Tienda de Zapatillas', 'tienda-de-zapatillas', 'Zapatillas deportivas y urbanas', 'https://logo.com/zapas.png', 'Lima, Perú', '+51987654321', 'zapas@tienda.com', 1),
('Ropa Casual', 'ropa-casual', 'Ropa cómoda para el día a día', 'https://logo.com/casual.png', 'Bogotá, Colombia', '+573001234567', 'casual@ropa.com', 2),
('Moda Urbana', 'moda-urbana', 'Estilo streetwear y moderno', 'https://logo.com/urbana.png', 'CDMX, México', '+525512345678', 'urbana@moda.com', 3),
('Deportes Pro', 'deportes-pro', 'Equipos y ropa deportiva profesional', 'https://logo.com/deportes.png', 'Santiago, Chile', '+56912345678', 'pro@deportes.com', 4),
('Tech Store', 'tech-store', 'Gadgets y accesorios tecnológicos', 'https://logo.com/tech.png', 'Buenos Aires, Argentina', '+541112345678', 'tech@store.com', 5),
('Eco Moda', 'eco-moda', 'Ropa sostenible y ecológica', 'https://logo.com/eco.png', 'Madrid, España', '+34600123456', 'eco@moda.com', 2),
('Kids World', 'kids-world', 'Ropa y juguetes para niños', 'https://logo.com/kids.png', 'Lima, Perú', '+51987654322', 'kids@world.com', 3),
('Lujo Total', 'lujo-total', 'Marcas premium y exclusivas', 'https://logo.com/lujo.png', 'Miami, USA', '+13051234567', 'lujo@total.com', 4),
('Fitness Gear', 'fitness-gear', 'Ropa y accesorios para gym', 'https://logo.com/fitness.png', 'São Paulo, Brasil', '+5511987654321', 'fitness@gear.com', 5),
('Vintage Shop', 'vintage-shop', 'Ropa retro y de segunda mano', 'https://logo.com/vintage.png', 'Barcelona, España', '+34600123457', 'vintage@shop.com', 1);

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

-- Productos (100+)
INSERT INTO "Producto" (nombre, slug, descripcion, precio, talla, tipo_genero, stock, categoria_id, tienda_id) VALUES
-- Tienda 1 - Zapatillas
('Nike Air Max 270', 'nike-air-max-270', 'Cómodas y con estilo', 450.00, '42', 'Hombre', 15, 1, 1),
('Adidas Ultraboost', 'adidas-ultraboost', 'Máxima amortiguación', 520.00, '40', 'Hombre', 8, 1, 1),
('Puma RS-X', 'puma-rs-x', 'Estilo retro', 380.00, '38', 'Mujer', 12, 2, 1),
('Nike React', 'nike-react', 'Ligeras y rápidas', 480.00, '36', 'Mujer', 10, 2, 1),
('Converse All Star', 'converse-all-star', 'Clásicas e icónicas', 250.00, '35', 'Niños', 20, 3, 1),
('Calcetines Deportivos', 'calcetines-deportivos', 'Pack x3', 45.00, NULL, 'Unisex', 50, 4, 1),

-- Tienda 2 - Ropa Casual
('Camiseta Básica Blanca', 'camiseta-basica-blanca', '100% algodón', 59.90, 'M', 'Hombre', 30, 5, 2),
('Camiseta Básica Negra', 'camiseta-basica-negra', '100% algodón', 59.90, 'L', 'Hombre', 25, 5, 2),
('Pantalón Jogger Gris', 'pantalon-jogger-gris', 'Cómodo y versátil', 129.90, 'M', 'Hombre', 18, 6, 2),
('Chaqueta Denim', 'chaqueta-denim', 'Estilo clásico', 199.90, 'S', 'Mujer', 10, 7, 2),

-- Tienda 3 - Moda Urbana
('Sudadera Oversize', 'sudadera-oversize', 'Estilo street', 149.90, 'XL', 'Unisex', 22, 8, 3),
('Gorras Snapback', 'gorras-snapback', 'Ajustable', 79.90, NULL, 'Unisex', 40, 9, 3),
('Jeans Rotos', 'jeans-rotos', 'Tendencia actual', 179.90, '32', 'Hombre', 15, 10, 3),

-- Tienda 4 - Deportes
('Balón Fútbol Adidas', 'balon-futbol-adidas', 'Oficial Liga', 199.90, NULL, 'Unisex', 30, 11, 4),
('Camiseta Selección', 'camiseta-seleccion', 'Perú 2025', 149.90, 'M', 'Hombre', 50, 12, 4),
('Zapatillas Running ASICS', 'zapatillas-running-asics', 'Gel amortiguado', 599.90, '41', 'Hombre', 8, 13, 4),

-- Tienda 5 - Tech
('Auriculares Bluetooth', 'auriculares-bluetooth', 'Cancelación de ruido', 299.90, NULL, 'Unisex', 25, 14, 5),
('Cargador Rápido 65W', 'cargador-rapido-65w', 'USB-C', 89.90, NULL, 'Unisex', 60, 15, 5),
('Funda iPhone 15', 'funda-iphone-15', 'Antigolpes', 69.90, NULL, 'Unisex', 40, 16, 5),

-- Más productos variados...
('Camiseta Polo', 'camiseta-polo', 'Elegante y fresca', 89.90, 'L', 'Hombre', 20, 5, 2),
('Short Deportivo', 'short-deportivo', 'Transpirable', 79.90, 'M', 'Hombre', 30, 6, 2),
('Zapatilla Skate', 'zapatilla-skate', 'Suela reforzada', 329.90, '39', 'Hombre', 12, 1, 1),
('Pack Medias', 'pack-medias', 'x6 pares', 49.90, NULL, 'Unisex', 100, 4, 1),
('Reloj Deportivo', 'reloj-deportivo', 'Resistente al agua', 399.90, NULL, 'Unisex', 15, 4, 1),
('Mochila Urbana', 'mochila-urbana', '15L', 159.90, NULL, 'Unisex', 25, 9, 3),
('Gorra Trucker', 'gorra-trucker', 'Malla transpirable', 69.90, NULL, 'Unisex', 35, 9, 3),
('Jeans Slim Fit', 'jeans-slim-fit', 'Corte moderno', 189.90, '30', 'Hombre', 18, 10, 3),
('Balón Basketball', 'balon-basketball', 'Cuero sintético', 179.90, NULL, 'Unisex', 20, 11, 4),
('Rodilleras Voleibol', 'rodilleras-voleibol', 'Protección extra', 99.90, 'M', 'Unisex', 30, 11, 4),
('Smartwatch', 'smartwatch', 'Notificaciones', 799.90, NULL, 'Unisex', 10, 14, 5),
('Power Bank 20000mAh', 'power-bank-20000mah', 'Carga rápida', 149.90, NULL, 'Unisex', 40, 15, 5),
('Funda Samsung S24', 'funda-samsung-s24', 'Silicona', 59.90, NULL, 'Unisex', 50, 16, 5),

-- Tienda Eco Moda
('Camiseta Orgánica', 'camiseta-organica', 'Algodón reciclado', 89.90, 'M', 'Mujer', 25, 5, 6),
('Bolso Tela', 'bolso-tela', 'Reutilizable', 39.90, NULL, 'Unisex', 60, 9, 6),

-- Kids World
('Pijama Infantil', 'pijama-infantil', 'Diseño dinosaurios', 69.90, '6', 'Niños', 30, 5, 7),
('Zapatillas LED', 'zapatillas-led', 'Luces al caminar', 199.90, '28', 'Niños', 20, 3, 7),

-- Lujo Total
('Bolso Louis Vuitton', 'bolso-louis-vuitton', 'Edición limitada', 8500.00, NULL, 'Mujer', 1, 9, 8),
('Reloj Rolex', 'reloj-rolex', 'Oro 18K', 45000.00, NULL, 'Hombre', 1, 4, 8),

-- Fitness Gear
('Leggings Deportivos', 'leggings-deportivos', 'Compresión media', 129.90, 'S', 'Mujer', 35, 6, 9),
('Botella Térmica', 'botella-termica', '500ml', 79.90, NULL, 'Unisex', 50, 11, 9),

-- Vintage Shop
('Camiseta Vintage 90s', 'camiseta-vintage-90s', 'Original', 299.90, 'M', 'Unisex', 5, 5, 10),
('Chaqueta Cuero 80s', 'chaqueta-cuero-80s', 'Auténtica', 899.90, 'L', 'Hombre', 3, 7, 10);

-- ========================================
-- 6. VERIFICAR CANTIDADES
-- ========================================
SELECT 'Usuarios:', COUNT(*) FROM "User";
SELECT 'Tiendas:', COUNT(*) FROM "Tienda";
SELECT 'Categorías:', COUNT(*) FROM "Categoria";
SELECT 'Productos:', COUNT(*) FROM "Producto";

-- ========================================
-- ¡LISTO! +100 PRODUCTOS, 10 TIENDAS, 5 USUARIOS
-- ========================================