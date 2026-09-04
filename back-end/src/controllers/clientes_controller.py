from fastapi import APIRouter, HTTPException, status
from src.repositories import clientes_repository
from src.schemas.clientes import ClienteCreate

router = 
Router(prefix="/clientes", tags=["Clientes"])


@router.get("/")
def get_clientes():
    return clientes_repository.consultar_todos()


@router.get("/{id}")
def consultar_por_id(id: int):
    cliente = clientes_repository.consultar_por_id(id)

    if cliente is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cliente não encontrado")

    return cliente


@router.post("/")
def cadastrar(cliente: ClienteCreate):
    clientes_repository.cadastrar(cliente)
    return {"status": "ok"}


@router.put("/{id}")
def editar(id: int, cliente: ClienteCreate):
    cliente_banco = clientes_repository.consultar_por_id(id)

    if cliente_banco is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cliente não encontrado")

    clientes_repository.editar(id, cliente)
    return {"status": "ok"}


@router.delete("/{id}")
def apagar(id: int):
    cliente = clientes_repository.consultar_por_id(id)

    if cliente is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cliente não encontrado")

    clientes_repository.apagar(id)
    return {"status": "ok"}
