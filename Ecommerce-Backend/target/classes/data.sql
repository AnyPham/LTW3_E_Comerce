-- Insert roles if not exists
MERGE INTO role (name) KEY(name) VALUES ('ADMIN');
MERGE INTO role (name) KEY(name) VALUES ('USER');

-- Insert admin user (password: admin123)
MERGE INTO app_user (username, password) KEY(username) VALUES ('admin', '$2a$10$3Qrx0Guo3WuMkjhgRwytYOUAJZcMjRzTHLez.pPG4hMVwHUPbz8.2');

-- Assign ADMIN role to admin user
MERGE INTO user_roles (user_id, roles_id) 
SELECT u.id, r.id FROM app_user u, role r 
WHERE u.username = 'admin' AND r.name = 'ADMIN';

INSERT INTO product (name, description, brand, price, category, release_date, product_available, stock_quantity, image_name, original_price, discount_percent, free_shipping, is_hot, view_count, promo_code, promo_end_date)
VALUES
-- Laptops
('MacBook Air M2', 'Lightweight, powerful, all-day battery.', 'Apple', 27000000.00, 'Laptop', '2024-06-01', true, 20, 'macbook_air_m2.png', 30000000.00, 10, true, true, 350, 'APPLE10', '2024-12-31'),
('Dell XPS 13', 'Sleek ultrabook with InfinityEdge display.', 'Dell', 26000000.00, 'Laptop', '2024-06-05', true, 15, 'dell_xps_13.png', 32500000.00, 20, true, false, 180, 'DELL20', '2024-11-30'),
('HP Spectre x360', 'Convertible 2-in-1 with OLED touch.', 'HP', 21875000.00, 'Laptop', '2024-06-10', true, 10, 'hp_spectre_x360.png', 31250000.00, 30, false, false, 120, 'HP30', '2024-10-15'),
('Lenovo X1 Carbon', 'Durable, business-grade ultrabook.', 'Lenovo', 35000000.00, 'Laptop', '2024-06-15', true, 8, 'lenovo_thinkpad_x1_carbon.png', null, 0, false, false, 90, null, null),
('ASUS ROG Zephyrus G14', 'High-end gaming laptop with RTX.', 'ASUS', 20000000.00, 'Laptop', '2024-06-20', true, 12, 'asus_rog_zephyrus_g14.png', 40000000.00, 50, true, true, 420, 'ASUS50', '2024-09-30'),
('Acer Swift 5', 'Lightweight laptop with Intel Evo.', 'Acer', 24750000.00, 'Laptop', '2024-06-25', true, 18, 'acer_swift_5.png', 27500000.00, 10, false, false, 75, null, null),
('Microsoft Surface Laptop 5', 'Elegant design with touchscreen.', 'Microsoft', 33750000.00, 'Laptop', '2024-07-01', true, 10, 'surface_laptop_5.png', null, 0, true, false, 110, 'SURFACE', '2024-12-15'),
('LG Gram 16', 'Ultra-light with large display.', 'LG', 29000000.00, 'Laptop', '2024-07-05', true, 7, 'lg_gram_16.png', 36250000.00, 20, false, false, 65, null, null),
('Razer Blade 14', 'Compact gaming laptop with Ryzen.', 'Razer', 33250000.00, 'Laptop', '2024-07-10', true, 5, 'razer_blade_14.png', 47500000.00, 30, true, true, 280, 'RAZER30', '2024-10-31'),
('Samsung Galaxy Book3 Pro', 'AMOLED screen and slim profile.', 'Samsung', 35000000.00, 'Laptop', '2024-07-12', true, 9, 'samsung_galaxy_book3_pro.png', null, 0, false, false, 95, null, null),
('MSI Prestige 14 Evo', 'Premium ultrabook for creators.', 'MSI', 16250000.00, 'Laptop', '2024-07-15', true, 11, 'msi_prestige_14_evo.png', 32500000.00, 50, true, true, 310, 'MSI50', '2024-09-15'),
('Huawei MateBook X Pro', 'Elegant design with 3K display.', 'Huawei', 30375000.00, 'Laptop', '2024-07-18', true, 6, 'huawei_matebook_x_pro.png', 33750000.00, 10, false, false, 85, null, null),
('Google Pixelbook Go', 'Minimalist Chromebook with long battery.', 'Google', 19000000.00, 'Laptop', '2024-07-20', true, 14, 'pixelbook_go.png', 23750000.00, 20, true, false, 130, 'GOOGLE20', '2024-11-15'),
('Alienware x14', 'High-performance gaming laptop.', 'Dell', 30625000.00, 'Laptop', '2024-07-22', true, 8, 'alienware_x14.png', 43750000.00, 30, true, true, 250, 'ALIEN30', '2024-10-20'),
('Toshiba Dynabook Tecra A50', 'Business laptop with enterprise features.', 'Toshiba', 14375000.00, 'Laptop', '2024-07-25', true, 10, 'toshiba_dynabook_tecra_a50.png', 28750000.00, 50, false, false, 70, 'TOSHIBA50', '2024-09-20'),

