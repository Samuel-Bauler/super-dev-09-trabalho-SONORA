from fastapi import APIRouter, HTTPException, status

from src.repositories import professores_repository
from src.schemas.professores import ProfessorCreate

router = APIRouter()


@router.get("/professores")
def get_professores():
    return professores_repository.consultar_todos()


@router.get("/professores/{id}")
def consultar_por_id(id: int):

    professor = professores_repository.consultar_por_id(id)

    if professor is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Professor não encontrado"
        )

    return professor


@router.post("/professores")
def cadastrar(professor: ProfessorCreate):

    professores_repository.cadastrar(professor)

    return {"status": "ok"}


@router.put("/professores/{id}")
def editar(id: int, professor: ProfessorCreate):

    professor_banco = professores_repository.consultar_por_id(id)

    if professor_banco is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Professor não encontrado"
        )

    professores_repository.editar(id, professor)

    return {"status": "ok"}


@router.delete("/professores/{id}")
def apagar(id: int):

    professor = professores_repository.consultar_por_id(id)

    if professor is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Professor não encontrado"
        )

    professores_repository.apagar(id)

    return {"status": "ok"}