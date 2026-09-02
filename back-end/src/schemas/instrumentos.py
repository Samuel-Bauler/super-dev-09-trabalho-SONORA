from dataclasses import dataclass

@dataclass
class Instrumentos:
    id: int
    nome: str

class InstrumentoCadastro:
    nome: str