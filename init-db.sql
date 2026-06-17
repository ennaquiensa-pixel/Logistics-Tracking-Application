-- Script d'initialisation des bases de données PostgreSQL
SELECT 'CREATE DATABASE users_db' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'users_db')\gexec
SELECT 'CREATE DATABASE orders_db' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'orders_db')\gexec
SELECT 'CREATE DATABASE delivery_db' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'delivery_db')\gexec
SELECT 'CREATE DATABASE warehouses_db' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'warehouses_db')\gexec
SELECT 'CREATE DATABASE products_db' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'products_db')\gexec
SELECT 'CREATE DATABASE notifications_db' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'notifications_db')\gexec
SELECT 'CREATE DATABASE routes_db' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'routes_db')\gexec
