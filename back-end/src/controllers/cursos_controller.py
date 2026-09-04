from fastapi import APIRouter, HTTPException, status

from src.repositories import cursos_repository
from src.schemas.cursos import CursoCadastro, CursoEditar

router = APIRouter(
    tags=["Cursos"]
)

@router.get("/cursos")
def consultar_cursos():
    return cursos_repository.consultar_todos()


@router.get("/cursos/{id}")
def consultar_por_id(id:int):
    curso = cursos_repository.consultar_por_id(id)

    if curso is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Curso não encontrado")

    return curso


@router.post("/cursos")
def cadastrar_curso(curso: CursoCadastro):
    return cursos_repository.cadastrar(curso)


@router.delete("/cursos/{id}")
def apagar_curso(id:int):
    curso = cursos_repository.consultar_por_id(id)

    if curso is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Curso não encontrado")

    cursos_repository.apagar(id)
    return {
        "status": "ok"
    }

@router.put("/cursos/{id}")
def editar_curso(id: int , curso: CursoEditar):
    curso_banco = cursos_repository.consultar_por_id(id)

    if curso_banco is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Curso não encontrado")

    cursos_repository.editar(id, curso)
    return {
        "status": "ok"
    }