-- PC
('Acer Predator Orion 5000', 'High-performance desktop for gaming.', 'Acer', 40500000.00, 'PC', '2024-06-21', true, 10, 'acer_predator_orion_5000.png', 45000000.00, 10, true, true, 320, 'ACER10', '2024-12-20'),
('HP Pavilion Gaming Desktop', 'Affordable gaming PC with NVIDIA GPU.', 'HP', 22000000.00, 'PC', '2024-06-22', true, 14, 'hp_pavilion_gaming.png', 27500000.00, 20, false, false, 150, 'HP20', '2024-11-25'),
('Dell Alienware Aurora R13', 'Powerful desktop for hardcore gamers.', 'Dell', 38500000.00, 'PC', '2024-06-23', true, 6, 'alienware_aurora_r13.png', 55000000.00, 30, true, true, 280, 'DELL30', '2024-10-10'),
('Lenovo Legion T5', 'Gaming desktop with AMD Ryzen.', 'Lenovo', 32500000.00, 'PC', '2024-06-24', true, 12, 'lenovo_legion_t5.png', null, 0, false, false, 110, null, null),
('ASUS ROG Strix GA15', 'Gaming rig with RGB and Ryzen 7.', 'ASUS', 18750000.00, 'PC', '2024-06-25', true, 8, 'asus_rog_strix_ga15.png', 37500000.00, 50, true, true, 390, 'ASUS50', '2024-09-25'),
('MSI Trident 3', 'Compact gaming PC with VR support.', 'MSI', 28125000.00, 'PC', '2024-06-26', true, 9, 'msi_trident_3.png', 31250000.00, 10, false, false, 85, null, null),
('CyberPowerPC Gamer Xtreme', 'Prebuilt gaming PC with Intel i7.', 'CyberPowerPC', 28000000.00, 'PC', '2024-06-27', true, 11, 'cyberpowerpc_gamer_xtreme.png', 35000000.00, 20, true, false, 130, 'CYBER20', '2024-11-20'),
('iBUYPOWER SlateMR 2150', 'Stylish desktop with RGB lighting.', 'iBUYPOWER', 23625000.00, 'PC', '2024-06-28', true, 13, 'ibuypower_slatemr_2150.png', 33750000.00, 30, false, false, 95, 'IBUY30', '2024-10-05'),
('Corsair One i300', 'Compact and powerful gaming tower.', 'Corsair', 31250000.00, 'PC', '2024-06-29', true, 4, 'corsair_one_i300.png', 62500000.00, 50, true, true, 270, 'CORSAIR50', '2024-09-15'),
('NZXT Streaming PC', 'Designed for streamers with Ryzen 9.', 'NZXT', 45000000.00, 'PC', '2024-06-30', true, 5, 'nzxt_streaming_pc.png', 50000000.00, 10, true, true, 240, 'NZXT10', '2024-12-10'),
('Thermaltake LCGS Avalanche', 'Gaming PC with liquid cooling.', 'Thermaltake', 29000000.00, 'PC', '2024-07-01', true, 6, 'thermaltake_lcgs.png', 36250000.00, 20, false, false, 75, null, null),
('ZOTAC MEK Hero G1', 'Prebuilt with Intel Core i7 & RTX.', 'ZOTAC', 28000000.00, 'PC', '2024-07-02', true, 7, 'zotac_mek_hero_g1.png', 40000000.00, 30, true, false, 120, 'ZOTAC30', '2024-10-25'),
('Skytech Blaze II', 'Affordable desktop with Ryzen 5.', 'Skytech', 12487500.00, 'PC', '2024-07-03', true, 15, 'skytech_blaze_ii.png', 24975000.00, 50, false, true, 210, 'SKYTECH50', '2024-09-10'),
('Alienware Aurora Ryzen Edition', 'Custom-built for AMD gamers.', 'Dell', 42750000.00, 'PC', '2024-07-04', true, 6, 'alienware_ryzen_edition.png', 47500000.00, 10, true, true, 260, 'ALIEN10', '2024-12-05'),
('ASRock DeskMini X300', 'Mini PC with powerful internals.', 'ASRock', 14000000.00, 'PC', '2024-07-05', true, 10, 'asrock_deskmini_x300.png', 17500000.00, 20, false, false, 90, 'ASROCK20', '2024-11-15'),

