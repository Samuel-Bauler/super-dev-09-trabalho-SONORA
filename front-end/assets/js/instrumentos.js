document.addEventListener("DOMContentLoaded", () => {

    const API_URL = "http://localhost:8000";

    // ==========================================
    // ELEMENTOS DA PÁGINA
    // ==========================================

    const searchInput =
        document.getElementById("instrument-search");

    const counter =
        document.getElementById("instrument-counter");

    const emptyState =
        document.getElementById("instrument-empty");

    const table =
        document.getElementById("instruments-table");

    const newInstrumentButton =
        document.getElementById("new-instrument-button");

    const refreshButton =
        document.getElementById("refresh-instruments");


    // ==========================================
    // MODAL DE CADASTRO / EDIÇÃO
    // ==========================================

    const modal =
        document.getElementById("instrument-modal");

    const modalClose =
        document.getElementById("close-instrument-modal");

    const cancelModal =
        document.getElementById("cancel-instrument-modal");

    const form =
        document.getElementById("instrument-form");

    const instrumentName =
        document.getElementById("instrument-name");

    const formError =
        document.getElementById("modal-error");

    const saveButton =
        document.getElementById("submit-instrument");

    const modalTitle =
        document.getElementById("modal-title");

    const modalDescription =
        document.getElementById("modal-description");


    // ==========================================
    // MODAL DE EXCLUSÃO
    // ==========================================

    const deleteModal =
        document.getElementById("delete-modal");

    const deleteInstrumentName =
        document.getElementById("delete-instrument-name");

    const cancelDelete =
        document.getElementById("cancel-delete");

    const confirmDelete =
        document.getElementById("confirm-delete");


    // ==========================================
    // VARIÁVEIS
    // ==========================================

    let instrumentos = [];

    let instrumentoEditando = null;

    let instrumentoApagando = null;


    // ==========================================
    // CARREGAR INSTRUMENTOS
    // ==========================================

    async function loadInstruments() {

        try {

            console.log("Buscando instrumentos...");

            const response = await fetch(
                `${API_URL}/instrumentos`
            );

            console.log(
                "Status da API:",
                response.status
            );

            if (!response.ok) {

                throw new Error(
                    `Erro HTTP: ${response.status}`
                );
            }

            const data =
                await response.json();

            console.log(
                "Instrumentos recebidos:",
                data
            );

            instrumentos = data;

            renderInstruments(
                instrumentos
            );

        } catch (error) {

            console.error(
                "Erro ao carregar instrumentos:",
                error
            );

            if (table) {
                table.innerHTML = "";
            }

            if (counter) {
                counter.textContent =
                    "Erro ao carregar";
            }

            if (emptyState) {

                emptyState.hidden = false;

                const title =
                    emptyState.querySelector("h3");

                const text =
                    emptyState.querySelector("p");

                if (title) {

                    title.textContent =
                        "Erro ao carregar instrumentos";
                }

                if (text) {

                    text.textContent =
                        "Verifique se o backend está funcionando.";
                }
            }
        }
    }


    // ==========================================
    // RENDERIZAR TABELA
    // ==========================================

    function renderInstruments(lista) {

        if (!table) {
            return;
        }

        table.innerHTML = "";


        if (emptyState) {

            emptyState.hidden =
                lista.length !== 0;
        }


        lista.forEach(instrumento => {

            const row =
                document.createElement("tr");


            row.innerHTML = `
                <td>
                    ${instrumento.id}
                </td>

                <td>
                    ${escapeHtml(instrumento.nome)}
                </td>

                <td>

                    <div class="instrument-actions">

                        <button
                            class="instrument-action edit"
                            type="button"
                            data-action="edit"
                            data-id="${instrumento.id}"
                            title="Editar instrumento"
                            aria-label="Editar instrumento"
                        >

                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >

                                <path
                                    d="M12 20h9"
                                ></path>

                                <path
                                    d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z"
                                ></path>

                            </svg>

                        </button>


                        <button
                            class="instrument-action delete"
                            type="button"
                            data-action="delete"
                            data-id="${instrumento.id}"
                            title="Apagar instrumento"
                            aria-label="Apagar instrumento"
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

                                <path
                                    d="M10 11v6"
                                ></path>

                                <path
                                    d="M14 11v6"
                                ></path>

                                <path
                                    d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"
                                ></path>

                            </svg>

                        </button>

                    </div>

                </td>
            `;


            table.appendChild(row);
        });


        if (counter) {

            counter.textContent =
                `${lista.length} ${
                    lista.length === 1
                        ? "instrumento"
                        : "instrumentos"
                }`;
        }
    }


    // ==========================================
    // ESCAPAR HTML
    // ==========================================

    function escapeHtml(text) {

        const div =
            document.createElement("div");

        div.textContent =
            text;

        return div.innerHTML;
    }


    // ==========================================
    // PESQUISAR
    // ==========================================

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            () => {

                const searchTerm =
                    searchInput.value
                        .trim()
                        .toLowerCase();


                const filtrados =
                    instrumentos.filter(
                        instrumento =>
                            instrumento.nome
                                .toLowerCase()
                                .includes(searchTerm)
                    );


                renderInstruments(
                    filtrados
                );
            }
        );
    }


    // ==========================================
    // ABRIR MODAL DE CADASTRO
    // ==========================================

    function openCreateModal() {

        instrumentoEditando =
            null;


        if (modalTitle) {

            modalTitle.textContent =
                "Novo instrumento";
        }


        if (modalDescription) {

            modalDescription.textContent =
                "Cadastre um novo instrumento no acervo da Sonora.";
        }


        if (saveButton) {

            saveButton.textContent =
                "Cadastrar instrumento";
        }


        if (form) {
            form.reset();
        }


        hideFormError();


        if (modal) {

            modal.hidden =
                false;
        }


        if (instrumentName) {

            setTimeout(() => {
                instrumentName.focus();
            }, 50);
        }
    }


    // ==========================================
    // ABRIR MODAL DE EDIÇÃO
    // ==========================================

    function openEditModal(id) {

        const instrumento =
            instrumentos.find(
                item =>
                    String(item.id) ===
                    String(id)
            );


        if (!instrumento) {

            console.error(
                "Instrumento não encontrado."
            );

            return;
        }


        instrumentoEditando =
            instrumento;


        if (modalTitle) {

            modalTitle.textContent =
                "Editar instrumento";
        }


        if (modalDescription) {

            modalDescription.textContent =
                "Altere o nome do instrumento e salve as alterações.";
        }


        if (saveButton) {

            saveButton.textContent =
                "Salvar alterações";
        }


        if (instrumentName) {

            instrumentName.value =
                instrumento.nome;
        }


        hideFormError();


        if (modal) {

            modal.hidden =
                false;
        }


        if (instrumentName) {

            setTimeout(() => {
                instrumentName.focus();
            }, 50);
        }
    }


    // ==========================================
    // FECHAR MODAL
    // ==========================================

    function closeModal() {

        if (!modal) {
            return;
        }


        modal.hidden =
            true;


        instrumentoEditando =
            null;


        if (form) {
            form.reset();
        }


        hideFormError();
    }


    // ==========================================
    // ERRO DO FORMULÁRIO
    // ==========================================

    function hideFormError() {

        if (!formError) {
            return;
        }


        formError.hidden =
            true;

        formError.textContent =
            "";
    }


    function showFormError(message) {

        if (!formError) {
            return;
        }


        formError.textContent =
            message;

        formError.hidden =
            false;
    }


    // ==========================================
    // BOTÃO NOVO INSTRUMENTO
    // ==========================================

    if (newInstrumentButton) {

        newInstrumentButton.addEventListener(
            "click",
            openCreateModal
        );
    }


    // ==========================================
    // FECHAR MODAL
    // ==========================================

    if (modalClose) {

        modalClose.addEventListener(
            "click",
            closeModal
        );
    }


    if (cancelModal) {

        cancelModal.addEventListener(
            "click",
            closeModal
        );
    }


    if (modal) {

        modal.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    modal
                ) {

                    closeModal();
                }
            }
        );
    }


    // ==========================================
    // CADASTRAR / EDITAR
    // ==========================================

    if (form) {

        form.addEventListener(
            "submit",
            async event => {

                event.preventDefault();


                const nome =
                    instrumentName.value.trim();


                if (!nome) {

                    showFormError(
                        "Digite o nome do instrumento."
                    );

                    return;
                }


                try {

                    saveButton.disabled =
                        true;


                    // ==================================
                    // EDITAR
                    // ==================================

                    if (instrumentoEditando) {

                        saveButton.textContent =
                            "Salvando...";


                        const id =
                            instrumentoEditando.id;


                        const response =
                            await fetch(
                                `${API_URL}/instrumentos/${id}`,
                                {
                                    method: "PUT",

                                    headers: {
                                        "Content-Type":
                                            "application/json"
                                    },

                                    body: JSON.stringify({
                                        nome: nome
                                    })
                                }
                            );


                        let data = null;


                        try {

                            data =
                                await response.json();

                        } catch {

                            data =
                                null;
                        }


                        if (!response.ok) {

                            throw new Error(
                                data?.detail ||
                                `Erro HTTP: ${response.status}`
                            );
                        }


                        console.log(
                            "Instrumento editado:",
                            data
                        );


                        closeModal();


                        await loadInstruments();
                    }


                    // ==================================
                    // CADASTRAR
                    // ==================================

                    else {

                        saveButton.textContent =
                            "Cadastrando...";


                        const response =
                            await fetch(
                                `${API_URL}/instrumentos`,
                                {
                                    method: "POST",

                                    headers: {
                                        "Content-Type":
                                            "application/json"
                                    },

                                    body: JSON.stringify({
                                        nome: nome
                                    })
                                }
                            );


                        let data = null;


                        try {

                            data =
                                await response.json();

                        } catch {

                            data =
                                null;
                        }


                        if (!response.ok) {

                            throw new Error(
                                data?.detail ||
                                `Erro HTTP: ${response.status}`
                            );
                        }


                        console.log(
                            "Instrumento cadastrado:",
                            data
                        );


                        closeModal();


                        await loadInstruments();
                    }


                } catch (error) {

                    console.error(
                        "Erro ao salvar instrumento:",
                        error
                    );


                    showFormError(
                        error.message ||
                        "Não foi possível salvar o instrumento."
                    );


                } finally {

                    saveButton.disabled =
                        false;


                    if (instrumentoEditando) {

                        saveButton.textContent =
                            "Salvar alterações";

                    } else {

                        saveButton.textContent =
                            "Cadastrar instrumento";
                    }
                }
            }
        );
    }


    // ==========================================
    // AÇÕES DA TABELA
    // ==========================================

    if (table) {

        table.addEventListener(
            "click",
            event => {

                const button =
                    event.target.closest(
                        ".instrument-action"
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


    // ==========================================
    // ABRIR MODAL DE EXCLUSÃO
    // ==========================================

    function openDeleteModal(id) {

        const instrumento =
            instrumentos.find(
                item =>
                    String(item.id) ===
                    String(id)
            );


        if (!instrumento) {

            console.error(
                "Instrumento não encontrado."
            );

            return;
        }


        instrumentoApagando =
            instrumento;


        if (deleteInstrumentName) {

            deleteInstrumentName.textContent =
                instrumento.nome;
        }


        if (deleteModal) {

            deleteModal.hidden =
                false;
        }
    }


    // ==========================================
    // FECHAR MODAL DE EXCLUSÃO
    // ==========================================

    function closeDeleteModal() {

        if (!deleteModal) {
            return;
        }


        deleteModal.hidden =
            true;


        instrumentoApagando =
            null;
    }


    // ==========================================
    // CANCELAR EXCLUSÃO
    // ==========================================

    if (cancelDelete) {

        cancelDelete.addEventListener(
            "click",
            closeDeleteModal
        );
    }


    // ==========================================
    // CLICAR FORA DO MODAL
    // ==========================================

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


    // ==========================================
    // APAGAR INSTRUMENTO
    // ==========================================

    if (confirmDelete) {

        confirmDelete.addEventListener(
            "click",
            async () => {

                if (!instrumentoApagando) {
                    return;
                }


                const id =
                    instrumentoApagando.id;


                const nome =
                    instrumentoApagando.nome;


                try {

                    confirmDelete.disabled =
                        true;


                    confirmDelete.textContent =
                        "Apagando...";


                    console.log(
                        `Tentando apagar instrumento ${id}...`
                    );


                    const response =
                        await fetch(
                            `${API_URL}/instrumentos/${id}`,
                            {
                                method: "DELETE"
                            }
                        );


                    let data = null;


                    try {

                        data =
                            await response.json();

                    } catch {

                        data =
                            null;
                    }


                    console.log(
                        "Resposta DELETE:",
                        response.status,
                        data
                    );


                    // ==================================
                    // INSTRUMENTO NÃO ENCONTRADO
                    // ==================================

                    if (response.status === 404) {

                        throw new Error(
                            "Instrumento não encontrado."
                        );
                    }


                    // ==================================
                    // ERRO DE CHAVE ESTRANGEIRA
                    // ==================================

                    if (response.status === 409) {

                        throw new Error(
                            data?.detail ||
                            "Não é possível apagar este instrumento porque ele está sendo utilizado por outro registro."
                        );
                    }


                    console.log(
                        `Instrumento "${nome}" apagado com sucesso.`
                    );


                    closeDeleteModal();


                    // Recarrega os dados do banco

                    await loadInstruments();


                } catch (error) {

                    console.error(
                        "Erro ao apagar instrumento:",
                        error
                    );


                    /*
                     * Mostra a mensagem retornada
                     * pelo FastAPI.
                     */

                    alert(
                        error.message ||
                        "Não foi possível apagar o instrumento."
                    );


                } finally {

                    confirmDelete.disabled =
                        false;


                    confirmDelete.textContent =
                        "Apagar instrumento";
                }
            }
        );
    }


    // ==========================================
    // BOTÃO ATUALIZAR
    // ==========================================

    if (refreshButton) {

        refreshButton.addEventListener(
            "click",
            loadInstruments
        );
    }


    // ==========================================
    // ESC FECHA OS MODAIS
    // ==========================================

    document.addEventListener(
        "keydown",
        event => {

            if (event.key !== "Escape") {
                return;
            }


            if (
                modal &&
                !modal.hidden
            ) {

                closeModal();

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


    // ==========================================
    // INICIALIZAÇÃO
    // ==========================================

    loadInstruments();

});