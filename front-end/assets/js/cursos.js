document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       CONFIGURAÇÃO
    ===================================================== */

    const API_URL = "http://localhost:8000/cursos";

    /* =====================================================
       ELEMENTOS
    ===================================================== */

    const courseGrid =
        document.getElementById("course-grid");

    const courseCount =
        document.getElementById("course-count");

    const courseSearch =
        document.getElementById("course-search");

    const emptyState =
        document.getElementById("empty-state");

    const newCourseButton =
        document.getElementById("new-course-button");

    const emptyNewCourse =
        document.getElementById("empty-new-course");

    const quickCreateCourse =
        document.getElementById("quick-create-course");


    /* =====================================================
       MODAL
    ===================================================== */

    const backdrop =
        document.getElementById("modal-backdrop");

    const courseModal =
        document.getElementById("course-modal");

    const detailsModal =
        document.getElementById("details-modal");

    const deleteModal =
        document.getElementById("delete-modal");


    /* =====================================================
       FORMULÁRIO
    ===================================================== */

    const courseForm =
        document.getElementById("course-form");

    const courseModalTitle =
        document.getElementById("course-modal-title");

    const courseModalDescription =
        document.getElementById("course-modal-description");

    const saveCourseButton =
        document.getElementById("save-course-button");

    const editingCourseId =
        document.getElementById("editing-course-id");

    const courseName =
        document.getElementById("course-name");

    const courseDescription =
        document.getElementById("course-description");

    const courseClient =
        document.getElementById("course-client");

    const courseInstrument =
        document.getElementById("course-instrument");


    /* =====================================================
       FOTO
    ===================================================== */

    const courseCover =
        document.getElementById("course-cover");

    const coverPreviewImage =
        document.getElementById("cover-preview-image");

    const coverPlaceholder =
        document.getElementById("cover-placeholder");

    const removeCoverButton =
        document.getElementById("remove-cover");


    /* =====================================================
       DETALHES
    ===================================================== */

    const detailsCover =
        document.getElementById("details-cover");

    const detailsCoverImage =
        document.getElementById("details-cover-image");

    const detailsCoverSymbol =
        document.getElementById("details-cover-symbol");

    const detailsInstrument =
        document.getElementById("details-instrument");

    const detailsName =
        document.getElementById("details-name");

    const detailsDescription =
        document.getElementById("details-description");

    const detailsClient =
        document.getElementById("details-client");

    const detailsId =
        document.getElementById("details-id");

    const detailsEditButton =
        document.getElementById("details-edit-button");

    const detailsDeleteButton =
        document.getElementById("details-delete-button");


    /* =====================================================
       EXCLUSÃO
    ===================================================== */

    const deleteCourseName =
        document.getElementById("delete-course-name");

    const confirmDeleteButton =
        document.getElementById("confirm-delete-button");


    /* =====================================================
       TOAST
    ===================================================== */

    const toast =
        document.getElementById("toast");


    /* =====================================================
       ESTADO
    ===================================================== */

    let courses = [];

    let pendingCoverImage = null;

    let currentDetailsCourseId = null;

    let courseToDeleteId = null;


    /* =====================================================
       NORMALIZAR CURSO
    ===================================================== */

    function normalizeCourse(course) {

        return {
            id: course.id,

            name: course.nome || "Curso sem nome",

            description:
                course.descricao || "Sem descrição.",

            client:
                course.cliente?.nome ||
                "Cliente não informado",

            clientId:
                course.cliente?.id || null,

            instrument:
                course.instrumento?.nome ||
                "Outro",

            instrumentId:
                course.instrumento?.id || null,

            coverImage: null,

            status:
                course.status ? "ATIVO" : "INATIVO"
        };
    }


    /* =====================================================
       CARREGAR CURSOS DO BANCO
    ===================================================== */

    async function loadCourses() {

        try {

            const response =
                await fetch(API_URL);

            if (!response.ok) {

                throw new Error(
                    "Erro ao buscar cursos."
                );
            }

            const data =
                await response.json();

            courses =
                data.map(normalizeCourse);

            renderCourses();

        } catch (error) {

            console.error(
                "Erro ao carregar cursos:",
                error
            );

            courses = [];

            renderCourses();

            showToast(
                "Não foi possível carregar os cursos."
            );
        }
    }


    /* =====================================================
       ESCAPAR HTML
    ===================================================== */

    function escapeHtml(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    /* =====================================================
       INICIAIS DO CLIENTE
    ===================================================== */

    function getInitials(name) {

        const words =
            String(name)
                .trim()
                .split(/\s+/)
                .filter(Boolean);

        if (words.length === 0) {
            return "?";
        }

        if (words.length === 1) {

            return words[0]
                .substring(0, 2)
                .toUpperCase();
        }

        return (
            words[0][0] +
            words[words.length - 1][0]
        ).toUpperCase();
    }


    /* =====================================================
       CLASSE DA CAPA
    ===================================================== */

    function getInstrumentClass(instrument) {

        const classes = {

            "Violão": "guitar",
            "Piano": "piano",
            "Canto": "voice",
            "Bateria": "battery",
            "Guitarra": "guitar-electric",
            "Teclado": "keyboard",
            "Ukulele": "ukulele"

        };

        return classes[instrument] || "other";
    }


    /* =====================================================
       SÍMBOLO DO INSTRUMENTO
    ===================================================== */

    function getInstrumentSymbol(instrument) {

        const symbols = {

            "Violão": "♪",
            "Piano": "♫",
            "Canto": "◖",
            "Bateria": "◉",
            "Guitarra": "♪",
            "Teclado": "♫",
            "Ukulele": "♪"

        };

        return symbols[instrument] || "♫";
    }


    /* =====================================================
       RENDERIZAR CURSOS
    ===================================================== */

    function renderCourses() {

        const searchTerm =
            courseSearch.value
                .trim()
                .toLowerCase();

        const filteredCourses =
            courses.filter((course) => {

                const searchableText = [

                    course.name,
                    course.description,
                    course.client,
                    course.instrument

                ]
                    .join(" ")
                    .toLowerCase();

                return searchableText.includes(
                    searchTerm
                );
            });


        /* -------------------------------------------------
           CONTADOR
        ------------------------------------------------- */

        courseCount.textContent =
            `${filteredCourses.length} ${
                filteredCourses.length === 1
                    ? "curso"
                    : "cursos"
            }`;


        /* -------------------------------------------------
           LIMPAR GRID
        ------------------------------------------------- */

        courseGrid.innerHTML = "";


        /* -------------------------------------------------
           ESTADO VAZIO
        ------------------------------------------------- */

        if (filteredCourses.length === 0) {

            emptyState.hidden = false;

            return;
        }

        emptyState.hidden = true;


        /* -------------------------------------------------
           CRIAR CARDS
        ------------------------------------------------- */

        filteredCourses.forEach((course) => {

            const instrumentClass =
                getInstrumentClass(
                    course.instrument
                );

            const symbol =
                getInstrumentSymbol(
                    course.instrument
                );

            const initials =
                getInitials(
                    course.client
                );


            const imageHtml =
                course.coverImage
                    ? `
                        <img
                            class="course-cover-image"
                            src="${escapeHtml(course.coverImage)}"
                            alt="Capa do curso ${escapeHtml(course.name)}"
                        >
                    `
                    : "";


            const coverClass =
                course.coverImage
                    ? "has-image"
                    : "";


            const card =
                document.createElement("article");

            card.className =
                "course-card";

            card.dataset.courseId =
                course.id;


            card.innerHTML = `

                <div
                    class="course-cover ${instrumentClass} ${coverClass}"
                >

                    ${imageHtml}

                    <span class="cover-symbol">
                        ${symbol}
                    </span>

                    <b class="course-status">
                        ${escapeHtml(course.status)}
                    </b>

                </div>


                <div class="course-info">

                    <p class="course-category">
                        ${escapeHtml(course.instrument)}
                        · CURSO
                    </p>


                    <h3 class="course-title">
                        ${escapeHtml(course.name)}
                    </h3>


                    <p class="course-description">
                        ${escapeHtml(course.description)}
                    </p>


                    <div class="course-meta">

                        <span>
                            Instrumento:
                        </span>

                        <strong>
                            ${escapeHtml(course.instrument)}
                        </strong>

                        <span>
                            •
                        </span>

                        <span>
                            ${course.status === "ATIVO"
                                ? "Curso ativo"
                                : "Curso inativo"}
                        </span>

                    </div>


                    <div class="course-bottom">

                        <div class="course-client">

                            <span class="client-avatar">
                                ${escapeHtml(initials)}
                            </span>

                            <div class="client-data">

                                <span>
                                    CLIENTE
                                </span>

                                <strong>
                                    ${escapeHtml(course.client)}
                                </strong>

                            </div>

                        </div>


                        <button
                            type="button"
                            class="details-button"
                            data-details-id="${escapeHtml(course.id)}"
                        >
                            Ver detalhes →
                        </button>

                    </div>

                </div>

            `;


            courseGrid.appendChild(card);

        });

    }


    /* =====================================================
       ABRIR MODAL
    ===================================================== */

    function openModal(modal) {

        closeAllModals();

        modal.hidden = false;

        backdrop.hidden = false;

        document.body.classList.add(
            "modal-open"
        );
    }


    /* =====================================================
       FECHAR MODAL
    ===================================================== */

    function closeModal(modal) {

        modal.hidden = true;

        const anyOpen =
            !courseModal.hidden ||
            !detailsModal.hidden ||
            !deleteModal.hidden;

        if (!anyOpen) {

            backdrop.hidden = true;

            document.body.classList.remove(
                "modal-open"
            );
        }
    }


    /* =====================================================
       FECHAR TODOS
    ===================================================== */

    function closeAllModals() {

        courseModal.hidden = true;

        detailsModal.hidden = true;

        deleteModal.hidden = true;

        backdrop.hidden = true;

        document.body.classList.remove(
            "modal-open"
        );
    }


    /* =====================================================
       LIMPAR FOTO
    ===================================================== */

    function clearCover() {

        pendingCoverImage = null;

        courseCover.value = "";

        coverPreviewImage.src = "";

        coverPreviewImage.hidden = true;

        coverPlaceholder.hidden = false;

        removeCoverButton.hidden = true;
    }


    /* =====================================================
       MOSTRAR FOTO
    ===================================================== */

    function showCoverPreview(image) {

        pendingCoverImage = image;

        coverPreviewImage.src = image;

        coverPreviewImage.hidden = false;

        coverPlaceholder.hidden = true;

        removeCoverButton.hidden = false;
    }


    /* =====================================================
       ABRIR NOVO CURSO
    ===================================================== */

    function openNewCourseModal() {

        courseForm.reset();

        editingCourseId.value = "";

        courseModalTitle.textContent =
            "Novo curso";

        courseModalDescription.textContent =
            "Cadastre um novo curso no catálogo.";

        saveCourseButton.textContent =
            "Cadastrar curso";

        clearCover();

        openModal(courseModal);

        setTimeout(() => {

            courseName.focus();

        }, 100);
    }


    /* =====================================================
       ABRIR EDIÇÃO
    ===================================================== */

    async function openEditCourseModal(courseId) {

        try {

            const response =
                await fetch(
                    `${API_URL}/${courseId}`
                );

            if (!response.ok) {

                throw new Error(
                    "Curso não encontrado."
                );
            }

            const data =
                await response.json();

            const course =
                normalizeCourse(data);


            /* -----------------------------------------------
               PREENCHER CAMPOS
            ------------------------------------------------ */

            editingCourseId.value =
                course.id;

            courseName.value =
                course.name;

            courseDescription.value =
                course.description;

            courseClient.value =
                course.client;

            courseInstrument.value =
                course.instrument;


            /* -----------------------------------------------
               ALTERAR TÍTULO
            ------------------------------------------------ */

            courseModalTitle.textContent =
                "Editar curso";

            courseModalDescription.textContent =
                "Altere as informações do curso.";

            saveCourseButton.textContent =
                "Salvar alterações";


            /* -----------------------------------------------
               FOTO
            ------------------------------------------------ */

            clearCover();


            /* -----------------------------------------------
               ABRIR
            ------------------------------------------------ */

            openModal(courseModal);

            setTimeout(() => {

                courseName.focus();

            }, 100);

        } catch (error) {

            console.error(error);

            showToast(
                "Não foi possível carregar o curso."
            );
        }
    }


    /* =====================================================
       ABRIR DETALHES
    ===================================================== */

    async function openDetailsModal(courseId) {

        try {

            const response =
                await fetch(
                    `${API_URL}/${courseId}`
                );

            if (!response.ok) {

                throw new Error(
                    "Curso não encontrado."
                );
            }

            const data =
                await response.json();

            const course =
                normalizeCourse(data);


            currentDetailsCourseId =
                course.id;


            /* -----------------------------------------------
               TEXTO
            ------------------------------------------------ */

            detailsInstrument.textContent =
                `${course.instrument} · CURSO`;

            detailsName.textContent =
                course.name;

            detailsDescription.textContent =
                course.description;

            detailsClient.textContent =
                course.client;

            detailsId.textContent =
                course.id;


            /* -----------------------------------------------
               CAPA
            ------------------------------------------------ */

            const instrumentClass =
                getInstrumentClass(
                    course.instrument
                );

            const symbol =
                getInstrumentSymbol(
                    course.instrument
                );


            detailsCover.className =
                `details-cover ${instrumentClass}`;


            detailsCoverSymbol.textContent =
                symbol;


            detailsCoverImage.src = "";

            detailsCoverImage.hidden = true;


            openModal(detailsModal);

        } catch (error) {

            console.error(error);

            showToast(
                "Não foi possível carregar os detalhes."
            );
        }
    }


    /* =====================================================
       ABRIR CONFIRMAÇÃO DE EXCLUSÃO
    ===================================================== */

    function openDeleteModal(courseId) {

        const course =
            courses.find(
                (item) =>
                    Number(item.id) ===
                    Number(courseId)
            );


        if (!course) {

            showToast(
                "Curso não encontrado."
            );

            return;
        }


        courseToDeleteId =
            course.id;

        deleteCourseName.textContent =
            course.name;


        openModal(deleteModal);
    }


    /* =====================================================
       EXCLUIR / INATIVAR CURSO
    ===================================================== */

    async function deleteCourse() {

        if (!courseToDeleteId) {
            return;
        }


        try {

            const response =
                await fetch(
                    `${API_URL}/${courseToDeleteId}`,
                    {
                        method: "DELETE"
                    }
                );


            if (!response.ok) {

                const error =
                    await response.json()
                        .catch(() => null);

                console.error(error);

                throw new Error(
                    "Erro ao inativar curso."
                );
            }


            closeAllModals();


            showToast(
                "Curso inativado com sucesso."
            );


            courseToDeleteId =
                null;

            currentDetailsCourseId =
                null;


            /* -----------------------------------------------
               BUSCAR NOVAMENTE NO BANCO
            ------------------------------------------------ */

            await loadCourses();


        } catch (error) {

            console.error(error);

            showToast(
                "Não foi possível inativar o curso."
            );
        }
    }


    /* =====================================================
       SALVAR CURSO
    ===================================================== */

    async function saveCourse(event) {

        event.preventDefault();


        /* -----------------------------------------------
           DADOS
        ------------------------------------------------ */

        const name =
            courseName.value.trim();

        const description =
            courseDescription.value.trim();

        const clientName =
            courseClient.value.trim();

        const instrument =
            courseInstrument.value;


        if (
            !name ||
            !description ||
            !clientName ||
            !instrument
        ) {

            showToast(
                "Preencha todos os campos obrigatórios."
            );

            return;
        }


        /* -----------------------------------------------
           ENCONTRAR CLIENTE
        ------------------------------------------------ */

        let idCliente = null;


        try {

            const response =
                await fetch(
                    "http://localhost:8000/clientes"
                );


            if (!response.ok) {

                throw new Error(
                    "Erro ao buscar clientes."
                );
            }


            const clientes =
                await response.json();


            const cliente =
                clientes.find(
                    (item) =>
                        item.nome.toLowerCase() ===
                        clientName.toLowerCase()
                );


            if (!cliente) {

                showToast(
                    "Cliente não encontrado."
                );

                return;
            }


            idCliente =
                Number(cliente.id);


        } catch (error) {

            console.error(error);

            showToast(
                "Não foi possível buscar os clientes."
            );

            return;
        }


        /* -----------------------------------------------
           ENCONTRAR INSTRUMENTO
        ------------------------------------------------ */

        let idInstrumento = null;


        try {

            const response =
                await fetch(
                    "http://localhost:8000/instrumentos"
                );


            if (!response.ok) {

                throw new Error(
                    "Erro ao buscar instrumentos."
                );
            }


            const instrumentos =
                await response.json();


            const instrumentoEncontrado =
                instrumentos.find(
                    (item) =>
                        item.nome.toLowerCase() ===
                        instrument.toLowerCase()
                );


            if (!instrumentoEncontrado) {

                showToast(
                    "Instrumento não encontrado."
                );

                return;
            }


            idInstrumento =
                Number(
                    instrumentoEncontrado.id
                );


        } catch (error) {

            console.error(error);

            showToast(
                "Não foi possível buscar os instrumentos."
            );

            return;
        }


        /* -----------------------------------------------
           DADOS PARA A API
        ------------------------------------------------ */

        const dados = {

            nome: name,

            descricao: description,

            id_cliente: idCliente,

            id_instrumento: idInstrumento

        };


        try {

            /* -------------------------------------------
               EDITAR
            ------------------------------------------- */

            if (editingCourseId.value) {

                const response =
                    await fetch(
                        `${API_URL}/${editingCourseId.value}`,
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    dados
                                )
                        }
                    );


                if (!response.ok) {

                    const error =
                        await response.json()
                            .catch(() => null);

                    console.error(error);

                    throw new Error(
                        "Erro ao editar curso."
                    );
                }


                closeAllModals();

                showToast(
                    "Curso atualizado com sucesso."
                );


                /* ---------------------------------------
                   RECARREGAR BANCO
                --------------------------------------- */

                await loadCourses();


                currentDetailsCourseId =
                    editingCourseId.value;


                return;
            }


            /* -------------------------------------------
               NOVO CURSO
            ------------------------------------------- */

            const dadosCadastro = {

                ...dados,

                status: true

            };


            const response =
                await fetch(
                    API_URL,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                dadosCadastro
                            )
                    }
                );


            if (!response.ok) {

                const error =
                    await response.json()
                        .catch(() => null);

                console.error(error);

                throw new Error(
                    "Erro ao cadastrar curso."
                );
            }


            closeAllModals();


            showToast(
                "Curso cadastrado com sucesso."
            );


            /* -------------------------------------------
               RECARREGAR BANCO
            ------------------------------------------- */

            await loadCourses();


        } catch (error) {

            console.error(error);

            showToast(
                error.message ||
                "Não foi possível salvar o curso."
            );
        }

    }


    /* =====================================================
       UPLOAD DA FOTO
    ===================================================== */

    courseCover.addEventListener(
        "change",
        (event) => {

            const file =
                event.target.files[0];

            if (!file) {
                return;
            }


            /* ---------------------------------------------
               VERIFICAR TIPO
            --------------------------------------------- */

            if (
                !file.type.startsWith("image/")
            ) {

                showToast(
                    "Selecione um arquivo de imagem."
                );

                courseCover.value = "";

                return;
            }


            /* ---------------------------------------------
               LIMITE DE 2 MB
            --------------------------------------------- */

            const maxSize =
                2 * 1024 * 1024;


            if (file.size > maxSize) {

                showToast(
                    "A imagem deve ter no máximo 2 MB."
                );

                courseCover.value = "";

                return;
            }


            /* ---------------------------------------------
               LER IMAGEM
            --------------------------------------------- */

            const reader =
                new FileReader();


            reader.onload = () => {

                showCoverPreview(
                    reader.result
                );

            };


            reader.onerror = () => {

                showToast(
                    "Não foi possível carregar a imagem."
                );

            };


            reader.readAsDataURL(file);

        }
    );


    /* =====================================================
       REMOVER FOTO
    ===================================================== */

    removeCoverButton.addEventListener(
        "click",
        (event) => {

            event.preventDefault();

            event.stopPropagation();

            clearCover();

        }
    );


    /* =====================================================
       BOTÃO NOVO CURSO
    ===================================================== */

    newCourseButton.addEventListener(
        "click",
        openNewCourseModal
    );


    /* =====================================================
       BOTÃO DO ESTADO VAZIO
    ===================================================== */

    emptyNewCourse.addEventListener(
        "click",
        openNewCourseModal
    );


    /* =====================================================
       AÇÃO RÁPIDA
    ===================================================== */

    quickCreateCourse.addEventListener(
        "click",
        openNewCourseModal
    );


    /* =====================================================
       PESQUISA
    ===================================================== */

    courseSearch.addEventListener(
        "input",
        renderCourses
    );


    /* =====================================================
       SUBMIT DO FORMULÁRIO
    ===================================================== */

    courseForm.addEventListener(
        "submit",
        saveCourse
    );


    /* =====================================================
       CLIQUES NOS CARDS
    ===================================================== */

    courseGrid.addEventListener(
        "click",
        (event) => {

            const detailsButton =
                event.target.closest(
                    "[data-details-id]"
                );


            if (!detailsButton) {
                return;
            }


            const courseId =
                detailsButton.dataset.detailsId;


            openDetailsModal(
                courseId
            );

        }
    );


    /* =====================================================
       BOTÃO EDITAR NOS DETALHES
    ===================================================== */

    detailsEditButton.addEventListener(
        "click",
        () => {

            if (!currentDetailsCourseId) {
                return;
            }


            const courseId =
                currentDetailsCourseId;


            closeModal(
                detailsModal
            );


            setTimeout(() => {

                openEditCourseModal(
                    courseId
                );

            }, 100);

        }
    );


    /* =====================================================
       BOTÃO EXCLUIR NOS DETALHES
    ===================================================== */

    detailsDeleteButton.addEventListener(
        "click",
        () => {

            if (!currentDetailsCourseId) {
                return;
            }


            const courseId =
                currentDetailsCourseId;


            closeModal(
                detailsModal
            );


            setTimeout(() => {

                openDeleteModal(
                    courseId
                );

            }, 100);

        }
    );


    /* =====================================================
       CONFIRMAR EXCLUSÃO
    ===================================================== */

    confirmDeleteButton.addEventListener(
        "click",
        deleteCourse
    );


    /* =====================================================
       FECHAR MODAIS
    ===================================================== */

    document.addEventListener(
        "click",
        (event) => {

            const closeButton =
                event.target.closest(
                    "[data-close-modal]"
                );


            if (!closeButton) {
                return;
            }


            closeAllModals();

        }
    );


    /* =====================================================
       CLICAR NO BACKDROP
    ===================================================== */

    backdrop.addEventListener(
        "click",
        closeAllModals
    );


    /* =====================================================
       TECLA ESC
    ===================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Escape"
            ) {

                closeAllModals();

            }

        }
    );


    /* =====================================================
       TOAST
    ===================================================== */

    let toastTimeout;


    function showToast(message) {

        if (
            window.Sonora &&
            typeof window.Sonora.toast === "function"
        ) {

            window.Sonora.toast(
                message
            );

            return;
        }


        clearTimeout(
            toastTimeout
        );


        toast.textContent =
            message;

        toast.classList.add(
            "show"
        );


        toastTimeout =
            setTimeout(() => {

                toast.classList.remove(
                    "show"
                );

            }, 3000);

    }


    /* =====================================================
       INICIALIZAÇÃO
    ===================================================== */

    loadCourses();

});