-- Màn hình
('LG UltraFine 5K', 'High-res display for creatives.', 'LG', 28665000, 'Màn hình', '2024-07-06', true, 10, 'lg_ultrafine_5k.png', 31850000, 10, true, true, 220, 'LG10', '2024-12-15'),
('ASUS ProArt PA278CV', 'Color-accurate for professionals.', 'ASUS', 9800000, 'Màn hình', '2024-07-07', true, 12, 'asus_proart_pa278cv.png', 12250000, 20, false, false, 95, 'ASUS20', '2024-11-10'),
('Dell UltraSharp U2723QE', '4K monitor with USB-C hub.', 'Dell', 11147500, 'Màn hình', '2024-07-08', true, 8, 'dell_ultrasharp_u2723qe.png', 15925000, 30, true, false, 110, 'DELL30', '2024-10-20'),
('Samsung Odyssey G7', 'Curved QHD gaming monitor.', 'Samsung', 17150000, 'Màn hình', '2024-07-09', true, 9, 'samsung_odyssey_g7.png', null, 0, false, false, 85, null, null),
('Acer Predator X27', '4K 144Hz G-SYNC monitor.', 'Acer', 22050000, 'Màn hình', '2024-07-10', true, 5, 'acer_predator_x27.png', 44100000, 50, true, true, 190, 'ACER50', '2024-09-30'),
('Gigabyte M32U', '32\" 4K gaming monitor with 144Hz.', 'Gigabyte', 16537500, 'Màn hình', '2024-07-11', true, 7, 'gigabyte_m32u.png', 18375000, 10, false, false, 70, null, null),
('BenQ EX3501R', 'Ultrawide curved monitor for work.', 'BenQ', 10780000, 'Màn hình', '2024-07-12', true, 6, 'benq_ex3501r.png', 13475000, 20, true, false, 80, 'BENQ20', '2024-11-05'),
('MSI Optix MAG274QRF', 'QHD monitor with 165Hz refresh.', 'MSI', 7717500, 'Màn hình', '2024-07-13', true, 10, 'msi_optix_mag274qrf.png', 11025000, 30, false, false, 100, 'MSI30', '2024-10-15'),
('Philips 499P9H', 'Superwide 49\" productivity monitor.', 'Philips', 14700000, 'Màn hình', '2024-07-14', true, 3, 'philips_499p9h.png', 29400000, 50, true, true, 150, 'PHILIPS50', '2024-09-25'),
('AOC 24G2', 'Budget-friendly 144Hz gaming monitor.', 'AOC', 4410000, 'Màn hình', '2024-07-15', true, 15, 'aoc_24g2.png', 4900000, 10, false, false, 120, null, null),
('ViewSonic VP2768a', 'Pro monitor with 100% sRGB.', 'ViewSonic', 8820000, 'Màn hình', '2024-07-16', true, 4, 'viewsonic_vp2768a.png', 11025000, 20, true, false, 65, 'VIEW20', '2024-11-20'),
('LG 34GN850-B', 'Ultrawide monitor with G-SYNC.', 'LG', 15435000, 'Màn hình', '2024-07-17', true, 5, 'lg_34gn850.png', 22050000, 30, false, true, 170, 'LG30', '2024-10-10'),
('Samsung Smart Monitor M8', 'All-in-one monitor with smart apps.', 'Samsung', 8575000, 'Màn hình', '2024-07-18', true, 6, 'samsung_m8.png', 17150000, 50, true, true, 200, 'SAMSUNG50', '2024-09-20'),
('ASUS TUF Gaming VG27AQ', '1440p 165Hz gaming monitor.', 'ASUS', 7717500, 'Màn hình', '2024-07-19', true, 11, 'asus_tuf_vg27aq.png', 8575000, 10, false, false, 130, 'ASUS10', '2024-12-05'),
('HP U28 4K HDR', 'Affordable 4K monitor for creators.', 'HP', 8820000, 'Màn hình', '2024-07-20', true, 9, 'hp_u28.png', 11025000, 20, true, false, 90, 'HP20', '2024-11-15'),

