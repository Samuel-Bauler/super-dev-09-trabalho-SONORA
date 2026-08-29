CREATE DATABASE sonora;

USE sonora;

CREATE TABLE clientes(
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(40) NOT NULL,
    email VARCHAR(40) NOT NULL
);

-- CREATE TABLE instrumentos(
--     id INT PRIMARY KEY AUTO_INCREMENT,
--     nome VARCHAR(15) NOT NULL
-- );

-- CREATE TABLE professores(
--     id INT PRIMARY KEY AUTO_INCREMENT,
--     // dados do professor
--     status TINYINT NOT NULL
-- );

-- CREATE TABLE aulas(
--     id INT PRIMARY KEY AUTO_INCREMENT,
--     id_professor INT NOT NULL,
--     id_curso INT NOT NULL,
--     data date NOT NULL,
--     hora_inicio TIME NOT NULL,
--     duracao TIME NOT NULL
-- );

-- CREATE TABLE cursos(
--     id INT PRIMARY KEY AUTO_INCREMENT,
--     nome VARCHAR(40) NOT NULL,
--     descricao
--     id_cliente INT NOT NULL,
--     id_instrumento INT NOT NULL
-- )