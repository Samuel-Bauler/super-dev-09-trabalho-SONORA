document.addEventListener("DOMContentLoaded", async () => {
    const searchInput = document.getElementById("instrument-search");
    const counter = document.getElementById("instrument-counter");
    const emptyState = document.getElementById("instrument-empty");
    const table = document.getElementById("instruments-table");
    const newInstrumentButton = document.getElementById("new-instrument-button");

    let instrumentos = [];

    async function loadInstruments() {
        try {
            const response = await fetch("http://localhost:8000/instrumentos");

            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }

            instrumentos = await response.json();

            console.log("Instrumentos recebidos:", instrumentos);

            renderInstruments(instrumentos);
        } catch (error) {
            console.error("Erro ao conectar com o backend:", error);
        }
    }

    function renderInstruments(lista) {
        table.innerHTML = "";

        lista.forEach(instrumento => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${instrumento.id}</td>
                <td>${instrumento.nome}</td>
                <td>
                    <button
                        class="instrument-action"
                        data-action="view"
                        data-id="${instrumento.id}"
                    >
                        Ver detalhes
                    </button>
                </td>
            `;

            table.appendChild(row);
        });

        counter.textContent = `${lista.length} ${
            lista.length === 1 ? "instrumento" : "instrumentos"
        }`;

        emptyState.hidden = lista.length !== 0;
    }

    if (searchInput) {
        searchInput.addEventListener("input", () => {
            const searchTerm = searchInput.value
                .trim()
                .toLowerCase();

            const filtrados = instrumentos.filter(instrumento =>
                instrumento.nome.toLowerCase().includes(searchTerm)
            );

            renderInstruments(filtrados);
        });
    }

    if (newInstrumentButton) {
        newInstrumentButton.addEventListener("click", () => {
            alert("Abrir formulário para cadastrar novo instrumento.");
        });
    }

    await loadInstruments();
});