-- Build PC
('Intel Core i9-13900K', 'Flagship 13th-gen processor.', 'Intel', 13500000, 'Build PC', '2024-07-21', true, 20, 'intel_i9_13900k.png', 15000000, 10, true, true, 280, 'INTEL10', '2024-12-25'),
('AMD Ryzen 9 7950X', 'High-end CPU for gamers.', 'AMD', 11000000, 'Build PC', '2024-07-22', true, 18, 'ryzen_9_7950x.png', 13750000, 20, true, true, 310, 'AMD20', '2024-11-30'),
('MSI MPG Z790 Carbon', 'Gaming motherboard with DDR5.', 'MSI', 7000000, 'Build PC', '2024-07-23', true, 14, 'msi_z790_carbon.png', 10000000, 30, false, false, 120, 'MSI30', '2024-10-25'),
('ASUS ROG Crosshair X670E', 'Premium AM5 motherboard.', 'ASUS', 12500000, 'Build PC', '2024-07-24', true, 10, 'asus_x670e.png', null, 0, false, false, 90, null, null),
('Corsair Vengeance DDR5 32GB', 'Fast memory for gaming rigs.', 'Corsair', 2500000, 'Build PC', '2024-07-25', true, 25, 'corsair_vengeance_ddr5.png', 5000000, 50, true, true, 230, 'CORSAIR50', '2024-09-30'),
('Samsung 980 PRO 2TB', 'High-speed NVMe SSD.', 'Samsung', 5625000, 'Build PC', '2024-07-26', true, 30, 'samsung_980pro_2tb.png', 6250000, 10, false, false, 150, null, null),
('NZXT H510 Elite', 'Sleek ATX case with RGB.', 'NZXT', 3000000, 'Build PC', '2024-07-27', true, 12, 'nzxt_h510.png', 3750000, 20, true, false, 110, 'NZXT20', '2024-11-25'),
('Seasonic Focus GX-850', 'Gold-rated 850W PSU.', 'Seasonic', 2450000, 'Build PC', '2024-07-28', true, 15, 'seasonic_gx850.png', 3500000, 30, false, false, 85, 'SEASONIC30', '2024-10-20'),
('Noctua NH-D15', 'Premium CPU air cooler.', 'Noctua', 1250000, 'Build PC', '2024-07-29', true, 20, 'noctua_nhd15.png', 2500000, 50, true, false, 130, 'NOCTUA50', '2024-09-25'),
('Arctic MX-6', 'High-quality thermal paste.', 'Arctic', 225000, 'Build PC', '2024-07-30', true, 50, 'arctic_mx6.png', 250000, 10, false, false, 70, null, null),
('Cooler Master ML360R', 'Liquid cooler with ARGB.', 'Cooler Master', 3400000, 'Build PC', '2024-07-31', true, 10, 'cooler_master_ml360r.png', 4250000, 20, true, true, 180, 'COOLER20', '2024-11-20'),
('Thermaltake Core P5', 'Open-frame chassis for showcase builds.', 'Thermaltake', 3500000, 'Build PC', '2024-08-01', true, 6, 'thermaltake_core_p5.png', 5000000, 30, false, false, 95, 'THERM30', '2024-10-15'),
('G.SKILL Trident Z5 RGB 32GB', 'High-speed DDR5 memory.', 'G.SKILL', 2750000, 'Build PC', '2024-08-02', true, 18, 'gskill_tridentz5.png', 5500000, 50, true, true, 210, 'GSKILL50', '2024-09-20'),
('Phanteks Eclipse G500A', 'ATX case with airflow focus.', 'Phanteks', 2925000, 'Build PC', '2024-08-03', true, 11, 'phanteks_g500a.png', 3250000, 10, false, false, 80, 'PHANTEKS10', '2024-12-10'),
('Be Quiet! Dark Power 12', 'Platinum PSU for silence.', 'Be Quiet!', 5000000, 'Build PC', '2024-08-04', true, 9, 'bequiet_dark_power12.png', 6250000, 20, true, false, 100, 'BEQUIET20', '2024-11-15'),

