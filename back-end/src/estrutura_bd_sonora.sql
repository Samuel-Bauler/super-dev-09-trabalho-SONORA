CREATE DATABASE sonora;

USE sonora;

CREATE TABLE clientes(
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(40) NOT NULL,
    email VARCHAR(40) NOT NULL
);

-- SELECT nome , email FROM clientes;

CREATE TABLE instrumentos(
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(15) NOT NULL
);

-- SELECT nome FROM instrumentos

CREATE TABLE professores(
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(40), 
    id_instrumento INT NOT NULL,
    FOREIGN KEY (id_instrumento) REFERENCES instrumentos(id),
    alunos INT NOT NULL,
    status TINYINT NOT NULL
);

SELECT professores.nome, instrumentos.nome
FROM professores
INNER JOIN aulas ON (aulas.id_professor = professores.id)
INNER JOIN cursos ON (aulas.id_curso = cursos.id)
INNER JOIN instrumentos ON (cursos.id_instrumento = instrumentos.id);


CREATE TABLE aulas(
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_professor INT NOT NULL,
    FOREIGN KEY (id_professor) REFERENCES professores(id),
    id_cliente INT NOT NULL,
    FOREIGN KEY (id_cliente) REFERENCES clientes(id),
    id_curso INT NOT NULL,
    FOREIGN KEY (id_curso) REFERENCES cursos(id),
    data date NOT NULL,
    hora_inicio TIME NOT NULL,
    duracao TIME NOT NULL
);

SELECT 
    professores.nome AS professor,
    clientes.nome AS cliente,
    cursos.nome AS curso
FROM aulas
INNER JOIN professores ON (aulas.id_professor = professores.id)
INNER JOIN clientes ON (aulas.id_cliente = clientes.id)
INNER JOIN cursos ON (aulas.id_curso = cursos.id);


CREATE TABLE cursos(
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(40) NOT NULL,
    descricao VARCHAR(255),
    id_cliente INT NOT NULL,
    FOREIGN KEY (id_cliente) REFERENCES clientes(id),
    id_instrumento INT NOT NULL,
    FOREIGN KEY (id_instrumento) REFERENCES instrumentos(id)

);

SELECT clientes.nome , instrumentos.nome 
FROM cursos
INNER JOIN clientes ON (cursos.id_cliente = clientes.id)
INNER JOIN instrumentos ON (cursos.id_instrumento = instrumentos.id);


INSERT INTO clientes (nome, email) VALUES
('Lucas Silva', 'lucas@email.com'),
('Ana Souza', 'ana@email.com'),
('Pedro Oliveira', 'pedro@email.com'),
('Mariana Santos', 'mariana@email.com'),
('Gabriel Costa', 'gabriel@email.com');


INSERT INTO instrumentos (nome) VALUES
('Violão'),
('Piano'),
('Bateria'),
('Guitarra'),
('Teclado'),
('Baixo'),
('Violino');


INSERT INTO professores 
(nome, id_instrumento, alunos, status) VALUES
('Carlos Mendes', 1, 8, 1),
('Fernanda Lima', 2, 5, 1),
('Ricardo Alves', 3, 10, 1),
('Juliana Rocha', 4, 6, 1),
('Marcos Pereira', 5, 4, 0),
('Beatriz Martins', 7, 7, 1);


INSERT INTO cursos
(nome, descricao, id_cliente, id_instrumento) VALUES
('Curso de Violão Iniciante', 'Aprendizado básico de violão para iniciantes.', 1, 1),
('Curso de Piano', 'Curso de piano do nível básico ao intermediário.', 2, 2),
('Curso de Bateria', 'Introdução à bateria e desenvolvimento de ritmo.', 3, 3),
('Curso de Guitarra', 'Técnicas básicas e intermediárias de guitarra.', 4, 4),
('Curso de Teclado', 'Aprendizado de teclado e teoria musical.', 5, 5),
('Curso de Violino', 'Introdução às técnicas de violino.', 1, 7);


INSERT INTO aulas
( id_professor, id_cliente, id_curso, data, hora_inicio, duracao) VALUES
(1, 1, 1, '2026-09-01', '14:00:00', '01:00:00'),
(2, 1, 2, '2026-09-01', '15:00:00', '01:00:00'),
(3, 1, 3, '2026-09-02', '16:00:00', '01:30:00'),
(4, 1, 4, '2026-09-02', '17:00:00', '01:00:00'),
(5, 1, 5, '2026-09-03', '14:30:00', '01:00:00'),
(6, 1, 6, '2026-09-03', '16:00:00', '01:30:00');