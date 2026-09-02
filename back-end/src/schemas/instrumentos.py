from dataclasses import dataclass

@dataclass
class Instrumentos:
    id: int
    nome: str

@dataclass
class InstrumentoCadastro:
    nome: str

@dataclass
class InstrumentoEditar:
    nome: str