-- Linh kiện máy tính
('Intel AX210 Wi-Fi Card', 'Wi-Fi 6E + Bluetooth 5.2.', 'Intel', 771750, 'Linh kiện máy tính', '2024-08-05', true, 40, 'intel_ax210.png', 857500, 10, true, false, 120, 'INTELAX10', '2024-12-20'),
('ASUS Xonar AE Sound Card', 'High-fidelity PCIe sound card.', 'ASUS', 1568000, 'Linh kiện máy tính', '2024-08-06', true, 22, 'asus_xonar_ae.png', 1960000, 20, false, false, 85, 'ASUS20', '2024-11-25'),
('TP-Link T6E', 'PCIe dual-band Wi-Fi adapter.', 'TP-Link', 771750, 'Linh kiện máy tính', '2024-08-07', true, 35, 'tplink_t6e.png', 1102500, 30, true, false, 95, 'TPLINK30', '2024-10-20'),
('Elgato 4K60 Pro', 'Capture card for 4K gameplay.', 'Elgato', 3062500, 'Linh kiện máy tính', '2024-08-08', true, 10, 'elgato_4k60pro.png', 6125000, 50, true, true, 180, 'ELGATO50', '2024-09-25'),
('EVGA XR1 Lite', 'Budget streaming capture card.', 'EVGA', 1764000, 'Linh kiện máy tính', '2024-08-09', true, 12, 'evga_xr1_lite.png', 1960000, 10, false, false, 70, null, null),
('NZXT Internal USB Hub', 'Expand internal USB ports.', 'NZXT', 490000, 'Linh kiện máy tính', '2024-08-10', true, 18, 'nzxt_usb_hub.png', 612500, 20, true, false, 110, 'NZXT20', '2024-11-20'),
('Corsair Commander CORE', 'Fan + RGB controller.', 'Corsair', 1286250, 'Linh kiện máy tính', '2024-08-11', true, 16, 'corsair_commander_core.png', 1837500, 30, false, true, 150, 'CORSAIR30', '2024-10-15'),
('SilverStone ECM23', 'M.2 to PCIe adapter.', 'SilverStone', 245000, 'Linh kiện máy tính', '2024-08-12', true, 14, 'silverstone_ecm23.png', 490000, 50, true, false, 90, 'SILVER50', '2024-09-20'),
('ASRock Thunderbolt 4 AIC', 'Add Thunderbolt to your build.', 'ASRock', 2646000, 'Linh kiện máy tính', '2024-08-13', true, 8, 'asrock_tb4_aic.png', 2940000, 10, false, false, 65, 'ASROCK10', '2024-12-15'),
('DeepCool RGB Controller', 'Manual RGB lighting control.', 'DeepCool', 294000, 'Linh kiện máy tính', '2024-08-14', true, 10, 'deepcool_rgb_controller.png', 367500, 20, true, false, 80, 'DEEP20', '2024-11-10'),
('Inateck PCIe USB 3.2 Card', 'Expand USB connectivity.', 'Inateck', 514500, 'Linh kiện máy tính', '2024-08-15', true, 20, 'inateck_usb_card.png', 735000, 30, false, false, 75, 'INATECK30', '2024-10-10'),
('Sabrent M.2 NVMe Enclosure', 'USB-C enclosure for SSDs.', 'Sabrent', 428750, 'Linh kiện máy tính', '2024-08-16', true, 13, 'sabrent_nvme_enclosure.png', 857500, 50, true, true, 130, 'SABRENT50', '2024-09-15'),
('UGREEN SATA to USB Adapter', 'Convert SATA to USB 3.0.', 'UGREEN', 441000, 'Linh kiện máy tính', '2024-08-17', true, 17, 'ugreen_sata_adapter.png', 490000, 10, false, false, 100, null, null),
('Thermal Grizzly Kryonaut', 'Top-tier thermal compound.', 'Thermal Grizzly', 235200, 'Linh kiện máy tính', '2024-08-18', true, 25, 'thermal_grizzly_kryonaut.png', 294000, 20, true, false, 120, 'THERMAL20', '2024-11-05'),
('Syba Fan Controller', 'Manual fan speed control panel.', 'Syba', 480200, 'Linh kiện máy tính', '2024-08-19', true, 9, 'syba_fan_controller.png', 686000, 30, false, true, 85, 'SYBA30', '2024-10-05'),

