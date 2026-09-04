from dataclasses import dataclass

@dataclass
class Instrumento:
    id: int
    nome: str

@dataclass
class InstrumentoCadastro:
    nome: str

@dataclass
class InstrumentoEditar:
    nome: str