from dataclasses import dataclass

@dataclass
class Professor:
    id: int
    nome: str
    id_instrumento: int
    alunos: int
    status: int

@dataclass
class ProfessorCreate:
    nome: str
    id_instrumento: int
    alunos: int
    status: bool