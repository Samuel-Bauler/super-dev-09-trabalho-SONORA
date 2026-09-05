from typing import Optional

from src.database.conexao import conectar
from src.schemas.cursos import Curso, CursoCadastro, CursoEditar
from src.schemas.clientes import Cliente
from src.schemas.instrumentos import Instrumento

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

        instrumento = Instrumento(
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


def cadastrar(curso: CursoCadastro) -> CursoCadastro:
    sql = """
    INSERT INTO cursos
        (nome, descricao, id_cliente, id_instrumento, status)
    VALUES (%s, %s, %s, %s, %s)
    """

    with conectar() as conexao: 
        with conexao.cursor() as cursor:

            cursor.execute(
                """
                SELECT id, nome, email
                FROM clientes
                WHERE nome = %s AND email = %s
                """,
                (curso.nome_cliente, curso.email_cliente)
            )

            cliente = cursor.fetchone()

            if not cliente:
                raise ValueError("Nome e email não correspondem ao mesmo cliente")

            # ID do cliente encontrado
            id_cliente = cliente[0]

            # Cadastra o curso
            cursor.execute(sql, (
                curso.nome,
                curso.descricao,
                id_cliente,
                curso.id_instrumento,
                curso.status
            ))

            novo_id = cursor.lastrowid

            cursor.execute(
                """
                SELECT
                    clientes.id,
                    clientes.nome,
                    clientes.email,
                    instrumentos.id,
                    instrumentos.nome
                FROM cursos
                INNER JOIN clientes
                    ON cursos.id_cliente = clientes.id
                INNER JOIN instrumentos
                    ON cursos.id_instrumento = instrumentos.id
                WHERE cursos.id = %s
                """,
                (novo_id,)
            )

            registro = cursor.fetchone()

            conexao.commit()

    cliente = Cliente(
        id=registro[0],
        nome=registro[1],
        email=registro[2]
    )

    instrumento = Instrumento(
        id=registro[3],
        nome=registro[4]
    )

    return Curso(
        id=novo_id,
        nome=curso.nome,
        descricao=curso.descricao,
        cliente=cliente,
        instrumento=instrumento,
        status=curso.status
    )


def editar(id_editar: int, curso: CursoEditar):

    if curso.status is None:
        sql = """
            UPDATE cursos
            SET
                nome = %s,
                descricao = %s,
                id_cliente = %s,
                id_instrumento = %s
            WHERE id = %s
        """

        parametros = (
            curso.nome,
            curso.descricao,
            curso.id_cliente,
            curso.id_instrumento,
            id_editar
        )

    else:
        sql = """
            UPDATE cursos
            SET
                nome = %s,
                descricao = %s,
                id_cliente = %s,
                id_instrumento = %s,
                status = %s
            WHERE id = %s
        """

        parametros = (
            curso.nome,
            curso.descricao,
            curso.id_cliente,
            curso.id_instrumento,
            curso.status,
            id_editar
        )

    with conectar() as conexao:
        with conexao.cursor() as cursor:

            cursor.execute(sql, parametros)

            cursor.execute(
                """
                SELECT
                    cursos.id,
                    cursos.nome,
                    cursos.descricao,
                    clientes.id,
                    clientes.nome,
                    clientes.email,
                    instrumentos.id,
                    instrumentos.nome,
                    cursos.status
                FROM cursos
                INNER JOIN clientes
                    ON cursos.id_cliente = clientes.id
                INNER JOIN instrumentos
                    ON cursos.id_instrumento = instrumentos.id
                WHERE cursos.id = %s
                """,
                (id_editar,)
            )

            registro = cursor.fetchone()

            conexao.commit()

    if registro is None:
        return None

    cliente = Cliente(
        id=registro[3],
        nome=registro[4],
        email=registro[5]
    )

    instrumento = Instrumento(
        id=registro[6],
        nome=registro[7]
    )

    return Curso(
        id=registro[0],
        nome=registro[1],
        descricao=registro[2],
        cliente=cliente,
        instrumento=instrumento,
        status=registro[8]
    )


def apagar(id: int):
    sql = "UPDATE cursos SET status = 0 WHERE id = %s " 
    with conectar() as conexao:
        with conexao.cursor() as cursor:
            cursor.execute(sql, (id,))
            conexao.commit()


def consultar_por_id(id: int) -> Optional[Curso]:
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
INNER JOIN instrumentos ON (cursos.id_instrumento = instrumentos.id)
WHERE cursos.id = %s;"""

    with conectar() as conexao:
        with conexao.cursor() as cursor:
            cursor.execute(sql, (id,))
            registro = cursor.fetchone()

    if registro is None:
        return None
    

    cliente = Cliente(
        id=registro[3],
        nome=registro[4],
        email=registro[5],
    )
    
    instrumento = Instrumento(
        id=registro[6],
        nome=registro[7]
    )

    curso: Curso = Curso(
        id=registro[0],
        nome=registro[1],
        descricao=registro[2],
        cliente=cliente,
        instrumento=instrumento,
        status=registro[8]
    )

    return curso
    