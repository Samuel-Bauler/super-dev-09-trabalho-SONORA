from typing import Optional

from src.database.conexao import conectar
from src.schemas.aulas import Aulas , AulaCadastro, AulaEditar
from src.schemas.cursos import Curso
from src.schemas.clientes import Cliente
from src.schemas.professores import Professor
from src.schemas.instrumentos import Instrumento



def consultar_todos() -> list[Aulas]:
    """Responsável por consultar todas as aulas incluindo professor, cliente e curso."""

    sql = """SELECT
        
        aulas.id,

        professores.id,
        professores.nome,
        professores.id_instrumento,
        professores.alunos,
        professores.status,

        clientes.id,
        clientes.nome,
        clientes.email,

        cursos.id,
        cursos.nome,
        cursos.descricao,
        cursos.id_cliente,
        cursos.id_instrumento,
        cursos.status,

        clientes_curso.id,
        clientes_curso.nome,
        clientes_curso.email,

        instrumentos.id,
        instrumentos.nome,

        aulas.data,
        aulas.hora_inicio,
        aulas.duracao

    FROM aulas

    INNER JOIN professores
        ON aulas.id_professor = professores.id

    INNER JOIN clientes
        ON aulas.id_cliente = clientes.id

    INNER JOIN cursos
        ON aulas.id_curso = cursos.id
        
    INNER JOIN clientes AS clientes_curso
        ON cursos.id_cliente = clientes_curso.id
        
    INNER JOIN instrumentos
        ON cursos.id_instrumento = instrumentos.id
    """

    with conectar() as conexao:
        with conexao.cursor() as cursor:
            cursor.execute(sql)
            registros = cursor.fetchall()

    aulas: list[Aulas] = []

    for registro in registros:

        professor: Professor = Professor(
            id=registro[1],
            nome=registro[2],
            id_instrumento=registro[3],
            alunos=registro[4],
            status=registro[5]
        )
       

        cliente: Cliente = Cliente(
            id=registro[6],
            nome=registro[7],
            email=registro[8]
        )

        cliente_curso: Cliente = Cliente(
            id=registro[15],
            nome=registro[16],
            email=registro[17]
        )


        instrumento: Instrumento = Instrumento(
            id=registro[18],
            nome=registro[19]
        )

        curso: Curso = Curso(
            id=registro[9],
            nome=registro[10],
            descricao=registro[11],
            cliente=cliente_curso,
            instrumento=instrumento,
            status=bool(registro[14])
        )

    
        aula: Aulas = Aulas(
            id=registro[0],
            professor=professor,
            cliente=cliente,
            curso=curso,
            data=registro[20],
            hora_inicio=registro[21],
            duracao=registro[22]
        )

        aulas.append(aula)

    return aulas


def consultar_por_id(id: int) -> Optional[Aulas]:
    """Responsável por consultar uma aula pelo ID."""

    sql = """SELECT
        aulas.id,
        professores.id,
        professores.nome,
        professores.id_instrumento,
        professores.alunos,
        professores.status,
        clientes.id,
        clientes.nome,
        clientes.email,
        cursos.id,
        cursos.nome,
        cursos.descricao,
        cursos.status,
        clientes_curso.id,
        clientes_curso.nome,
        clientes_curso.email,
        instrumentos.id,
        instrumentos.nome,
        aulas.data,
        aulas.hora_inicio,
        aulas.duracao
    FROM aulas
    INNER JOIN professores
        ON aulas.id_professor = professores.id
    INNER JOIN clientes
        ON aulas.id_cliente = clientes.id
    INNER JOIN cursos
        ON aulas.id_curso = cursos.id
    INNER JOIN clientes AS clientes_curso
        ON cursos.id_cliente = clientes_curso.id
    INNER JOIN instrumentos
        ON cursos.id_instrumento = instrumentos.id
    WHERE aulas.id = %s
    """

    with conectar() as conexao:
        with conexao.cursor() as cursor:
            cursor.execute(sql, (id,))
            registro = cursor.fetchone()

    if registro is None:
        return None

    professor = Professor(
        id=registro[1],
        nome=registro[2],
        id_instrumento=registro[3],
        alunos=registro[4],
        status=registro[5]
    )

    cliente = Cliente(
        id=registro[6],
        nome=registro[7],
        email=registro[8]
    )

    cliente_curso = Cliente(
        id=registro[13],
        nome=registro[14],
        email=registro[15]
    )

    instrumento = Instrumento(
        id=registro[16],
        nome=registro[17]
    )

    curso = Curso(
        id=registro[9],
        nome=registro[10],
        descricao=registro[11],
        cliente=cliente_curso,
        instrumento=instrumento,
        status=bool(registro[12])
    )

    aula = Aulas(
        id=registro[0],
        professor=professor,
        cliente=cliente,
        curso=curso,
        data=registro[18],
        hora_inicio=registro[19],
        duracao=registro[20]
    )

    return aula


