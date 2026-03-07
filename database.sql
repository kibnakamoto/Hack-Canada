
SET FOREIGN_KEY_CHECKS = 0;


CREATE TABLE businesses (
    id     INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    auth0_user_id  VARCHAR(255) NOT NULL UNIQUE,  


    company_name    VARCHAR(255) NOT NULL,
    registered_address VARCHAR(500) NOT NULL,

 
    status    ENUM('active', 'inactive', 'pending') DEFAULT 'pending',
    is_franchise  BOOLEAN DEFAULT FALSE,


    start_date  DATE NULL,       
    services_offered JSON NULL,               

 
    cost_update_requested BOOLEAN DEFAULT FALSE, 
    platform_commission_percent DECIMAL(5,2) DEFAULT 0, 


    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_status (status),
    INDEX idx_company_name (company_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;





CREATE TABLE products (
    id    INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    business_id INT UNSIGNED NOT NULL,
    
    name  VARCHAR(255) NOT NULL,
    description  TEXT NULL,
    price     DECIMAL(10,2) NOT NULL,
    stock_quantity INT UNSIGNED NOT NULL DEFAULT 0,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
    INDEX idx_business (business_id),
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE orders (
    id    INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    verification_number  VARCHAR(20) NOT NULL UNIQUE,  

  
    customer_session_id     VARCHAR(100) NULL,            
    
    business_id        INT UNSIGNED NOT NULL,
    

    status            ENUM(
        'pending_store_confirmation',   
        'confirmed',               
        'completed',                   
        'cancelled_by_store',            
        'cancelled_expired'              
    ) NOT NULL DEFAULT 'pending_store_confirmation',
    

    verification_timeout_minutes INT UNSIGNED NOT NULL DEFAULT 2,  
    store_confirmed_at   TIMESTAMP NULL,            
    expires_at          TIMESTAMP NULL,              
    completed_at           TIMESTAMP NULL,      
    
  
    subtotal              DECIMAL(10,2) NOT NULL,
    platform_commission_percent DECIMAL(5,2) NOT NULL,
    platform_commission_amount  DECIMAL(10,2) NOT NULL DEFAULT 0,
    total_amount          DECIMAL(10,2) NOT NULL,      
    
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
    INDEX idx_verification (verification_number),
    INDEX idx_business_status (business_id, status),
    INDEX idx_expires (expires_at),
    INDEX idx_customer_session (customer_session_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;




CREATE TABLE order_items (
    id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id     INT UNSIGNED NOT NULL,
    product_id     INT UNSIGNED NOT NULL,
    
    quantity      INT UNSIGNED NOT NULL,
    unit_price     DECIMAL(10,2) NOT NULL,
    
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_order (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



CREATE TABLE stock_reservations (
    id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id    INT UNSIGNED NOT NULL,
    order_id       INT UNSIGNED NOT NULL,
    quantity     INT UNSIGNED NOT NULL,
    expires_at   TIMESTAMP NOT NULL,           
    
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    INDEX idx_product (product_id),
    INDEX idx_order (order_id),
    INDEX idx_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE earnings_history (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    business_id      INT UNSIGNED NOT NULL,
    order_id         INT UNSIGNED NOT NULL,
    
    order_total       DECIMAL(10,2) NOT NULL,
    platform_commission DECIMAL(10,2) NOT NULL,
    business_earnings  DECIMAL(10,2) NOT NULL,
    
    month_year    DATE NOT NULL,      
    
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    INDEX idx_business_month (business_id, month_year),
    INDEX idx_month (month_year)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE verification_sequence (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    last_number     INT UNSIGNED NOT NULL DEFAULT 0,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO verification_sequence (last_number) VALUES (0);

SET FOREIGN_KEY_CHECKS = 1;