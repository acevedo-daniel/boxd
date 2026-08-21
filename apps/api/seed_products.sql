-- Script para poblar la tabla Products con ejemplos de hardware
-- Ajusta los CategoryId según tus categorías existentes
INSERT INTO Products (Name, Description, Price, CategoryId, ImageUrl)
VALUES
('Logitech MX Master 3', 'Wireless mouse with ergonomic design and advanced features.', 99.99, 1, 'https://resource.logitech.com/w_800,c_limit,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/logitech/en/products/mice/mx-master-3/gallery/mx-master-3-top-view-graphite.png'),
('Keychron K6', 'Compact wireless mechanical keyboard with RGB backlight.', 79.99, 2, 'https://cdn.shopify.com/s/files/1/0059/0630/1017/products/K6_RGB_Aluminum_1_800x.png'),
('Dell UltraSharp U2720Q', '27-inch 4K USB-C monitor for professionals.', 449.99, 3, 'https://i.dell.com/sites/csimages/Video_Imagery/all/ultrasharp-u2720q-monitor.png'),
('AMD Ryzen 7 5800X', '8-core, 16-thread desktop processor for high performance.', 329.99, 4, 'https://www.amd.com/system/files/2020-10/238837-amd-ryzen-7-5800x-PIB-1260x709.png'),
('Samsung 970 EVO Plus 1TB', 'NVMe M.2 SSD for fast storage.', 119.99, 5, 'https://images.samsung.com/is/image/samsung/p6pim/levant/feature/164053073/levant-feature-970-evo-plus-ssds-mz-v7s1t0bw-164053073.png'),
('Corsair Vengeance LPX 16GB', 'DDR4 DRAM 3200MHz memory kit.', 69.99, 6, 'https://www.corsair.com/medias/sys_master/images/images/hb1/hb2/9119648571422/-CMK16GX4M2B3200C16-Gallery-VENGEANCE-LPX-BLK-01.png'); 