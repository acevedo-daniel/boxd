-- SQL Server: Script completo para E-Commerce API (THE BOX)

-- Tabla de categorías
CREATE TABLE Categories (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Description NVARCHAR(255)
);

-- Tabla de productos
CREATE TABLE Products (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Description NVARCHAR(255),
    Price DECIMAL(18,2) NOT NULL,
    Stock INT,
    ImageUrl NVARCHAR(255),
    CategoryId INT NOT NULL,
    FOREIGN KEY (CategoryId) REFERENCES Categories(Id)
);

-- Tabla de usuarios
CREATE TABLE Users (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Username NVARCHAR(100) NOT NULL,
    Email NVARCHAR(100) NOT NULL,
    PasswordHash NVARCHAR(255) NOT NULL,
    PasswordSalt NVARCHAR(255) NOT NULL,
    Role NVARCHAR(20) NOT NULL DEFAULT 'User'
);

-- Tabla de tokens de recuperación de contraseña
CREATE TABLE PasswordResetTokens (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    Token NVARCHAR(255) NOT NULL,
    ExpiresAt DATETIME NOT NULL,
    IsUsed BIT NOT NULL DEFAULT 0,
    FOREIGN KEY (UserId) REFERENCES Users(Id)
);

-- Tabla de tokens QR
CREATE TABLE QrTokens (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Token NVARCHAR(255) NOT NULL,
    ExpiresAt DATETIME NOT NULL,
    IsUsed BIT NOT NULL DEFAULT 0
);

-- Ejemplo de categorías (solo teclados)
INSERT INTO Categories (Name, Description) VALUES
('Keyboards', 'Mechanical keyboards and accessories');

-- Ejemplo de productos (teclados mecánicos)
INSERT INTO Products (Name, Description, Price, Stock, ImageUrl, CategoryId) VALUES
('Keychron K6', 'Compact wireless mechanical keyboard with RGB backlight.', 79.99, 10, 'https://cdn.shopify.com/s/files/1/0059/0630/1017/products/K6_RGB_Aluminum_1_800x.png', 1),
('Ducky One 2 Mini', '60% mechanical keyboard, double-shot PBT keycaps, RGB.', 109.99, 8, 'https://www.duckychannel.com.tw/en/Ducky-One-2-Mini/images/One2Mini_1.jpg', 1),
('Logitech G915 TKL', 'Wireless RGB mechanical gaming keyboard, low profile.', 199.99, 5, 'https://resource.logitech.com/w_800,c_limit,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/logitech/en/products/keyboards/g915-tkl/gallery/g915-tkl-gallery-1.png', 1),
('Akko 3068B Plus', '68-key compact wireless mechanical keyboard, hot-swappable.', 89.99, 12, 'https://cdn.shopify.com/s/files/1/0059/0630/1017/products/3068BPlus_800x.png', 1),
('Anne Pro 2', '60% wireless mechanical keyboard, customizable RGB.', 89.99, 7, 'https://cdn.shopify.com/s/files/1/0059/0630/1017/products/annepro2_800x.png', 1),
('Varmilo VA87M', 'TKL mechanical keyboard, dye-sub PBT keycaps.', 129.99, 6, 'https://cdn.shopify.com/s/files/1/0059/0630/1017/products/VA87M_800x.png', 1); 