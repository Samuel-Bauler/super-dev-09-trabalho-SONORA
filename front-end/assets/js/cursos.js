document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       CONFIGURAÇÃO
    ===================================================== */

    const STORAGE_KEY = "sonora_courses_v1";

    const defaultCourses = [
        {
            id: "curso-001",
            name: "Fundamentos do violão",
            description:
                "Aprenda os principais acordes, ritmos e técnicas para começar a tocar violão.",
            client: "Escola Sonora",
            instrument: "Violão",
            coverImage: null,
            status: "ATIVO"
        },

        {
            id: "curso-002",
            name: "Harmonia e improviso",
            description:
                "Explore acordes, escalas e conceitos de harmonia para desenvolver sua improvisação.",
            client: "Instituto Musical",
            instrument: "Piano",
            coverImage: null,
            status: "ATIVO"
        },

        {
            id: "curso-003",
            name: "A voz em movimento",
            description:
                "Técnicas de respiração, afinação e interpretação para desenvolver sua voz.",
            client: "Studio Sonora",
            instrument: "Canto",
            coverImage: null,
            status: "ATIVO"
        }
    ];


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

    let courses = loadCourses();

    let pendingCoverImage = null;

    let currentDetailsCourseId = null;

    let courseToDeleteId = null;


    /* =====================================================
       NORMALIZAR CURSO
    ===================================================== */

    function normalizeCourse(course, index) {

        return {
            id:
                course.id ||
                `curso-${Date.now()}-${index}`,

            name:
                course.name ||
                course.title ||
                "Curso sem nome",

            description:
                course.description ||
                course.shortDescription ||
                "Sem descrição.",

            client:
                course.client ||
                course.clientName ||
                "Cliente não informado",

            instrument:
                course.instrument ||
                "Outro",

            coverImage:
                course.coverImage ||
                course.image ||
                course.cover ||
                null,

            status:
                course.status ||
                "ATIVO"
        };
    }


    /* =====================================================
       CARREGAR CURSOS
    ===================================================== */

    function loadCourses() {

        try {

            const saved =
                localStorage.getItem(STORAGE_KEY);

            if (!saved) {

                localStorage.setItem(
                    STORAGE_KEY,
                    JSON.stringify(defaultCourses)
                );

                return [...defaultCourses];
            }

            const parsed =
                JSON.parse(saved);

            /*
             * Se existir um array vazio de uma versão
             * anterior, recuperamos os cursos padrão.
             */

            if (
                !Array.isArray(parsed) ||
                parsed.length === 0
            ) {

                localStorage.setItem(
                    STORAGE_KEY,
                    JSON.stringify(defaultCourses)
                );

                return [...defaultCourses];
            }

            return parsed.map(normalizeCourse);

        } catch (error) {

            console.error(
                "Erro ao carregar cursos:",
                error
            );

            return [...defaultCourses];
        }
    }


    /* =====================================================
       SALVAR CURSOS
    ===================================================== */

    function saveCourses() {

        try {

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(courses)
            );

            return true;

        } catch (error) {

            console.error(
                "Erro ao salvar cursos:",
                error
            );

            showToast(
                "Não foi possível salvar os dados no navegador."
            );

            return false;
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
       GERAR ID
    ===================================================== */

    function generateCourseId() {

        if (
            window.crypto &&
            typeof window.crypto.randomUUID === "function"
        ) {

            return `curso-${window.crypto.randomUUID()}`;
        }

        return `curso-${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 8)}`;
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

                return searchableText.includes(searchTerm);
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
                getInstrumentClass(course.instrument);

            const symbol =
                getInstrumentSymbol(course.instrument);

            const initials =
                getInitials(course.client);


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


            const card = document.createElement("article");

            card.className = "course-card";

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
                            Curso ativo
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
       ABRIR MODAL DE NOVO CURSO
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
       ABRIR MODAL DE EDIÇÃO
    ===================================================== */

    function openEditCourseModal(courseId) {

        const course =
            courses.find(
                (item) => item.id === courseId
            );

        if (!course) {

            showToast(
                "Curso não encontrado."
            );

            return;
        }


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

        if (course.coverImage) {

            showCoverPreview(
                course.coverImage
            );

        } else {

            clearCover();
        }


        /* -----------------------------------------------
           ABRIR
        ------------------------------------------------ */

        openModal(courseModal);

        setTimeout(() => {

            courseName.focus();

        }, 100);

    }


    /* =====================================================
       ABRIR DETALHES
    ===================================================== */

    function openDetailsModal(courseId) {

        const course =
            courses.find(
                (item) => item.id === courseId
            );

        if (!course) {

            showToast(
                "Curso não encontrado."
            );

            return;
        }


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


        if (course.coverImage) {

            detailsCover.classList.add(
                "has-image"
            );

            detailsCoverImage.src =
                course.coverImage;

            detailsCoverImage.alt =
                `Capa do curso ${course.name}`;

            detailsCoverImage.hidden =
                false;

        } else {

            detailsCoverImage.src = "";

            detailsCoverImage.hidden =
                true;

        }


        openModal(detailsModal);

    }


    /* =====================================================
       ABRIR CONFIRMAÇÃO DE EXCLUSÃO
    ===================================================== */

    function openDeleteModal(courseId) {

        const course =
            courses.find(
                (item) => item.id === courseId
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
       EXCLUIR CURSO
    ===================================================== */

    function deleteCourse() {

        if (!courseToDeleteId) {
            return;
        }


        const course =
            courses.find(
                (item) =>
                    item.id === courseToDeleteId
            );


        courses =
            courses.filter(
                (item) =>
                    item.id !== courseToDeleteId
            );


        saveCourses();

        renderCourses();

        closeAllModals();

        showToast(
            `Curso "${course?.name || ""}" excluído com sucesso.`
        );


        courseToDeleteId =
            null;

        currentDetailsCourseId =
            null;

    }


    /* =====================================================
       SALVAR CURSO
    ===================================================== */

    function saveCourse(event) {

        event.preventDefault();


        /* -----------------------------------------------
           DADOS
        ------------------------------------------------ */

        const name =
            courseName.value.trim();

        const description =
            courseDescription.value.trim();

        const client =
            courseClient.value.trim();

        const instrument =
            courseInstrument.value;


        if (
            !name ||
            !description ||
            !client ||
            !instrument
        ) {

            showToast(
                "Preencha todos os campos obrigatórios."
            );

            return;
        }


        /* -----------------------------------------------
           EDITAR
        ------------------------------------------------ */

        if (editingCourseId.value) {

            const index =
                courses.findIndex(
                    (course) =>
                        course.id ===
                        editingCourseId.value
                );


            if (index === -1) {

                showToast(
                    "Curso não encontrado."
                );

                return;
            }


            const oldCourse =
                courses[index];


            courses[index] = {

                ...oldCourse,

                name,
                description,
                client,
                instrument,

                /*
                 * Se o usuário escolheu uma nova imagem,
                 * usamos a nova.
                 *
                 * Caso contrário, mantemos a imagem antiga.
                 */

                coverImage:
                    pendingCoverImage !== null
                        ? pendingCoverImage
                        : oldCourse.coverImage

            };


            saveCourses();

            renderCourses();

            closeAllModals();

            showToast(
                "Curso atualizado com sucesso."
            );


            currentDetailsCourseId =
                editingCourseId.value;


            return;
        }


        /* -----------------------------------------------
           NOVO CURSO
        ------------------------------------------------ */

        const newCourse = {

            id: generateCourseId(),

            name,

            description,

            client,

            instrument,

            coverImage:
                pendingCoverImage,

            status:
                "ATIVO"

        };


        courses.unshift(
            newCourse
        );


        saveCourses();

        renderCourses();

        closeAllModals();

        showToast(
            "Curso cadastrado com sucesso."
        );

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

            if (!file.type.startsWith("image/")) {

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

    renderCourses();

});