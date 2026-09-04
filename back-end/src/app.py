from fastapi import FastAPI
from pathlib import Path
from fastapi.middleware.cors import CORSMiddleware
import sys

# Permite rodar com `py src/app.py`
# Coloca a raiz do projeto no sys.path
sys.path.insert(
    0,
    str(Path(__file__).resolve().parent.parent)
)

from src.controllers import instrumentos_controller, clientes_controller, professores_controller, cursos_controller, aulas_controller


app = FastAPI(
    title="Sonora API",
    description="API do projeto Sonora",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(instrumentos_controller.router)
app.include_router(clientes_controller.router)
app.include_router(professores_controller.router)
app.include_router(cursos_controller.router)
app.include_router(aulas_controller.router)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "src.app:app",
        host="127.0.0.1",
        port=8000,
        reload=True
    )