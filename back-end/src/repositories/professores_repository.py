from src.database.conexao import conectar
from src.schemas.professores import Professor, ProfessorCreate


def consultar_todos() -> list[Professor]:
    with conectar() as conexao:
        with conexao.cursor() as cursor:
            cursor.execute("SELECT id, nome, id_instrumento, alunos, status FROM professores")
            resultados = cursor.fetchall()
            return [
                Professor(id=linha[0], nome=linha[1], id_instrumento=linha[2], alunos=linha[3], status=linha[4])
                for linha in resultados
            ]


def consultar_por_id(id: int) -> Professor | None:
    with conectar() as conexao:
        with conexao.cursor() as cursor:
            cursor.execute(
                "SELECT id, nome, id_instrumento, alunos, status FROM professores WHERE id = %s",
                (id,)
            )
            resultado = cursor.fetchone()
            if resultado is None:
                return None
            return Professor(
                id=resultado[0],
                nome=resultado[1],
                id_instrumento=resultado[2],
                alunos=resultado[3],
                status=resultado[4]
            )


def cadastrar(professor: ProfessorCreate) -> None:
    with conectar() as conexao:
        with conexao.cursor() as cursor:
            cursor.execute(
                "INSERT INTO professores (nome, id_instrumento, alunos, status) VALUES (%s, %s, %s, %s)",
                (professor.nome, professor.id_instrumento, professor.alunos, professor.status)
            )
            conexao.commit()


def editar(id: int, professor: ProfessorCreate) -> None:
    with conectar() as conexao:
        with conexao.cursor() as cursor:
            cursor.execute(
                "UPDATE professores SET nome = %s, id_instrumento = %s, alunos = %s, status = %s WHERE id = %s",
                (professor.nome, professor.id_instrumento, professor.alunos, professor.status, id)
            )
            conexao.commit()


def apagar(id: int) -> None:
    with conectar() as conexao:
        with conexao.cursor() as cursor:
            cursor.execute("DELETE FROM professores WHERE id = %s", (id,))
            conexao.commit()