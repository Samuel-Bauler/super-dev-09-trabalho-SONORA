/* =========================================================
   CLIENTES
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const searchInput = document.getElementById("client-search");
    const statusFilter = document.getElementById("status-filter");
    const courseFilter = document.getElementById("course-filter");

    const clientsList = document.getElementById("clients-list");
    const emptyState = document.getElementById("empty-state");

    const clientsCounter =
        document.getElementById("clients-counter");

    const resultsInfo =
        document.getElementById("results-info");

    const newClientButton =
        document.getElementById("new-client-button");


    /* =====================================================
       CLIENTES
    ====================================================== */

    const clients = Array.from(
        clientsList.querySelectorAll("tr")
    );


    /* =====================================================
       TOAST
    ====================================================== */

    function showToast(message) {

        const toast =
            document.getElementById("toast");

        if (!toast) {
            return;
        }

        toast.textContent = message;

        toast.classList.add("show");

        clearTimeout(window.sonoraToastTimer);

        window.sonoraToastTimer = setTimeout(() => {

            toast.classList.remove("show");

        }, 3000);
    }


    /* =====================================================
       FILTRAR CLIENTES
    ====================================================== */

    function filterClients() {

        const search =
            searchInput.value
                .trim()
                .toLowerCase();

        const status =
            statusFilter.value;

        const course =
            courseFilter.value;

        let visibleClients = 0;


        clients.forEach(client => {

            const name =
                client.dataset.name
                    .toLowerCase();

            const email =
                client.dataset.email
                    .toLowerCase();

            const clientStatus =
                client.dataset.status;

            const clientCourse =
                client.dataset.course;


            const matchesSearch =
                !search ||
                name.includes(search) ||
                email.includes(search);


            const matchesStatus =
                status === "all" ||
                clientStatus === status;


            const matchesCourse =
                course === "all" ||
                clientCourse === course;


            const visible =
                matchesSearch &&
                matchesStatus &&
                matchesCourse;


            client.style.display =
                visible ? "" : "none";


            if (visible) {
                visibleClients++;
            }

        });


        /* =================================================
           ESTADO VAZIO
        ================================================== */

        if (visibleClients === 0) {

            emptyState.hidden = false;

            clientsList.style.display = "none";

        } else {

            emptyState.hidden = true;

            clientsList.style.display = "";

        }


        /* =================================================
           CONTADORES
        ================================================== */

        clientsCounter.textContent =
            `${visibleClients} ${
                visibleClients === 1
                    ? "cliente"
                    : "clientes"
            }`;


        resultsInfo.textContent =
            `Mostrando ${visibleClients} ${
                visibleClients === 1
                    ? "cliente"
                    : "clientes"
            }`;

    }


    /* =====================================================
       EVENTOS DOS FILTROS
    ====================================================== */

    searchInput.addEventListener(
        "input",
        filterClients
    );

    statusFilter.addEventListener(
        "change",
        filterClients
    );

    courseFilter.addEventListener(
        "change",
        filterClients
    );


    /* =====================================================
       NOVO CLIENTE
    ====================================================== */

    if (newClientButton) {

        newClientButton.addEventListener(
            "click",
            () => {

                showToast(
                    "Cadastro de novo cliente em breve."
                );

            }
        );

    }


    /* =====================================================
       AÇÕES DOS CLIENTES
    ====================================================== */

    clientsList.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    ".client-action"
                );


            if (!button) {
                return;
            }


            const row =
                button.closest("tr");


            const name =
                row.dataset.name;

            const action =
                button.dataset.action;


            switch (action) {

                case "view":

                    showToast(
                        `Visualizando ${name}.`
                    );

                    break;


                case "edit":

                    showToast(
                        `Editando ${name}.`
                    );

                    break;


                case "more":

                    showToast(
                        `Mais opções para ${name}.`
                    );

                    break;

            }

        }
    );


    /* =====================================================
       AÇÕES RÁPIDAS
    ====================================================== */

    document
        .querySelectorAll(
            ".client-quick-actions [data-toast]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    showToast(
                        button.dataset.toast
                    );

                }
            );

        });


    /* =====================================================
       PAGINAÇÃO DEMONSTRATIVA
    ====================================================== */

    document
        .querySelectorAll(".pagination button")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    if (
                        button.disabled ||
                        button.classList.contains("current")
                    ) {
                        return;
                    }

                    showToast(
                        "Paginação pronta para integração."
                    );

                }
            );

        });


    /* =====================================================
       INICIALIZAÇÃO
    ====================================================== */

    filterClients();

});