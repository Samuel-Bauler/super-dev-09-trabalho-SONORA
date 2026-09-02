/* =====================================================
   CLIENTES
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const searchInput =
        document.getElementById("client-search");

    const statusFilter =
        document.getElementById("status-filter");

    const courseFilter =
        document.getElementById("course-filter");

    const clientsList =
        document.getElementById("clients-list");

    const emptyState =
        document.getElementById("empty-state");

    const clientsCounter =
        document.getElementById("clients-counter");

    const resultsInfo =
        document.getElementById("results-info");

    const newClientButton =
        document.getElementById("new-client-button");


    /* =====================================================
       MODAL
    ===================================================== */

    const clientModal =
        document.getElementById("client-modal");

    const closeClientModal =
        document.getElementById("close-client-modal");

    const cancelClientModal =
        document.getElementById("cancel-client-modal");

    const clientForm =
        document.getElementById("client-form");

    const clientName =
        document.getElementById("client-name");

    const clientEmail =
        document.getElementById("client-email");


    /* =====================================================
       CLIENTES
    ===================================================== */

    let clients =
        Array.from(
            clientsList.querySelectorAll("tr")
        );


    /* =====================================================
       TOAST
    ===================================================== */

    function showToast(message) {

        const toast =
            document.getElementById("toast");

        if (!toast) {
            return;
        }

        toast.textContent = message;

        toast.classList.add("show");

        clearTimeout(window.sonoraToastTimer);

        window.sonoraToastTimer =
            setTimeout(() => {

                toast.classList.remove("show");

            }, 3000);

    }


    /* =====================================================
       FILTRAR CLIENTES
    ===================================================== */

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


        if (resultsInfo) {

            resultsInfo.textContent =
                `Mostrando ${visibleClients} ${
                    visibleClients === 1
                        ? "cliente"
                        : "clientes"
                }`;

        }

    }


    /* =====================================================
       ABRIR MODAL
    ===================================================== */

    function openClientModal() {

        clientModal.hidden = false;

        document.body.style.overflow = "hidden";

        clientName.focus();

    }


    /* =====================================================
       FECHAR MODAL
    ===================================================== */

    function closeClientModalFunction() {

        clientModal.hidden = true;

        document.body.style.overflow = "";

        clientForm.reset();

    }


    /* =====================================================
       EVENTO — NOVO CLIENTE
    ===================================================== */

    if (newClientButton) {

        newClientButton.addEventListener(
            "click",
            openClientModal
        );

    }


    /* =====================================================
       EVENTO — FECHAR
    ===================================================== */

    closeClientModal.addEventListener(
        "click",
        closeClientModalFunction
    );


    cancelClientModal.addEventListener(
        "click",
        closeClientModalFunction
    );


    /* =====================================================
       FECHAR CLICANDO FORA
    ===================================================== */

    clientModal.addEventListener(
        "click",
        event => {

            if (event.target === clientModal) {

                closeClientModalFunction();

            }

        }
    );


    /* =====================================================
       FECHAR COM ESC
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                !clientModal.hidden
            ) {

                closeClientModalFunction();

            }

        }
    );


    /* =====================================================
       CADASTRAR CLIENTE
    ===================================================== */

    clientForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const nome =
                clientName.value.trim();

            const email =
                clientEmail.value.trim();


            if (!nome || !email) {

                showToast(
                    "Preencha todos os campos."
                );

                return;

            }


            /* =================================================
               CRIA CLIENTE NA TABELA
            ================================================== */

            const initials =
                nome
                    .split(" ")
                    .filter(Boolean)
                    .slice(0, 2)
                    .map(
                        palavra =>
                            palavra[0].toUpperCase()
                    )
                    .join("");


            const row =
                document.createElement("tr");


            row.dataset.name = nome;

            row.dataset.email = email;

            row.dataset.status = "active";

            row.dataset.course = "all";


            row.innerHTML = `

                <td>

                    <div class="client-person">

                        <span class="client-avatar avatar-green">
                            ${initials}
                        </span>

                        <div>

                            <strong>
                                ${nome}
                            </strong>

                            <small>
                                ${email}
                            </small>

                        </div>

                    </div>

                </td>


                <td>

                    <span class="status active-status">

                        <i></i>

                        Ativo

                    </span>

                </td>


                <td>

                    <div class="client-actions">

                        <button
                            type="button"
                            class="client-action"
                            data-action="view"
                            title="Visualizar"
                        >
                            ◉
                        </button>

                        <button
                            type="button"
                            class="client-action"
                            data-action="edit"
                            title="Editar"
                        >
                            ✎
                        </button>

                        <button
                            type="button"
                            class="client-action"
                            data-action="more"
                            title="Mais opções"
                        >
                            ⋮
                        </button>

                    </div>

                </td>

            `;


            clientsList.appendChild(row);


            clients =
                Array.from(
                    clientsList.querySelectorAll("tr")
                );


            closeClientModalFunction();


            filterClients();


            showToast(
                `${nome} cadastrado com sucesso!`
            );

        }
    );


    /* =====================================================
       EVENTOS DOS FILTROS
    ===================================================== */

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
       AÇÕES DOS CLIENTES
    ===================================================== */

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
       INICIALIZAÇÃO
    ===================================================== */

    filterClients();

});