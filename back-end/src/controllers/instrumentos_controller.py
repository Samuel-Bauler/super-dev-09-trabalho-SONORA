from fastapi import APIRouter

from src.repositories import instrumentos_repository


router = APIRouter()

@router.get("/instrumentos")
def listar_instrumentos():
    return instrumentos_repository.consultar_todos()