from typing import Optional

from src.database.conexao import conectar
from src.schemas.instrumentos import Instrumentos, InstrumentoCadastro, InstrumentoEditar

def consultar_todos() -> list[Instrumentos]:
    with conectar() as conexao:
        with conexao.cursor() as cursor:
            cursor.execute("SELECT id, nome FROM instrumentos")
            registros = cursor.fetchall()

    instrumentos = []

    for registro in registros:
        instrumento = Instrumentos(
            id=registro[0],
            nome=registro[1]
        )
        instrumentos.append(instrumento)

    return instrumentos

def cadastrar(instrumento: InstrumentoCadastro):
    sql = "INSERT INTO instrumentos (nome) VALUES (%s)"
    with conectar() as conexao:
        with conexao.cursor() as cursor:
            cursor.execute(sql, (instrumento.nome,))

            novo_id = cursor.lastrowid

            conexao.commit()

    return Instrumentos(id=novo_id,nome=instrumento.nome )


def consultar_por_id(id) -> Optional[Instrumentos]:
    with conectar() as conexao:
        with conexao.cursor() as cursor:
            cursor.execute(
                "SELECT id, nome FROM instrumentos WHERE id = %s ",
                (id,)
            )

            registro = cursor.fetchone()

    if registro is None:
        return None


    instrumento = Instrumentos(
        id=registro[0],
        nome=registro[1]
    )

    return instrumento

def apagar(id):
    sql = "DELETE FROM instrumentos WHERE id = %s"
    with conectar() as conexao:
        with conexao.cursor() as cursor:
            cursor.execute(sql, (id,))
            conexao.commit()

def editar(id, instrumento: InstrumentoEditar ):
    sql = "UPDATE instrumentos SET nome=%s WHERE id = %s"
    with conectar() as conexao:
        with conexao.cursor() as cursor:
            cursor.execute(sql, (
                instrumento.nome,
                id,
            ))
            conexao.commit()