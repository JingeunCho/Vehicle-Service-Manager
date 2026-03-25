-- Action Item 1: MariaDB DDL Schema
-- Audit 컬럼 (created_at, updated_at) 및 is_deleted 공통 적용

CREATE TABLE IF NOT EXISTS member (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nickname VARCHAR(50) NOT NULL,
    preferred_region VARCHAR(100),
    is_deleted TINYINT(1) NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS member_settings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id BIGINT NOT NULL UNIQUE,
    is_dark_mode TINYINT(1) NOT NULL DEFAULT 0,
    telegram_bot_token VARCHAR(255),
    is_deleted TINYINT(1) NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES member(id)
);

CREATE TABLE IF NOT EXISTS vehicle (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    car_model VARCHAR(100) NOT NULL,
    license_plate VARCHAR(50) NOT NULL,
    fuel_type VARCHAR(20) NOT NULL,
    current_mileage INT NOT NULL DEFAULT 0,
    is_primary TINYINT(1) NOT NULL DEFAULT 0,
    drive_type VARCHAR(10),
    
    -- Oil Maintenance
    engine_oil_interval INT,
    last_engine_oil_change_date DATE,
    transmission_oil_interval INT,
    last_transmission_oil_change_date DATE,
    differential_oil_interval INT,
    last_differential_oil_change_date DATE,

    -- Wheel Specs (Front/Rear)
    front_wheel_brand VARCHAR(100),
    front_wheel_model VARCHAR(100),
    front_wheel_diameter INT,
    front_wheel_width FLOAT,
    front_wheel_offset INT,
    rear_wheel_brand VARCHAR(100),
    rear_wheel_model VARCHAR(100),
    rear_wheel_diameter INT,
    rear_wheel_width FLOAT,
    rear_wheel_offset INT,

    -- Tire Specs (Front/Rear)
    front_tire_brand VARCHAR(100),
    front_tire_model VARCHAR(100),
    front_tire_width INT,
    front_tire_aspect_ratio INT,
    front_tire_diameter INT,
    rear_tire_brand VARCHAR(100),
    rear_tire_model VARCHAR(100),
    rear_tire_width INT,
    rear_tire_aspect_ratio INT,
    rear_tire_diameter INT,

    -- Brake Specs
    front_brake_pad_brand VARCHAR(100),
    front_brake_pad_model VARCHAR(100),
    last_front_brake_pad_change_date DATE,
    rear_brake_pad_brand VARCHAR(100),
    rear_brake_pad_model VARCHAR(100),
    last_rear_brake_pad_change_date DATE,
    last_front_brake_rotor_change_date DATE,
    last_rear_brake_rotor_change_date DATE,

    -- Coolant
    coolant_product_name VARCHAR(100),
    coolant_last_change_date DATE,

    tuning_history TEXT,
    insurance_date DATE,
    is_deleted TINYINT(1) NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES member(id)
);

CREATE TABLE IF NOT EXISTS ledger (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id BIGINT NOT NULL,
    -- Entity 리팩토링: Category 대신 Enum(VARCHAR) 및 title 컬럼 사용
    category VARCHAR(50) NOT NULL,
    title VARCHAR(100) NOT NULL,
    record_date DATE NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    mileage_at_record INT NOT NULL,
    memo VARCHAR(500),
    -- 주유 전용 Nullable 컬럼
    unit_price DECIMAL(10, 2),
    volume DECIMAL(10, 2),
    gas_station_name VARCHAR(100),
    is_opinet_auto TINYINT(1) DEFAULT 0,
    maintenance_type VARCHAR(50),
    is_deleted TINYINT(1) NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicle(id)
);

CREATE TABLE IF NOT EXISTS bot_connection (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id BIGINT NOT NULL,
    platform_type VARCHAR(50) NOT NULL,
    platform_user_id VARCHAR(100),
    otp_token VARCHAR(50) NOT NULL UNIQUE,
    is_verified TINYINT(1) NOT NULL DEFAULT 0,
    is_deleted TINYINT(1) NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES member(id)
);
