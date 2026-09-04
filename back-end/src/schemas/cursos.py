from dataclasses import dataclass
from src.schemas.clientes import Cliente
from src.schemas.instrumentos import Instrumentos

@dataclass
class Curso:
    id: int
    nome: str
    descricao: str
    cliente: Cliente
    instrumento: Instrumentos
    status: bool