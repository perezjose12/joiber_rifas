-- Raffles
CREATE TABLE raffles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    total_tickets INT NOT NULL,
    ticket_price NUMERIC(10,2) NOT NULL,
    start_date TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT now()
);
-- Users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    created_at TIMESTAMP DEFAULT now()
);

-- Purchases
CREATE TABLE purchases (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    raffle_id INT REFERENCES raffles(id),
    bank_id INT REFERENCES banks(id),
    payment_ref VARCHAR(100) NOT NULL,
    proof_url TEXT,
    moneda_pago VARCHAR(10),
    status TEXT DEFAULT 'pending',
    tickets INT DEFAULT 2,
    created_at TIMESTAMP DEFAULT now()
);

-- Tickets
CREATE TABLE tickets (
    id SERIAL PRIMARY KEY,
    raffle_id INT REFERENCES raffles(id),
    numero INT NOT NULL,
    status VARCHAR(20) DEFAULT 'available',
    purchase_id INT REFERENCES purchases(id),
    is_premium BOOLEAN DEFAULT FALSE,
    is_winner BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT now()
);

create table admins (
  id serial primary key,
  email text unique not null
);

INSERT INTO raffles (
    title,
    description,
    total_tickets,
    ticket_price,
    start_date
) VALUES (
    'Rifa de KBR',
    'Rifa de una moto',
    10000,
    1.00,
    '2025-08-20 00:00:00'
);

-- Obtener el id de la rifa recién creada
SELECT id FROM raffles
WHERE title = 'Rifa de KBR'
ORDER BY created_at DESC
LIMIT 1;

-- Generar los 10,000 tickets
INSERT INTO tickets (raffle_id, numero, status)
SELECT 1, gs, 'available'
FROM generate_series(1, 10000) AS gs;

CREATE INDEX IF NOT EXISTS idx_tickets_raffle_status
ON tickets (raffle_id, status);

CREATE OR REPLACE FUNCTION reserve_tickets(
    p_raffle_id INT,
    p_tickets INT,
    p_user_email TEXT,
    p_user_name TEXT,
    p_user_phone TEXT,
    p_payment_ref TEXT,
    p_proof_url TEXT,
    p_bank_id INT,
    p_moneda_pago TEXT,
    p_total_amount NUMERIC
)
RETURNS TABLE (
    purchase_id INT,
    user_id INT,
    raffle_id INT,
    tickets INT,
    total_amount NUMERIC,
    status TEXT
) AS $$
DECLARE
    v_user_id INT;
    v_purchase_id INT;
BEGIN
    -- 1️⃣ Insertar usuario si no existe
    INSERT INTO users (email, name, phone)
    VALUES (p_user_email, p_user_name, p_user_phone)
    ON CONFLICT (email) DO NOTHING
    RETURNING id INTO v_user_id;

    IF v_user_id IS NULL THEN
        SELECT id INTO v_user_id
        FROM users
        WHERE email = p_user_email;
    END IF;

    -- 2️⃣ Insertar purchase con status pending
    INSERT INTO purchases (
        user_id,
        raffle_id,
        tickets,
        payment_ref,
        proof_url,
        bank_id,
        moneda_pago,
        total_amount,
        status,
        created_at
    ) VALUES (
        v_user_id,
        p_raffle_id,
        p_tickets,
        p_payment_ref,
        p_proof_url,
        p_bank_id,
        p_moneda_pago,
        p_total_amount,
        'pending',
        now()
    )
    RETURNING id INTO v_purchase_id;

    -- 3️⃣ Retornar la compra creada
    RETURN QUERY
    SELECT
        v_purchase_id,
        v_user_id,
        p_raffle_id,
        p_tickets AS tickets,
        p_total_amount,
        'pending' AS status;

END;
$$ LANGUAGE plpgsql;



CREATE TABLE banks (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL, -- ej: banco_venezuela, zelle
    name VARCHAR(100) NOT NULL,
    img_url VARCHAR(255),             -- ruta de la imagen del banco
    currency VARCHAR(10) NOT NULL,    -- moneda, ej: VES, USD, COP
    created_at TIMESTAMP DEFAULT now()
);

INSERT INTO banks (code, name, img_url, currency) VALUES
('banco_venezuela', 'Banco de Venezuela', '/banco_venezuela.png', 'VES'),
('bancolombia', 'Bancolombia', '/bancolombia.png', 'COP'),
('zelle', 'Zelle', '/zelle.png', 'USD'),
('binance', 'Binance', '/binance.png', 'USD');