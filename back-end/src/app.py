from fastapi import FastAPI
from pathlib import Path
import sys


# Permite rodar com `py src/app.py`: coloca a raiz do projeto no sys.path
# para que os imports `from src import . ` funcionem corretamente
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from src.controllers import clientes_controller, professores_controller

app = FastAPI(
    title="Sonora API",
    description="Projeto de gestão de aulas de música",
    version="0.1.0"
)

app.include_router(clientes_controller.router)
app.include_router(professores_controller.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("src.app:app", host="127.0.0.1", port=8000, reload=True)