def cadastrar(aula: AulaCadastro):

    with conectar() as conexao:
        with conexao.cursor() as cursor:

            cursor.execute(
                """
                SELECT
                    id,
                    nome,
                    id_instrumento,
                    alunos,
                    status
                FROM professores
                WHERE nome = %s
                """,
                (aula.professor,)
            )

            professor = cursor.fetchone()

            if professor is None:
                raise ValueError("Professor não encontrado")

            cursor.execute(
                """
                SELECT
                    id,
                    nome,
                    email
                FROM clientes
                WHERE nome = %s
                """,
                (aula.cliente,)
            )

            cliente = cursor.fetchone()

            if cliente is None:
                raise ValueError("Cliente não encontrado")

            cursor.execute(
                """
                SELECT
                    cursos.id,
                    cursos.nome,
                    cursos.descricao,
                    cursos.status,
                    cursos.id_cliente,
                    cursos.id_instrumento,
                    instrumentos.id,
                    instrumentos.nome,
                    clientes.id,
                    clientes.nome,
                    clientes.email
                FROM cursos
                INNER JOIN instrumentos
                    ON cursos.id_instrumento = instrumentos.id
                INNER JOIN clientes
                    ON cursos.id_cliente = clientes.id
                WHERE cursos.nome = %s
                """,
                (aula.curso,)
            )

            curso = cursor.fetchone()

            if curso is None:
                raise ValueError("Curso não encontrado")

            cursor.execute(
                """
                INSERT INTO aulas
                (id_professor, id_cliente, id_curso, data, hora_inicio, duracao)
                VALUES (%s, %s, %s, %s, %s, %s)
                """,
                (
                    professor[0],
                    cliente[0],
                    curso[0],
                    aula.data,
                    aula.hora_inicio,
                    aula.duracao
                )
            )

            novo_id = cursor.lastrowid

            conexao.commit()

    professor_obj = Professor(
        id=professor[0],
        nome=professor[1],
        id_instrumento=professor[2],
        alunos=professor[3],
        status=professor[4]
    )

    cliente_obj = Cliente(
        id=cliente[0],
        nome=cliente[1],
        email=cliente[2]
    )

    instrumento_obj = Instrumento(
        id=curso[6],
        nome=curso[7]
    )

    cliente_curso = Cliente(
        id=curso[8],
        nome=curso[9],
        email=curso[10]
    )

    curso_obj = Curso(
        id=curso[0],
        nome=curso[1],
        descricao=curso[2],
        cliente=cliente_curso,
        instrumento=instrumento_obj,
        status=bool(curso[3])
    )

    return Aulas(
        id=novo_id,
        professor=professor_obj,
        cliente=cliente_obj,
        curso=curso_obj,
        data=aula.data,
        hora_inicio=aula.hora_inicio,
        duracao=aula.duracao
    )

from src.database.conexao import conectar


def apagar(id: int):
    """Responsável por apagar uma aula pelo ID."""

    sql = """DELETE FROM aulas
    WHERE id = %s
    """

    with conectar() as conexao:
        with conexao.cursor() as cursor:
            cursor.execute(sql, (id,))
            conexao.commit()


def editar(id: int, aula: AulaEditar) -> Aulas:
    with conectar() as conexao:
        with conexao.cursor() as cursor:

            cursor.execute(
                """
                SELECT
                    id,
                    nome,
                    id_instrumento,
                    alunos,
                    status
                FROM professores
                WHERE nome = %s
                """,
                (aula.professor,)
            )

            professor = cursor.fetchone()

            if professor is None:
                raise ValueError("Professor não encontrado")

            cursor.execute(
                """
                SELECT
                    id,
                    nome,
                    email
                FROM clientes
                WHERE nome = %s
                """,
                (aula.cliente,)
            )

            cliente = cursor.fetchone()

            if cliente is None:
                raise ValueError("Cliente não encontrado")

            cursor.execute(
                """
                SELECT
                    cursos.id,
                    cursos.nome,
                    cursos.descricao,
                    cursos.status,
                    instrumentos.id,
                    instrumentos.nome,
                    clientes.id,
                    clientes.nome,
                    clientes.email
                FROM cursos
                INNER JOIN instrumentos
                    ON cursos.id_instrumento = instrumentos.id
                INNER JOIN clientes
                    ON cursos.id_cliente = clientes.id
                WHERE cursos.nome = %s
                """,
                (aula.curso,)
            )

            curso = cursor.fetchone()

            if curso is None:
                raise ValueError("Curso não encontrado")

            cursor.execute(
                """
                UPDATE aulas
                SET
                    id_professor = %s,
                    id_cliente = %s,
                    id_curso = %s,
                    data = %s,
                    hora_inicio = %s,
                    duracao = %s
                WHERE id = %s
                """,
                (
                    professor[0],
                    cliente[0],
                    curso[0],
                    aula.data,
                    aula.hora_inicio,
                    aula.duracao,
                    id
                )
            )

            if cursor.rowcount == 0:
                raise ValueError("Aula não encontrada")

            conexao.commit()

    professor_obj = Professor(
        id=professor[0],
        nome=professor[1],
        id_instrumento=professor[2],
        alunos=professor[3],
        status=professor[4]
    )

    cliente_obj = Cliente(
        id=cliente[0],
        nome=cliente[1],
        email=cliente[2]
    )

    instrumento_obj = Instrumento(
        id=curso[4],
        nome=curso[5]
    )

    cliente_curso = Cliente(
        id=curso[6],
        nome=curso[7],
        email=curso[8]
    )

    curso_obj = Curso(
        id=curso[0],
        nome=curso[1],
        descricao=curso[2],
        cliente=cliente_curso,
        instrumento=instrumento_obj,
        status=bool(curso[3])
    )

    return Aulas(
        id=id,
        professor=professor_obj,
        cliente=cliente_obj,
        curso=curso_obj,
        data=aula.data,
        hora_inicio=aula.hora_inicio,
        duracao=aula.duracao
    )