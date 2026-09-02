from dataclasses import dataclass

@dataclass
class Cliente:
    id: int
    nome: str
    email: str

@dataclass
class ClienteCreate:
    nome: str
    email: str