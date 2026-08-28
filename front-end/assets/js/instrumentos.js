document.addEventListener("DOMContentLoaded", () => {

    const searchInput = document.getElementById("instrument-search");
    const categoryButtons = document.querySelectorAll(".category-filter");
    const cards = document.querySelectorAll(".instrument-card");

    const counter = document.getElementById("instrument-counter");
    const emptyState = document.getElementById("instrument-empty");

    const newInstrumentButton =
        document.getElementById("new-instrument-button");

    const loadMoreButton =
        document.getElementById("load-more-instruments");


    let currentCategory = "all";


    /* =====================================================
       FILTRAR INSTRUMENTOS
    ====================================================== */

    function filterInstruments() {

        const searchTerm =
            searchInput.value
                .trim()
                .toLowerCase();

        let visibleCount = 0;


        cards.forEach(card => {

            const name =
                card.dataset.name.toLowerCase();

            const category =
                card.dataset.category.toLowerCase();


            const matchesSearch =
                name.includes(searchTerm);

            const matchesCategory =
                currentCategory === "all" ||
                category === currentCategory;


            const shouldShow =
                matchesSearch &&
                matchesCategory;


            card.style.display =
                shouldShow ? "" : "none";


            if (shouldShow) {
                visibleCount++;
            }

        });


        counter.textContent =
            `${visibleCount} ${
                visibleCount === 1
                    ? "instrumento"
                    : "instrumentos"
            }`;


        emptyState.hidden =
            visibleCount !== 0;

    }


    /* =====================================================
       BUSCA
    ====================================================== */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            filterInstruments
        );

    }


    /* =====================================================
       CATEGORIAS
    ====================================================== */

    categoryButtons.forEach(button => {

        button.addEventListener("click", () => {

            categoryButtons.forEach(item => {
                item.classList.remove("active");
            });


            button.classList.add("active");


            currentCategory =
                button.dataset.category;


            filterInstruments();

        });

    });


    /* =====================================================
       AÇÕES DOS CARDS
    ====================================================== */

    document
        .querySelectorAll(
            ".instrument-action, .instrument-menu"
        )
        .forEach(button => {

            button.addEventListener("click", () => {

                const action =
                    button.dataset.action;

                const card =
                    button.closest(".instrument-card");

                const name =
                    card?.dataset.name || "Instrumento";


                if (action === "view") {

                    alert(
                        `Visualizando detalhes de ${name}.`
                    );

                }


                if (action === "more") {

                    alert(
                        `Mais opções para ${name}.`
                    );

                }

            });

        });


    /* =====================================================
       NOVO INSTRUMENTO
    ====================================================== */

    if (newInstrumentButton) {

        newInstrumentButton.addEventListener(
            "click",
            () => {

                alert(
                    "Abrir formulário para cadastrar novo instrumento."
                );

            }
        );

    }


    /* =====================================================
       CARREGAR MAIS
    ====================================================== */

    if (loadMoreButton) {

        loadMoreButton.addEventListener(
            "click",
            () => {

                alert(
                    "Carregar mais instrumentos..."
                );

            }
        );

    }


    /* =====================================================
       INICIALIZAÇÃO
    ====================================================== */

    filterInstruments();

});