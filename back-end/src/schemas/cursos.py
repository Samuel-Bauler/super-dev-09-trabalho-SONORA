from dataclasses import dataclass
from src.schemas.clientes import Cliente
from src.schemas.instrumentos import Instrumento
from typing import Optional

@dataclass
class Curso:
    id: int
    nome: str
    descricao: str
    cliente: Cliente
    instrumento: Instrumento
    status: bool

@dataclass 
class CursoCadastro:
    nome: str
    descricao: str
    id_cliente: int
    id_instrumento: int
    status: bool


@dataclass
class CursoEditar:
    nome: str
    descricao: str
    id_cliente: int
    id_instrumento: int
    status: Optional[bool] = None