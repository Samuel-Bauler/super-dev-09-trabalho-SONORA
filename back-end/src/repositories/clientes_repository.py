from src.database.conexao import conectar
from src.schemas.clientes import Cliente, ClienteCreate


def consultar_todos() -> list[Cliente]:
    with conectar() as conexao:
        with conexao.cursor() as cursor:
            cursor.execute("SELECT id, nome, email FROM clientes")
            resultados = cursor.fetchall()
            return [Cliente(id=linha[0], nome=linha[1], email=linha[2]) for linha in resultados]


def consultar_por_id(id: int) -> Cliente | None:
    with conectar() as conexao:
        with conexao.cursor() as cursor:
            cursor.execute(
                "SELECT id, nome, email FROM clientes WHERE id = %s",
                (id,)
            )
            resultado = cursor.fetchone()
            if resultado is None:
                return None
            return Cliente(id=resultado[0], nome=resultado[1], email=resultado[2])


def cadastrar(cliente: ClienteCreate) -> None:
    with conectar() as conexao:
        with conexao.cursor() as cursor:
            cursor.execute(
                "INSERT INTO clientes (nome, email) VALUES (%s, %s)",
                (cliente.nome, cliente.email)
            )
            conexao.commit()


def editar(id: int, cliente: ClienteCreate) -> None:
    with conectar() as conexao:
        with conexao.cursor() as cursor:
            cursor.execute(
                "UPDATE clientes SET nome = %s, email = %s WHERE id = %s",
                (cliente.nome, cliente.email, id)
            )
            conexao.commit()


def apagar(id: int) -> None:
    with conectar() as conexao:
        with conexao.cursor() as cursor:
            cursor.execute("DELETE FROM clientes WHERE id = %s", (id,))
            conexao.commit()