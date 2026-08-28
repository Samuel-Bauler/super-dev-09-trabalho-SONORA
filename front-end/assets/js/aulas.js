document.addEventListener("DOMContentLoaded", () => {

    const searchInput = document.getElementById("aula-search");
    const aulasList = document.getElementById("aulas-list");
    const emptyState = document.getElementById("aulas-empty");
    const counter = document.getElementById("aulas-counter");
    const newAulaButton = document.getElementById("new-aula-button");

    if (!aulasList) {
        return;
    }

    const aulas = Array.from(
        aulasList.querySelectorAll("tr")
    );


    /* =====================================================
       ATUALIZAR CONTADOR
    ===================================================== */

    function updateCounter(total) {

        if (!counter) {
            return;
        }

        counter.textContent =
            `${total} ${total === 1 ? "aula" : "aulas"}`;
    }


    /* =====================================================
       BUSCA
    ===================================================== */

    function filterAulas() {

        const search =
            searchInput
                ? searchInput.value
                    .trim()
                    .toLowerCase()
                : "";

        let visible = 0;


        aulas.forEach((aula) => {

            const client =
                aula.dataset.client || "";

            const instrument =
                aula.dataset.instrument || "";

            const text =
                `${client} ${instrument}`
                    .toLowerCase();

            const matches =
                text.includes(search);


            aula.style.display =
                matches ? "" : "none";


            if (matches) {
                visible++;
            }

        });


        updateCounter(visible);


        if (emptyState) {

            emptyState.hidden =
                visible !== 0;

        }

    }


    /* =====================================================
       EVENTO DE BUSCA
    ===================================================== */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            filterAulas
        );

    }


    /* =====================================================
       NOVA AULA
    ===================================================== */

    if (newAulaButton) {

        newAulaButton.addEventListener(
            "click",
            () => {

                alert(
                    "Área para cadastrar uma nova aula."
                );

            }
        );

    }


    /* =====================================================
       INICIALIZAÇÃO
    ===================================================== */

    updateCounter(aulas.length);

});