-- Máy in
('Canon PIXMA G6020', 'Wireless MegaTank all-in-one.', 'Canon', 5625000, 'Máy in', '2024-08-20', true, 10, 'canon_pixma_g6020.png', 6250000, 10, true, true, 180, 'CANON10', '2024-12-30'),
('HP LaserJet Pro M404dn', 'Monochrome laser printer.', 'HP', 4000000, 'Máy in', '2024-08-21', true, 12, 'hp_laserjet_m404dn.png', 5000000, 20, false, false, 120, 'HP20', '2024-11-30'),
('Brother HL-L2390DW', 'Compact laser printer/scanner.', 'Brother', 3150000, 'Máy in', '2024-08-22', true, 15, 'brother_hll2390dw.png', 4500000, 30, true, false, 95, 'BROTHER30', '2024-10-30'),
('Epson EcoTank ET-4760', 'Wireless all-in-one with refill tanks.', 'Epson', 4375000, 'Máy in', '2024-08-23', true, 8, 'epson_ecotank_4760.png', 8750000, 50, true, true, 210, 'EPSON50', '2024-09-30'),
('Samsung Xpress M2020W', 'Wireless monochrome laser.', 'Samsung', 2925000, 'Máy in', '2024-08-24', true, 11, 'samsung_m2020w.png', 3250000, 10, false, false, 85, null, null),
('Ricoh SP 3710DN', 'Compact black & white printer.', 'Ricoh', 3400000, 'Máy in', '2024-08-25', true, 7, 'ricoh_sp3710dn.png', 4250000, 20, true, false, 70, 'RICOH20', '2024-11-25'),
('Lexmark MB2236adw', 'All-in-one monochrome laser.', 'Lexmark', 3675000, 'Máy in', '2024-08-26', true, 6, 'lexmark_mb2236adw.png', 5250000, 30, false, false, 65, 'LEXMARK30', '2024-10-25'),
('Canon imageCLASS MF644Cdw', 'Color laser multifunction printer.', 'Canon', 5000000, 'Máy in', '2024-08-27', true, 9, 'canon_mf644cdw.png', 10000000, 50, true, true, 150, 'CANON50', '2024-09-25'),
('HP OfficeJet Pro 9025e', 'Business inkjet with smart features.', 'HP', 6750000, 'Máy in', '2024-08-28', true, 10, 'hp_officejet_9025e.png', 7500000, 10, false, true, 130, 'HP10', '2024-12-25'),
('Brother MFC-J995DW', 'Inkvestment Tank printer.', 'Brother', 5400000, 'Máy in', '2024-08-29', true, 14, 'brother_j995dw.png', 6750000, 20, true, false, 110, 'BROTHER20', '2024-11-20'),
('Epson WorkForce WF-2830', 'Affordable all-in-one inkjet.', 'Epson', 1750000, 'Máy in', '2024-08-30', true, 20, 'epson_wf2830.png', 2500000, 30, false, false, 140, 'EPSON30', '2024-10-20'),
('Kyocera ECOSYS P2040dw', 'Durable laser printer.', 'Kyocera', 2875000, 'Máy in', '2024-08-31', true, 6, 'kyocera_ecosys_p2040dw.png', 5750000, 50, true, false, 75, 'KYOCERA50', '2024-09-20'),
('Pantum P2502W', 'Compact budget-friendly laser.', 'Pantum', 2025000, 'Máy in', '2024-09-01', true, 18, 'pantum_p2502w.png', 2250000, 10, false, false, 90, null, null),
('OKI B432dn', 'High-speed monochrome laser.', 'OKI', 6200000, 'Máy in', '2024-09-02', true, 4, 'oki_b432dn.png', 7750000, 20, true, true, 100, 'OKI20', '2024-11-15'),
('Canon Selphy CP1300', 'Portable photo printer.', 'Canon', 2100000, 'Máy in', '2024-09-03', true, 13, 'canon_selphy_cp1300.png', 3000000, 30, false, false, 120, 'CANON30', '2024-10-15');

