from fastapi import APIRouter

from src.repositories import cursos_repository

router = APIRouter(
    tags=["Cursos"]
)

@router.get("/cursos")
def listar_cursos():
    return cursos_repository.consultar_todos()