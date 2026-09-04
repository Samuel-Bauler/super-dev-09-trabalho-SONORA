from dataclasses import dataclass
from datetime import date, time
from src.schemas.professores import Professor
from src.schemas.clientes import Cliente
from src.schemas.cursos import Curso


@dataclass
class Aulas:
    id: int
    professor: Professor
    cliente: Cliente
    curso: Curso
    data: date
    hora_inicio: time
    duracao: time

@dataclass
class AulaCadastro:
    professor: str
    cliente: str
    curso: str
    data: date
    hora_inicio: time
    duracao: time

@dataclass
class AulaEditar:
    professor: str
    cliente: str
    curso: str
    data: date
    hora_inicio: time
    duracao: time