from src.schemas.clientes import Cliente

def consultar_todos() -> list[Cliente]:
    with conectar() as conexao:
        with conexao.cursor() as cursor:
            cursor.execute("SELECT id, nome from ")
