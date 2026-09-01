from src.database.conexao import conectar
from src.schemas.instrumentos import Instrumentos

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