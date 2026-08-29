from fastapi import FastAPI
from pathlib import Path
import sys


# Permite rodar com `py src/app.py`: coloca a raiz do projeto no sys.path
# para que os imports `from src import . ` funcionem corretamente
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

