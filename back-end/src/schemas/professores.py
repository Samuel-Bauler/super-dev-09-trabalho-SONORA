from pydantic import BaseModel


class Professor(BaseModel):
    id: int
    nome: str
    id_instrumento: int
    alunos: int
    status: int


class ProfessorCreate(BaseModel):
    nome: str
    id_instrumento: int
    alunos: int
    status: int