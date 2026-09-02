from fastapi import APIRouter, HTTPException, status

from src.repositories import instrumentos_repository
from src.schemas.instrumentos import InstrumentoCadastro, InstrumentoEditar

router = APIRouter(
    tags=["Instrumentos"]
)

@router.get("/instrumentos")
def listar_instrumentos():
    return instrumentos_repository.consultar_todos()


@router.get("/instrumentos/{id}")
def consultar_por_id(id: int):
    instrumento = instrumentos_repository.consultar_por_id(id)

    if instrumento is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="instrumento não encontrado")

    return instrumento


@router.post("/instrumentos")
def cadastrar(instrumento: InstrumentoCadastro):
    instrumento_criado = instrumentos_repository.cadastrar(instrumento)
    return instrumento_criado


@router.delete("/instrumentos/{id}")
def apagar(id):
    instrumento = instrumentos_repository.consultar_por_id(id)
    
    if instrumento is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="instrumento não encontrado")

    instrumentos_repository.apagar(id)
    return {
        "status": "ok"
    }

@router.put("/instrumentos/{id}")
def editar(id , instrumento: InstrumentoEditar):
    instrumento_banco = instrumentos_repository.consultar_por_id(id)

    if instrumento_banco is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Instrumento não encontrado")

    instrumentos_repository.editar(id, instrumento)
    return {
        "status": "ok"
    }