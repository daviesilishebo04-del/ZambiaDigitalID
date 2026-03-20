-- Zambia Digital ID System Database Schema
-- Run this file to create all tables

-- Users table (all system users)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  full_name VARCHAR(150),
  email VARCHAR(150),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Citizens table (NRC holders)
CREATE TABLE citizens (
  id SERIAL PRIMARY KEY,
  nrc_number VARCHAR(20) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  date_of_birth DATE NOT NULL,
  gender VARCHAR(10) NOT NULL,
  place_of_birth VARCHAR(150),
  district VARCHAR(100),
  province VARCHAR(100),
  phone_number VARCHAR(20),
  email VARCHAR(150),
  photo_url VARCHAR(255),
  fingerprint_data TEXT,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vital events table (births and deaths)
CREATE TABLE vital_events (
  id SERIAL PRIMARY KEY,
  event_type VARCHAR(10) NOT NULL,
  citizen_id INTEGER REFERENCES citizens(id),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  date_of_event DATE NOT NULL,
  place_of_event VARCHAR(150),
  district VARCHAR(100),
  province VARCHAR(100),
  father_name VARCHAR(150),
  mother_name VARCHAR(150),
  cause_of_death VARCHAR(255),
  registered_by INTEGER REFERENCES users(id),
  certificate_number VARCHAR(50) UNIQUE,
  status VARCHAR(20) DEFAULT 'pending',
  synced BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit logs table
CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  action VARCHAR(255) NOT NULL,
  table_name VARCHAR(100),
  record_id INTEGER,
  details TEXT,
  ip_address VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- NRC Applications table
CREATE TABLE nrc_applications (
  id SERIAL PRIMARY KEY,
  citizen_id INTEGER REFERENCES citizens(id),
  status VARCHAR(20) DEFAULT 'pending',
  reviewed_by INTEGER REFERENCES users(id),
  reviewed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);