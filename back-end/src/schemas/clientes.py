from pydantic import BaseModel


class Cliente(BaseModel):
    id: int
    nome: str
    email: str


class ClienteCreate(BaseModel):
    nome: str
    email: str