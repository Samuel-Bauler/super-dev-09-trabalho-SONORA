document.addEventListener("DOMContentLoaded", () => {

    // =====================================================
    // CONFIGURAÇÃO DA API
    // =====================================================

    const API_URL = "http://localhost:8000";


    // =====================================================
    // ELEMENTOS DA PÁGINA
    // =====================================================

    const searchInput = document.getElementById("client-search");

    const clientsList = document.getElementById("clients-list");

    const emptyState = document.getElementById("empty-state");

    const clientsCounter = document.getElementById("clients-counter");

    const resultsInfo = document.getElementById("results-info");

    const newClientButton =
        document.getElementById("new-client-button");

    const emptyNewClient =
        document.getElementById("empty-new-client");

    const refreshButton =
        document.getElementById("refresh-clients");


    // =====================================================
    // MODAL NOVO / EDITAR
    // =====================================================

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

    const clientModalTitle =
        document.getElementById("client-modal-title");

    const clientModalDescription =
        document.getElementById("client-modal-description");

    const submitClient =
        document.getElementById("submit-client");

    const modalError =
        document.getElementById("modal-error");


    // =====================================================
    // MODAL EXCLUSÃO
    // =====================================================

    const deleteModal =
        document.getElementById("delete-modal");

    const deleteClientName =
        document.getElementById("delete-client-name");

    const deleteError =
        document.getElementById("delete-error");

    const cancelDelete =
        document.getElementById("cancel-delete");

    const confirmDelete =
        document.getElementById("confirm-delete");


    // =====================================================
    // DADOS
    // =====================================================

    let clientes = [];

    let clienteEditando = null;

    let clienteApagando = null;


    // =====================================================
    // TOAST
    // =====================================================

    function showToast(message, type = "success") {

        const toast =
            document.getElementById("toast");

        if (!toast) {
            return;
        }

        toast.textContent = message;

        toast.classList.remove(
            "show",
            "success",
            "error"
        );

        toast.classList.add(
            "show",
            type
        );

        clearTimeout(
            window.sonoraToastTimer
        );

        window.sonoraToastTimer =
            setTimeout(() => {

                toast.classList.remove("show");

            }, 3500);
    }


    // =====================================================
    // ESCAPAR HTML
    // =====================================================

    function escapeHtml(value) {

        const div =
            document.createElement("div");

        div.textContent =
            value ?? "";

        return div.innerHTML;
    }


    // =====================================================
    // INICIAIS
    // =====================================================

    function getInitials(nome) {

        return String(nome)
            .trim()
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map(palavra =>
                palavra.charAt(0).toUpperCase()
            )
            .join("");
    }


    // =====================================================
    // 1. CONSULTAR TODOS OS CLIENTES
    // GET /clientes
    // =====================================================

    async function loadClients() {

        try {

            clientsCounter.textContent =
                "Carregando...";

            resultsInfo.textContent =
                "Carregando clientes...";

            console.log(
                "Buscando clientes..."
            );


            const response =
                await fetch(
                    `${API_URL}/clientes`
                );


            console.log(
                "Status da API:",
                response.status
            );


            if (!response.ok) {

                let message =
                    `Erro HTTP: ${response.status}`;

                try {

                    const data =
                        await response.json();

                    if (data.detail) {
                        message = data.detail;
                    }

                } catch {
                    // resposta sem JSON
                }

                throw new Error(message);
            }


            const data =
                await response.json();


            console.log(
                "Clientes recebidos:",
                data
            );


            clientes =
                Array.isArray(data)
                    ? data
                    : [];


            renderClients(clientes);

        } catch (error) {

            console.error(
                "Erro ao carregar clientes:",
                error
            );


            clientsList.innerHTML = "";

            clientsCounter.textContent =
                "Erro ao carregar";

            resultsInfo.textContent =
                "Não foi possível carregar os clientes.";

            emptyState.hidden = false;


            const title =
                emptyState.querySelector("h3");

            const text =
                emptyState.querySelector("p");


            if (title) {

                title.textContent =
                    "Erro ao carregar clientes";
            }


            if (text) {

                text.textContent =
                    "Verifique se o backend está funcionando e tente novamente.";
            }


            showToast(
                "Não foi possível carregar os clientes.",
                "error"
            );
        }
    }


    // =====================================================
    // RENDERIZAR CLIENTES
    // =====================================================

    function renderClients(lista) {

        clientsList.innerHTML = "";


        if (!lista.length) {

            clientsList.style.display =
                "none";

            emptyState.hidden =
                false;

        } else {

            clientsList.style.display =
                "";

            emptyState.hidden =
                true;
        }


        lista.forEach(cliente => {

            const row =
                document.createElement("tr");


            const id =
                cliente.id;

            const nome =
                cliente.nome ?? "";

            const email =
                cliente.email ?? "";


            row.dataset.id =
                id;


            row.innerHTML = `

                <td>

                    <span class="client-id">
                        #${escapeHtml(String(id))}
                    </span>

                </td>


                <td>

                    <div class="client-person">

                        <span class="client-avatar">
                            ${escapeHtml(
                                getInitials(nome)
                            )}
                        </span>

                        <div>

                            <strong>
                                ${escapeHtml(nome)}
                            </strong>

                        </div>

                    </div>

                </td>


                <td>

                    <span class="client-email">
                        ${escapeHtml(email)}
                    </span>

                </td>


                <td>

                    <div class="client-actions">

                        <!-- EDITAR -->

                        <button
                            type="button"
                            class="client-action edit"
                            data-action="edit"
                            data-id="${escapeHtml(String(id))}"
                            title="Editar cliente"
                            aria-label="Editar cliente"
                        >

                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >

                                <path d="M12 20h9"></path>

                                <path
                                    d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z"
                                ></path>

                            </svg>

                        </button>


                        <!-- EXCLUIR -->

                        <button
                            type="button"
                            class="client-action delete"
                            data-action="delete"
                            data-id="${escapeHtml(String(id))}"
                            title="Excluir cliente"
                            aria-label="Excluir cliente"
                        >

                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >

                                <polyline
                                    points="3 6 5 6 21 6"
                                ></polyline>

                                <path
                                    d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"
                                ></path>

                                <path d="M10 11v6"></path>

                                <path d="M14 11v6"></path>

                                <path
                                    d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"
                                ></path>

                            </svg>

                        </button>

                    </div>

                </td>

            `;


            clientsList.appendChild(row);

        });


        updateCounters(lista.length);
    }


    // =====================================================
    // CONTADORES
    // =====================================================

    function updateCounters(total) {

        const texto =
            total === 1
                ? "cliente"
                : "clientes";


        clientsCounter.textContent =
            `${total} ${texto}`;


        resultsInfo.textContent =
            `Mostrando ${total} ${texto}`;
    }


    // =====================================================
    // BUSCAR CLIENTES
    // =====================================================

    function filterClients() {

        const search =
            searchInput.value
                .trim()
                .toLowerCase();


        const filtered =
            clientes.filter(cliente => {

                const nome =
                    String(
                        cliente.nome ?? ""
                    ).toLowerCase();


                const email =
                    String(
                        cliente.email ?? ""
                    ).toLowerCase();


                return (
                    nome.includes(search) ||
                    email.includes(search)
                );
            });


        renderClients(filtered);
    }


    // =====================================================
    // ABRIR MODAL — NOVO CLIENTE
    // =====================================================

    function openCreateModal() {

        clienteEditando = null;


        clientModalTitle.textContent =
            "Novo cliente";


        clientModalDescription.textContent =
            "Cadastre um novo aluno na Sonora.";


        submitClient.textContent =
            "Cadastrar cliente";


        clientForm.reset();

        hideModalError();


        clientModal.hidden =
            false;


        document.body.style.overflow =
            "hidden";


        setTimeout(() => {

            clientName.focus();

        }, 50);
    }


    // =====================================================
    // ABRIR MODAL — EDITAR CLIENTE
    // =====================================================

    function openEditModal(id) {

        const cliente =
            clientes.find(
                item =>
                    String(item.id) ===
                    String(id)
            );


        if (!cliente) {

            showToast(
                "Cliente não encontrado.",
                "error"
            );

            return;
        }


        clienteEditando =
            cliente;


        clientModalTitle.textContent =
            "Editar cliente";


        clientModalDescription.textContent =
            "Altere os dados do cliente e salve as alterações.";


        submitClient.textContent =
            "Salvar alterações";


        clientName.value =
            cliente.nome ?? "";


        clientEmail.value =
            cliente.email ?? "";


        hideModalError();


        clientModal.hidden =
            false;


        document.body.style.overflow =
            "hidden";


        setTimeout(() => {

            clientName.focus();

        }, 50);
    }


    // =====================================================
    // FECHAR MODAL CLIENTE
    // =====================================================

    function closeClientModalFunction() {

        clientModal.hidden =
            true;


        document.body.style.overflow =
            "";


        clienteEditando =
            null;


        clientForm.reset();

        hideModalError();
    }


    // =====================================================
    // ERROS DO MODAL
    // =====================================================

    function hideModalError() {

        if (!modalError) {
            return;
        }

        modalError.hidden =
            true;

        modalError.textContent =
            "";
    }


    function showModalError(message) {

        if (!modalError) {
            return;
        }

        modalError.textContent =
            message;

        modalError.hidden =
            false;
    }


    // =====================================================
    // BOTÃO NOVO CLIENTE
    // =====================================================

    if (newClientButton) {

        newClientButton.addEventListener(
            "click",
            openCreateModal
        );
    }


    if (emptyNewClient) {

        emptyNewClient.addEventListener(
            "click",
            openCreateModal
        );
    }


    // =====================================================
    // FECHAR MODAL
    // =====================================================

    if (closeClientModal) {

        closeClientModal.addEventListener(
            "click",
            closeClientModalFunction
        );
    }


    if (cancelClientModal) {

        cancelClientModal.addEventListener(
            "click",
            closeClientModalFunction
        );
    }


    if (clientModal) {

        clientModal.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    clientModal
                ) {

                    closeClientModalFunction();
                }
            }
        );
    }


    // =====================================================
    // 2. CADASTRAR / EDITAR
    //
    // POST /clientes
    // PUT  /clientes/{id}
    // =====================================================

    if (clientForm) {

        clientForm.addEventListener(
            "submit",
            async event => {

                event.preventDefault();


                const nome =
                    clientName.value.trim();


                const email =
                    clientEmail.value.trim();


                // -----------------------------
                // VALIDAÇÕES
                // -----------------------------

                if (!nome) {

                    showModalError(
                        "Digite o nome do cliente."
                    );

                    clientName.focus();

                    return;
                }


                if (!email) {

                    showModalError(
                        "Digite o e-mail do cliente."
                    );

                    clientEmail.focus();

                    return;
                }


                try {

                    submitClient.disabled =
                        true;


                    // Guardamos isso antes de fechar
                    // o modal porque fechar o modal
                    // coloca clienteEditando = null.

                    const editando =
                        Boolean(clienteEditando);


                    let response;


                    // =================================================
                    // EDITAR
                    // PUT /clientes/{id}
                    // =================================================

                    if (editando) {

                        submitClient.textContent =
                            "Salvando...";


                        console.log(
                            "Editando cliente:",
                            clienteEditando.id
                        );


                        response =
                            await fetch(
                                `${API_URL}/clientes/${clienteEditando.id}`,
                                {
                                    method: "PUT",

                                    headers: {
                                        "Content-Type":
                                            "application/json"
                                    },

                                    body:
                                        JSON.stringify({
                                            nome: nome,
                                            email: email
                                        })
                                }
                            );

                    }


                    // =================================================
                    // CADASTRAR
                    // POST /clientes
                    // =================================================

                    else {

                        submitClient.textContent =
                            "Cadastrando...";


                        console.log(
                            "Cadastrando cliente..."
                        );


                        response =
                            await fetch(
                                `${API_URL}/clientes`,
                                {
                                    method: "POST",

                                    headers: {
                                        "Content-Type":
                                            "application/json"
                                    },

                                    body:
                                        JSON.stringify({
                                            nome: nome,
                                            email: email
                                        })
                                }
                            );
                    }


                    // =================================================
                    // LER RESPOSTA
                    // =================================================

                    let data = null;


                    try {

                        data =
                            await response.json();

                    } catch {

                        data = null;
                    }


                    // =================================================
                    // VERIFICAR ERRO
                    // =================================================

                    if (!response.ok) {

                        throw new Error(
                            data?.detail ||
                            `Erro HTTP: ${response.status}`
                        );
                    }


                    // =================================================
                    // FECHAR MODAL
                    // =================================================

                    closeClientModalFunction();


                    // =================================================
                    // CONSULTAR NOVAMENTE
                    // =================================================

                    await loadClients();


                    // =================================================
                    // MENSAGEM
                    // =================================================

                    showToast(
                        editando
                            ? "Cliente atualizado com sucesso!"
                            : "Cliente cadastrado com sucesso!",
                        "success"
                    );


                } catch (error) {

                    console.error(
                        "Erro ao salvar cliente:",
                        error
                    );


                    showModalError(
                        error.message ||
                        "Não foi possível salvar o cliente."
                    );


                } finally {

                    submitClient.disabled =
                        false;

                    submitClient.textContent =
                        clienteEditando
                            ? "Salvar alterações"
                            : "Cadastrar cliente";
                }

            }
        );
    }


    // =====================================================
    // ABRIR MODAL DE EXCLUSÃO
    // =====================================================

    function openDeleteModal(id) {

        const cliente =
            clientes.find(
                item =>
                    String(item.id) ===
                    String(id)
            );


        if (!cliente) {

            showToast(
                "Cliente não encontrado.",
                "error"
            );

            return;
        }


        clienteApagando =
            cliente;


        deleteClientName.textContent =
            cliente.nome;


        hideDeleteError();


        deleteModal.hidden =
            false;


        document.body.style.overflow =
            "hidden";
    }


    // =====================================================
    // FECHAR MODAL EXCLUSÃO
    // =====================================================

    function closeDeleteModal() {

        deleteModal.hidden =
            true;


        document.body.style.overflow =
            "";


        clienteApagando =
            null;


        hideDeleteError();
    }


    // =====================================================
    // ERRO DA EXCLUSÃO
    // =====================================================

    function hideDeleteError() {

        if (!deleteError) {
            return;
        }

        deleteError.hidden =
            true;

        deleteError.textContent =
            "";
    }


    function showDeleteError(message) {

        if (!deleteError) {
            return;
        }

        deleteError.textContent =
            message;

        deleteError.hidden =
            false;
    }


    // =====================================================
    // CANCELAR EXCLUSÃO
    // =====================================================

    if (cancelDelete) {

        cancelDelete.addEventListener(
            "click",
            closeDeleteModal
        );
    }


    if (deleteModal) {

        deleteModal.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    deleteModal
                ) {

                    closeDeleteModal();
                }
            }
        );
    }


    // =====================================================
    // 3. APAGAR CLIENTE
    // DELETE /clientes/{id}
    // =====================================================

    if (confirmDelete) {

        confirmDelete.addEventListener(
            "click",
            async () => {

                if (!clienteApagando) {
                    return;
                }


                const id =
                    clienteApagando.id;


                try {

                    confirmDelete.disabled =
                        true;


                    confirmDelete.textContent =
                        "Excluindo...";


                    console.log(
                        "Excluindo cliente:",
                        id
                    );


                    const response =
                        await fetch(
                            `${API_URL}/clientes/${id}`,
                            {
                                method: "DELETE"
                            }
                        );


                    // =================================================
                    // LER RESPOSTA
                    // =================================================

                    let data = null;


                    try {

                        data =
                            await response.json();

                    } catch {

                        data = null;
                    }


                    // =================================================
                    // VERIFICAR ERRO
                    // =================================================

                    if (!response.ok) {

                        let message =
                            data?.detail ||
                            `Erro HTTP: ${response.status}`;


                        // Erro comum de FOREIGN KEY

                        if (
                            message.includes("1451") ||
                            message
                                .toLowerCase()
                                .includes("foreign key") ||
                            message
                                .toLowerCase()
                                .includes("cannot delete")
                        ) {

                            message =
                                "Não é possível excluir este cliente porque ele está vinculado a outros registros, como aulas ou cursos.";
                        }


                        throw new Error(message);
                    }


                    // =================================================
                    // FECHAR MODAL
                    // =================================================

                    closeDeleteModal();


                    // =================================================
                    // ATUALIZAR LISTA
                    // =================================================

                    await loadClients();


                    // =================================================
                    // MENSAGEM
                    // =================================================

                    showToast(
                        "Cliente excluído com sucesso!",
                        "success"
                    );


                } catch (error) {

                    console.error(
                        "Erro ao apagar cliente:",
                        error
                    );


                    showDeleteError(
                        error.message ||
                        "Não foi possível excluir o cliente."
                    );


                } finally {

                    confirmDelete.disabled =
                        false;

                    confirmDelete.textContent =
                        "Excluir cliente";
                }

            }
        );
    }


    // =====================================================
    // EVENTOS DA TABELA
    // =====================================================

    if (clientsList) {

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


                const id =
                    button.dataset.id;


                const action =
                    button.dataset.action;


                if (action === "edit") {

                    openEditModal(id);
                }


                if (action === "delete") {

                    openDeleteModal(id);
                }

            }
        );
    }


    // =====================================================
    // BUSCA
    // =====================================================

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            filterClients
        );
    }


    // =====================================================
    // ATUALIZAR
    // =====================================================

    if (refreshButton) {

        refreshButton.addEventListener(
            "click",
            async () => {

                await loadClients();

                showToast(
                    "Clientes atualizados.",
                    "success"
                );
            }
        );
    }


    // =====================================================
    // ESC
    // =====================================================

    document.addEventListener(
        "keydown",
        event => {

            if (event.key !== "Escape") {
                return;
            }


            if (
                clientModal &&
                !clientModal.hidden
            ) {

                closeClientModalFunction();

                return;
            }


            if (
                deleteModal &&
                !deleteModal.hidden
            ) {

                closeDeleteModal();
            }

        }
    );


    // =====================================================
    // INICIALIZAÇÃO
    // =====================================================

    loadClients();

});