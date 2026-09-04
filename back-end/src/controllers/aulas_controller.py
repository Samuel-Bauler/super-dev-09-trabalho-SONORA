from fastapi import APIRouter, HTTPException, status

from src.repositories import aulas_repository
from src.schemas.aulas import  AulaCadastro , AulaEditar

router = APIRouter(
    tags=["Aulas"]
)

@router.get("/aulas")
def consultar_aulas():
    return aulas_repository.consultar_todos()

@router.get("/aulas/{id}")
def consultar_por_id(id):
    return aulas_repository.consultar_por_id(id)

@router.post("/aulas")
def cadastrar_aula(aulas: AulaCadastro):
    return aulas_repository.cadastrar(aulas)

@router.delete("/aulas/{id}")
def apagar_aula(id):
    aula = aulas_repository.consultar_por_id(id)

    if aula is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pokemon não encontrado")


    aulas_repository.apagar(id)
    return {
        "status": "ok"
    }

@router.put("/aulas/{id}")
def editar(id: int, aula: AulaEditar):
    aula_banco = aulas_repository.consultar_por_id(id)

    if aula_banco is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="aula não encontrado")

    aulas_repository.editar(id, aula)
    return {
        "status": "ok"
    }