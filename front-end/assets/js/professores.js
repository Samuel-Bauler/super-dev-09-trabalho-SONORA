document.addEventListener("DOMContentLoaded", () => {

    // =====================================================
    // API
    // =====================================================

    const API_URL = "http://localhost:8000";


    // =====================================================
    // ESTADO
    // =====================================================

    let professores = [];
    let instrumentos = [];
    let professorEditando = null;
    let professorApagando = null;


    // =====================================================
    // ELEMENTOS
    // =====================================================

    const searchInput =
        document.getElementById("teacher-search");

    const statusFilter =
        document.getElementById("teacher-status-filter");

    const instrumentFilter =
        document.getElementById("teacher-course-filter");

    const teachersList =
        document.getElementById("teachers-list");

    const emptyState =
        document.getElementById("empty-state");

    const counter =
        document.getElementById("teachers-counter");

    const newTeacherButton =
        document.getElementById("new-teacher-button");


    // =====================================================
    // MODAL PROFESSOR
    // =====================================================

    const teacherModal =
        document.getElementById("teacher-modal");

    const closeTeacherModal =
        document.getElementById("close-teacher-modal");

    const cancelTeacherModal =
        document.getElementById("cancel-teacher-modal");

    const teacherForm =
        document.getElementById("teacher-form");

    const teacherName =
        document.getElementById("teacher-name");

    const teacherInstrument =
        document.getElementById("teacher-instrument");

    const teacherStudents =
        document.getElementById("teacher-students");

    const teacherStatus =
        document.getElementById("teacher-status");

    const teacherModalTitle =
        document.getElementById("teacher-modal-title");

    const teacherModalEyebrow =
        document.getElementById("teacher-modal-eyebrow");

    const teacherModalDescription =
        document.getElementById("teacher-modal-description");

    const teacherSubmit =
        document.getElementById("teacher-submit");

    const teacherModalError =
        document.getElementById("teacher-modal-error");


    // =====================================================
    // MODAL DELETE
    // =====================================================

    const deleteModal =
        document.getElementById("delete-modal");

    const deleteTeacherName =
        document.getElementById("delete-teacher-name");

    const cancelDelete =
        document.getElementById("cancel-delete");

    const confirmDelete =
        document.getElementById("confirm-delete");

    const deleteError =
        document.getElementById("delete-error");


    // =====================================================
    // TOAST
    // =====================================================

    const toast =
        document.getElementById("toast");

    let toastTimer;


    // =====================================================
    // MOSTRAR TOAST
    // =====================================================

    function showToast(message) {

        if (!toast) {
            return;
        }

        toast.textContent = message;

        toast.classList.add("show");

        clearTimeout(toastTimer);

        toastTimer = setTimeout(() => {
            toast.classList.remove("show");
        }, 3000);
    }


    // =====================================================
    // ESCAPAR HTML
    // =====================================================

    function escapeHtml(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    // =====================================================
    // INICIAIS
    // =====================================================

    function getInitials(name) {

        const parts =
            String(name || "")
                .trim()
                .split(/\s+/)
                .filter(Boolean);

        if (parts.length === 0) {
            return "??";
        }

        if (parts.length === 1) {
            return parts[0]
                .substring(0, 2)
                .toUpperCase();
        }

        return (
            parts[0][0] +
            parts[parts.length - 1][0]
        ).toUpperCase();
    }


    // =====================================================
    // NORMALIZAR TEXTO
    // =====================================================

    function normalizeText(text) {

        return String(text || "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim();
    }


    // =====================================================
    // NORMALIZAR STATUS
    // =====================================================

    function normalizeStatus(status) {

        if (
            status === true ||
            status === 1 ||
            status === "1" ||
            status === "true"
        ) {
            return true;
        }

        return false;
    }


    // =====================================================
    // BUSCAR INSTRUMENTO PELO ID
    // =====================================================

    function getInstrumentById(id) {

        return instrumentos.find(
            instrumento =>
                Number(instrumento.id) === Number(id)
        );
    }


    // =====================================================
    // CLASSE VISUAL DO INSTRUMENTO
    // =====================================================

    function getInstrumentClass(nome) {

        const instrument =
            normalizeText(nome);

        if (instrument.includes("violao")) {
            return {
                tag: "green-tag",
                avatar: "avatar-green"
            };
        }

        if (instrument.includes("piano")) {
            return {
                tag: "blue-tag",
                avatar: "avatar-blue"
            };
        }

        if (instrument.includes("canto")) {
            return {
                tag: "rose-tag",
                avatar: "avatar-rose"
            };
        }

        if (instrument.includes("guitarra")) {
            return {
                tag: "purple-tag",
                avatar: "avatar-purple"
            };
        }

        if (instrument.includes("bateria")) {
            return {
                tag: "sand-tag",
                avatar: "avatar-sand"
            };
        }

        if (instrument.includes("violino")) {
            return {
                tag: "purple-tag",
                avatar: "avatar-purple"
            };
        }

        return {
            tag: "green-tag",
            avatar: "avatar-green"
        };
    }


    // =====================================================
    // TRATAR RESPOSTA DA API
    // =====================================================

    async function requestJSON(url, options = {}) {

        let response;

        try {

            response = await fetch(
                url,
                {
                    ...options,

                    headers: {
                        "Content-Type": "application/json",
                        ...(options.headers || {})
                    }
                }
            );

        } catch (error) {

            console.error("Erro de conexão:", error);

            throw new Error(
                "Não é possível apagar. Esse professor tem relação com aula/curso."
            );
        }


        let data = null;

        try {

            data = await response.json();

        } catch {

            data = null;
        }


        if (!response.ok) {

            let message =
                data?.detail ||
                data?.message ||
                `Erro no servidor (${response.status}).`;


            // =================================================
            // ERROS ESPECÍFICOS
            // =================================================

            if (response.status === 404) {

                message =
                    data?.detail ||
                    "Professor não encontrado.";
            }


            if (response.status === 409) {

                message =
                    data?.detail ||
                    "Não é possível excluir este professor porque ele possui registros relacionados.";
            }


            if (response.status === 500) {

                message =
                    data?.detail ||
                    "O servidor encontrou um erro ao realizar esta operação.";
            }


            throw new Error(message);
        }


        return data;
    }


    // =====================================================
    // CARREGAR INSTRUMENTOS
    // =====================================================

    async function loadInstrumentos() {

        const data =
            await requestJSON(
                `${API_URL}/instrumentos`
            );

        instrumentos =
            Array.isArray(data)
                ? data
                : [];

        populateInstrumentSelects();
    }


    // =====================================================
    // PREENCHER SELECTS
    // =====================================================

    function populateInstrumentSelects() {

        teacherInstrument.innerHTML = `
            <option value="">
                Selecione um instrumento
            </option>
        `;


        instrumentFilter.innerHTML = `
            <option value="all">
                Todos os instrumentos
            </option>
        `;


        instrumentos.forEach(
            instrumento => {

                const optionForm =
                    document.createElement("option");

                optionForm.value =
                    instrumento.id;

                optionForm.textContent =
                    instrumento.nome;

                teacherInstrument.appendChild(
                    optionForm
                );


                const optionFilter =
                    document.createElement("option");

                optionFilter.value =
                    instrumento.id;

                optionFilter.textContent =
                    instrumento.nome;

                instrumentFilter.appendChild(
                    optionFilter
                );
            }
        );
    }


    // =====================================================
    // CARREGAR PROFESSORES
    // =====================================================

    async function loadProfessores() {

        teachersList.innerHTML = `
            <tr class="loading-row">
                <td colspan="5">
                    Carregando professores...
                </td>
            </tr>
        `;


        emptyState.hidden = true;


        try {

            const data =
                await requestJSON(
                    `${API_URL}/professores`
                );


            professores =
                Array.isArray(data)
                    ? data
                    : [];


            renderTeachers();

        } catch (error) {

            console.error(
                "Erro ao carregar professores:",
                error
            );


            teachersList.innerHTML = `
                <tr class="loading-row">
                    <td colspan="5">
                        Não foi possível carregar os professores.
                    </td>
                </tr>
            `;


            counter.textContent =
                "Erro ao carregar";


            showToast(
                error.message ||
                "Não foi possível carregar os professores."
            );
        }
    }


    // =====================================================
    // RENDERIZAR PROFESSORES
    // =====================================================

    function renderTeachers() {

        const search =
            normalizeText(
                searchInput.value
            );


        const selectedStatus =
            statusFilter.value;


        const selectedInstrument =
            instrumentFilter.value;


        const filtered =
            professores.filter(
                professor => {

                    const nome =
                        normalizeText(
                            professor.nome
                        );


                    const matchesSearch =
                        !search ||
                        nome.includes(search);


                    const professorStatus =
                        normalizeStatus(
                            professor.status
                        );


                    let matchesStatus = true;


                    if (selectedStatus === "active") {

                        matchesStatus =
                            professorStatus === true;
                    }


                    if (selectedStatus === "inactive") {

                        matchesStatus =
                            professorStatus === false;
                    }


                    const matchesInstrument =
                        selectedInstrument === "all" ||
                        Number(
                            professor.id_instrumento
                        ) === Number(
                            selectedInstrument
                        );


                    return (
                        matchesSearch &&
                        matchesStatus &&
                        matchesInstrument
                    );
                }
            );


        teachersList.innerHTML = "";


        if (filtered.length === 0) {

            emptyState.hidden = false;

            counter.textContent =
                "0 professores";

            return;
        }


        emptyState.hidden = true;


        filtered.forEach(
            professor => {

                const row =
                    createTeacherRow(
                        professor
                    );

                teachersList.appendChild(
                    row
                );
            }
        );


        counter.textContent =
            `${filtered.length} ${
                filtered.length === 1
                    ? "professor"
                    : "professores"
            }`;
    }


    // =====================================================
    // CRIAR LINHA DA TABELA
    // =====================================================

    function createTeacherRow(professor) {

        const row =
            document.createElement("tr");


        row.dataset.id =
            professor.id;


        const instrumento =
            getInstrumentById(
                professor.id_instrumento
            );


        const instrumentoNome =
            instrumento?.nome ||
            "Instrumento não encontrado";


        const visual =
            getInstrumentClass(
                instrumentoNome
            );


        const initials =
            getInitials(
                professor.nome
            );


        const isActive =
            normalizeStatus(
                professor.status
            );


        const statusText =
            isActive
                ? "Ativo"
                : "Inativo";


        row.innerHTML = `

            <td>

                <div class="teacher-person">

                    <span
                        class="teacher-avatar ${visual.avatar}"
                    >
                        ${escapeHtml(initials)}
                    </span>

                    <div>

                        <strong>
                            ${escapeHtml(
                                professor.nome
                            )}
                        </strong>

                    </div>

                </div>

            </td>


            <td>

                <span
                    class="specialty-tag ${visual.tag}"
                >
                    ${escapeHtml(
                        instrumentoNome
                    )}
                </span>

            </td>


            <td>

                ${Number(
                    professor.alunos
                )}

                ${
                    Number(professor.alunos) === 1
                        ? "aluno"
                        : "alunos"
                }

            </td>


            <td>

                <span
                    class="status ${
                        isActive
                            ? "active-status"
                            : "inactive-status"
                    }"
                >

                    <i></i>

                    ${statusText}

                </span>

            </td>


            <td>

                <div class="teacher-actions">


                    <!-- EDITAR -->

                    <button
                        type="button"
                        class="teacher-action edit-action"
                        data-action="edit"
                        data-id="${professor.id}"
                        title="Editar professor"
                        aria-label="Editar professor"
                    >

                        <svg
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >

                            <path
                                d="M4 20h4L19 9a2.1 2.1 0 0 0-3-3L5 17v3Z"
                            />

                            <path
                                d="m14.5 7.5 2 2"
                            />

                        </svg>

                    </button>


                    <!-- APAGAR -->

                    <button
                        type="button"
                        class="teacher-action delete-action"
                        data-action="delete"
                        data-id="${professor.id}"
                        title="Apagar professor"
                        aria-label="Apagar professor"
                    >

                        <svg
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >

                            <path
                                d="M6 7h12"
                            />

                            <path
                                d="M9 7V5.8c0-.44.36-.8.8-.8h4.4c.44 0 .8.36.8.8V7"
                            />

                            <path
                                d="m8 7 .7 12h6.6L16 7"
                            />

                            <path
                                d="M10 11v5"
                            />

                            <path
                                d="M14 11v5"
                            />

                        </svg>

                    </button>

                </div>

            </td>
        `;


        return row;
    }


    // =====================================================
    // ABRIR MODAL DE CADASTRO
    // =====================================================

    function openCreateModal() {

        professorEditando = null;


        teacherModalTitle.textContent =
            "Novo professor";


        teacherModalEyebrow.textContent =
            "NOVO CADASTRO";


        teacherModalDescription.textContent =
            "Cadastre um novo professor na equipe Sonora.";


        teacherSubmit.textContent =
            "Cadastrar professor";


        teacherForm.reset();


        teacherStudents.value =
            "0";


        teacherStatus.value =
            "1";


        teacherModalError.hidden =
            true;


        teacherModal.hidden =
            false;


        document.body.style.overflow =
            "hidden";


        setTimeout(() => {

            teacherName.focus();

        }, 100);
    }


    // =====================================================
    // ABRIR MODAL DE EDIÇÃO
    // =====================================================

    function openEditModal(id) {

        const professor =
            professores.find(
                item =>
                    Number(item.id) ===
                    Number(id)
            );


        if (!professor) {

            showToast(
                "Professor não encontrado."
            );

            return;
        }


        professorEditando =
            professor;


        teacherModalTitle.textContent =
            "Editar professor";


        teacherModalEyebrow.textContent =
            "EDIÇÃO DE CADASTRO";


        teacherModalDescription.textContent =
            "Atualize os dados do professor.";


        teacherSubmit.textContent =
            "Salvar alterações";


        teacherName.value =
            professor.nome || "";


        teacherInstrument.value =
            String(
                professor.id_instrumento
            );


        teacherStudents.value =
            professor.alunos ?? 0;


        teacherStatus.value =
            normalizeStatus(
                professor.status
            )
                ? "1"
                : "0";


        teacherModalError.hidden =
            true;


        teacherModal.hidden =
            false;


        document.body.style.overflow =
            "hidden";


        setTimeout(() => {

            teacherName.focus();

        }, 100);
    }


    // =====================================================
    // FECHAR MODAL PROFESSOR
    // =====================================================

    function closeTeacherModalFunction() {

        teacherModal.hidden =
            true;


        document.body.style.overflow =
            "";


        teacherForm.reset();


        teacherStudents.value =
            "0";


        teacherStatus.value =
            "1";


        teacherModalError.hidden =
            true;


        professorEditando =
            null;
    }


    // =====================================================
    // ABRIR MODAL DELETE
    // =====================================================

    function openDeleteModal(id) {

        const professor =
            professores.find(
                item =>
                    Number(item.id) ===
                    Number(id)
            );


        if (!professor) {

            showToast(
                "Professor não encontrado."
            );

            return;
        }


        professorApagando =
            professor;


        deleteTeacherName.textContent =
            professor.nome;


        deleteError.textContent =
            "";


        deleteError.hidden =
            true;


        deleteModal.hidden =
            false;


        document.body.style.overflow =
            "hidden";
    }


    // =====================================================
    // FECHAR MODAL DELETE
    // =====================================================

    function closeDeleteModal() {

        deleteModal.hidden =
            true;


        document.body.style.overflow =
            "";


        professorApagando =
            null;


        deleteError.textContent =
            "";


        deleteError.hidden =
            true;
    }


    // =====================================================
    // CADASTRAR / EDITAR PROFESSOR
    // =====================================================

    teacherForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const nome =
                teacherName.value.trim();


            const idInstrumento =
                Number(
                    teacherInstrument.value
                );


            const alunos =
                Number(
                    teacherStudents.value
                );


            const status =
                teacherStatus.value === "1";


            // =================================================
            // VALIDAÇÕES
            // =================================================

            if (!nome) {

                showFormError(
                    "Digite o nome do professor."
                );

                teacherName.focus();

                return;
            }


            if (!teacherInstrument.value) {

                showFormError(
                    "Selecione um instrumento."
                );

                teacherInstrument.focus();

                return;
            }


            if (
                !Number.isInteger(alunos) ||
                alunos < 0
            ) {

                showFormError(
                    "A quantidade de alunos deve ser um número válido."
                );

                teacherStudents.focus();

                return;
            }


            // =================================================
            // PAYLOAD
            // =================================================

            const payload = {

                nome: nome,

                id_instrumento:
                    idInstrumento,

                alunos:
                    alunos,

                status:
                    status
            };


            // =================================================
            // DESABILITAR BOTÃO
            // =================================================

            teacherSubmit.disabled =
                true;


            const editando =
                professorEditando !== null;


            try {

                // =================================================
                // EDITAR
                // =================================================

                if (editando) {

                    await requestJSON(
                        `${API_URL}/professores/${professorEditando.id}`,
                        {
                            method: "PUT",

                            body:
                                JSON.stringify(
                                    payload
                                )
                        }
                    );


                    closeTeacherModalFunction();


                    showToast(
                        "Professor atualizado com sucesso."
                    );


                // =================================================
                // CADASTRAR
                // =================================================

                } else {

                    await requestJSON(
                        `${API_URL}/professores`,
                        {
                            method: "POST",

                            body:
                                JSON.stringify(
                                    payload
                                )
                        }
                    );


                    closeTeacherModalFunction();


                    showToast(
                        "Professor cadastrado com sucesso."
                    );
                }


                // =================================================
                // ATUALIZAR TABELA
                // =================================================

                await loadProfessores();


            } catch (error) {

                console.error(
                    "Erro ao salvar professor:",
                    error
                );


                showFormError(
                    error.message ||
                    "Não foi possível salvar o professor."
                );


            } finally {

                teacherSubmit.disabled =
                    false;
            }
        }
    );


    // =====================================================
    // APAGAR PROFESSOR
    // =====================================================

    confirmDelete.addEventListener(
        "click",
        async () => {

            if (!professorApagando) {
                return;
            }


            const id =
                professorApagando.id;


            const nome =
                professorApagando.nome;


            confirmDelete.disabled =
                true;


            deleteError.hidden =
                true;


            try {

                await requestJSON(
                    `${API_URL}/professores/${id}`,
                    {
                        method: "DELETE"
                    }
                );


                closeDeleteModal();


                showToast(
                    `${nome} foi apagado com sucesso.`
                );


                await loadProfessores();


            } catch (error) {

                console.error(
                    "Erro ao apagar professor:",
                    error
                );


                let mensagem =
                    error.message;


                if (
                    !mensagem ||
                    mensagem === "Failed to fetch"
                ) {

                    mensagem =
                        "Não foi possível conectar ao servidor.";
                }


                deleteError.textContent =
                    mensagem;


                deleteError.hidden =
                    false;


            } finally {

                confirmDelete.disabled =
                    false;
            }
        }
    );


    // =====================================================
    // MOSTRAR ERRO DO FORMULÁRIO
    // =====================================================

    function showFormError(message) {

        teacherModalError.textContent =
            message;


        teacherModalError.hidden =
            false;
    }


    // =====================================================
    // AÇÕES DA TABELA
    // =====================================================

    teachersList.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    ".teacher-action"
                );


            if (!button) {
                return;
            }


            const id =
                Number(
                    button.dataset.id
                );


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


    // =====================================================
    // NOVO PROFESSOR
    // =====================================================

    newTeacherButton.addEventListener(
        "click",
        openCreateModal
    );


    // =====================================================
    // FECHAR MODAL PROFESSOR
    // =====================================================

    closeTeacherModal.addEventListener(
        "click",
        closeTeacherModalFunction
    );


    cancelTeacherModal.addEventListener(
        "click",
        closeTeacherModalFunction
    );


    // =====================================================
    // FECHAR MODAL DELETE
    // =====================================================

    cancelDelete.addEventListener(
        "click",
        closeDeleteModal
    );


    // =====================================================
    // CLICAR FORA DO MODAL
    // =====================================================

    teacherModal.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                teacherModal
            ) {

                closeTeacherModalFunction();
            }
        }
    );


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


    // =====================================================
    // ESC
    // =====================================================

    document.addEventListener(
        "keydown",
        event => {

            if (event.key !== "Escape") {
                return;
            }


            if (!teacherModal.hidden) {

                closeTeacherModalFunction();

                return;
            }


            if (!deleteModal.hidden) {

                closeDeleteModal();
            }
        }
    );


    // =====================================================
    // BUSCA
    // =====================================================

    searchInput.addEventListener(
        "input",
        renderTeachers
    );


    // =====================================================
    // FILTRO STATUS
    // =====================================================

    statusFilter.addEventListener(
        "change",
        renderTeachers
    );


    // =====================================================
    // FILTRO INSTRUMENTO
    // =====================================================

    instrumentFilter.addEventListener(
        "change",
        renderTeachers
    );


    // =====================================================
    // INICIALIZAÇÃO
    // =====================================================

    async function init() {

        try {

            // Primeiro instrumentos
            await loadInstrumentos();

            // Depois professores
            await loadProfessores();

        } catch (error) {

            console.error(
                "Erro ao iniciar página:",
                error
            );


            showToast(
                error.message ||
                "Não foi possível conectar com a API."
            );
        }
    }


    // =====================================================
    // INICIAR
    // =====================================================

    init();

});