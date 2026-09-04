

from src.database.conexao import conectar
from src.schemas.cursos import Curso
from src.schemas.clientes import Cliente
from src.schemas.instrumentos import Instrumentos

def consultar_todos() -> list[Curso]:
    sql = """SELECT
    cursos.id,
    cursos.nome,
    cursos.descricao,
    cursos.id_cliente,
    clientes.nome,
    clientes.email,
    cursos.id_instrumento,
    instrumentos.nome,
    cursos.status
FROM cursos
INNER JOIN clientes ON (cursos.id_cliente = clientes.id)
INNER JOIN instrumentos ON (cursos.id_instrumento = instrumentos.id);"""
    with conectar() as conexao:
        with conexao.cursor() as cursor:
            cursor.execute(sql)
            registros = cursor.fetchall()

    cursos = []
    for registro in registros:
        cliente = Cliente(
            id=registro[3],
            nome=registro[4],
            email=registro[5],
        )

        instrumento = Instrumentos(
            id=registro[6],
            nome=registro[7]
        )

        status = False
        if registro[8] == 1:
            status = True

        curso = Curso(
            id=registro[0],
            nome=registro[1],
            descricao=registro[2],
            cliente=cliente,
            instrumento=instrumento,
            status=status
        )

        cursos.append(curso)
    return cursos