from dataclasses import dataclass
from datetime import date, time
from src.schemas.professores import Professor
from src.schemas.clientes import Cliente


@dataclass
class Aulas:
    id: int
    id_professor: int
    id_cliente: int
    id_curso: int
    data: date
    hora_inicio: time
    duracao: time
