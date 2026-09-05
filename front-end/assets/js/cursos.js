document.addEventListener("DOMContentLoaded", async () => {
    const API_URL = "http://localhost:8000/cursos";
    const INSTRUMENTOS_URL = "http://localhost:8000/instrumentos";
    const STORAGE_KEY = "sonora_cursos";

    const courseGrid = document.getElementById("course-grid");
    const courseCount = document.getElementById("course-count");
    const courseSearch = document.getElementById("course-search");

    const courseFilterButtons = document.querySelectorAll(
        "[data-status-filter]"
    );

    const emptyState = document.getElementById("empty-state");
    const newCourseButton = document.getElementById("new-course-button");
    const emptyNewCourse = document.getElementById("empty-new-course");
    const quickCreateCourse = document.getElementById("quick-create-course");

    const backdrop = document.getElementById("modal-backdrop");
    const courseModal = document.getElementById("course-modal");
    const detailsModal = document.getElementById("details-modal");
    const deleteModal = document.getElementById("delete-modal");

    const courseForm = document.getElementById("course-form");
    const courseModalTitle = document.getElementById("course-modal-title");
    const courseModalDescription = document.getElementById(
        "course-modal-description"
    );
    const saveCourseButton = document.getElementById("save-course-button");
    const editingCourseId = document.getElementById("editing-course-id");

    const courseName = document.getElementById("course-name");
    const courseDescription = document.getElementById("course-description");
    const courseClient = document.getElementById("course-client");
    const courseClientEmail = document.getElementById("course-client-email");
    const courseInstrument = document.getElementById("course-instrument");
    const courseStatusField = document.getElementById("course-status-field");
    const courseStatus = document.getElementById("course-status");

    const courseCover = document.getElementById("course-cover");
    const coverPreviewImage = document.getElementById("cover-preview-image");
    const coverPlaceholder = document.getElementById("cover-placeholder");
    const removeCoverButton = document.getElementById("remove-cover");

    const detailsCover = document.getElementById("details-cover");
    const detailsCoverImage = document.getElementById("details-cover-image");
    const detailsCoverSymbol = document.getElementById("details-cover-symbol");
    const detailsInstrument = document.getElementById("details-instrument");
    const detailsName = document.getElementById("details-name");
    const detailsDescription = document.getElementById("details-description");
    const detailsClient = document.getElementById("details-client");
    const detailsClientEmail = document.getElementById("details-client-email");
    const detailsId = document.getElementById("details-id");
    const detailsStatus = document.getElementById("details-status");
    const detailsEditButton = document.getElementById("details-edit-button");
    const detailsDeleteButton = document.getElementById(
        "details-delete-button"
    );

    const deleteCourseName = document.getElementById("delete-course-name");
    const confirmDeleteButton = document.getElementById(
        "confirm-delete-button"
    );

    const toast = document.getElementById("toast");

    let courses = [];
    let instrumentos = [];
    let pendingCoverImage = null;
    let currentDetailsCourseId = null;
    let courseToDeleteId = null;
    let currentStatusFilter = "ATIVO";

    function saveCoursesToStorage() {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(courses)
        );
    }

    function loadCoursesFromStorage() {
        const savedCourses =
            localStorage.getItem(STORAGE_KEY);

        if (!savedCourses) {
            return null;
        }

        try {
            const parsedCourses =
                JSON.parse(savedCourses);

            if (!Array.isArray(parsedCourses)) {
                return null;
            }

            return parsedCourses;
        } catch (error) {
            console.error(
                "Erro ao ler cursos do localStorage:",
                error
            );

            return null;
        }
    }

    async function loadInstrumentos() {
        try {
            const response =
                await fetch(INSTRUMENTOS_URL);

            if (!response.ok) {
                throw new Error(
                    "Erro ao buscar instrumentos."
                );
            }

            instrumentos =
                await response.json();

            courseInstrument.innerHTML = `
                <option value="">
                    Selecione um instrumento
                </option>
            `;

            instrumentos.forEach(instrumento => {
                const option =
                    document.createElement("option");

                option.value =
                    instrumento.id;

                option.textContent =
                    instrumento.nome;

                courseInstrument.appendChild(option);
            });
        } catch (error) {
            console.error(
                "Erro ao carregar instrumentos:",
                error
            );

            courseInstrument.innerHTML = `
                <option value="">
                    Erro ao carregar instrumentos
                </option>
            `;
        }
    }

    function normalizeCourse(course) {
        return {
            id: course.id,

            name:
                course.name ||
                course.nome ||
                "Curso sem nome",

            description:
                course.description ||
                course.descricao ||
                "Sem descrição.",

            client:
                course.client ||
                course.cliente?.nome ||
                "Cliente não informado",

            clientId:
                course.clientId ||
                course.cliente?.id ||
                null,

            clientEmail:
                course.clientEmail ||
                course.emailCliente ||
                course.cliente?.email ||
                "",

            instrument:
                course.instrument ||
                course.instrumento?.nome ||
                "Outro",

            instrumentId:
                course.instrumentId ||
                course.instrumento?.id ||
                null,

            coverImage:
                course.coverImage ||
                null,

            status:
                typeof course.status === "string"
                    ? course.status.toUpperCase() === "INATIVO"
                        ? "INATIVO"
                        : "ATIVO"
                    : course.status === false
                        ? "INATIVO"
                        : "ATIVO"
        };
    }

    async function loadCourses() {
        const savedCourses =
            loadCoursesFromStorage();

        if (savedCourses !== null) {
            courses =
                savedCourses.map(normalizeCourse);

            renderCourses();

            return;
        }

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

            saveCoursesToStorage();

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

    function escapeHtml(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

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

    function renderCourses() {
        const searchTerm =
            courseSearch.value
                .trim()
                .toLowerCase();

        const filteredCourses =
            courses.filter(course => {
                const searchableText = [
                    course.name,
                    course.description,
                    course.client,
                    course.instrument,
                    course.status
                ]
                    .join(" ")
                    .toLowerCase();

                return (
                    course.status === currentStatusFilter &&
                    searchableText.includes(searchTerm)
                );
            });

        courseCount.textContent =
            `${filteredCourses.length} ${
                filteredCourses.length === 1
                    ? "curso"
                    : "cursos"
            }`;

        courseGrid.innerHTML = "";

        if (filteredCourses.length === 0) {
            emptyState.hidden = false;

            return;
        }

        emptyState.hidden = true;

        filteredCourses.forEach(course => {
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
                            ${
                                course.status === "ATIVO"
                                    ? "Curso ativo"
                                    : "Curso inativo"
                            }
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

    function openModal(modal) {
        closeAllModals();

        modal.hidden = false;

        backdrop.hidden = false;

        document.body.classList.add(
            "modal-open"
        );
    }

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

    function closeAllModals() {
        courseModal.hidden = true;

        detailsModal.hidden = true;

        deleteModal.hidden = true;

        backdrop.hidden = true;

        document.body.classList.remove(
            "modal-open"
        );
    }

    function clearCover() {
        pendingCoverImage = null;

        courseCover.value = "";

        coverPreviewImage.src = "";

        coverPreviewImage.hidden = true;

        coverPlaceholder.hidden = false;

        removeCoverButton.hidden = true;
    }

    function showCoverPreview(image) {
        pendingCoverImage = image;

        coverPreviewImage.src = image;

        coverPreviewImage.hidden = false;

        coverPlaceholder.hidden = true;

        removeCoverButton.hidden = false;
    }

    function openNewCourseModal() {
        courseForm.reset();

        editingCourseId.value = "";

        courseStatus.value = "ATIVO";

        courseStatusField.hidden = true;

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

    function openEditCourseModal(courseId) {
        const course =
            courses.find(
                item =>
                    Number(item.id) ===
                    Number(courseId)
            );

        if (!course) {
            showToast(
                "Curso não encontrado."
            );

            return;
        }

        editingCourseId.value =
            course.id;

        courseName.value =
            course.name;

        courseDescription.value =
            course.description;

        courseClient.value =
            course.client;

        courseClientEmail.value =
            course.clientEmail || "";

        courseInstrument.value =
            course.instrumentId || "";

        courseStatus.value =
            course.status || "ATIVO";

        courseStatusField.hidden = false;

        courseModalTitle.textContent =
            "Editar curso";

        courseModalDescription.textContent =
            "Altere as informações do curso.";

        saveCourseButton.textContent =
            "Salvar alterações";

        clearCover();

        if (course.coverImage) {
            showCoverPreview(
                course.coverImage
            );
        }

        openModal(courseModal);

        setTimeout(() => {
            courseName.focus();
        }, 100);
    }

    function openDetailsModal(courseId) {
        const course =
            courses.find(
                item =>
                    Number(item.id) ===
                    Number(courseId)
            );

        if (!course) {
            showToast(
                "Curso não encontrado."
            );

            return;
        }

        currentDetailsCourseId =
            course.id;

        detailsInstrument.textContent =
            `${course.instrument} · CURSO`;

        detailsName.textContent =
            course.name;

        detailsDescription.textContent =
            course.description;

        detailsClient.textContent =
            course.client;

        detailsClientEmail.textContent =
            course.clientEmail || "Não informado";

        detailsId.textContent =
            course.id;

        detailsStatus.textContent =
            course.status;

        detailsDeleteButton.textContent =
            course.status === "INATIVO"
                ? "Ativar curso"
                : "Inativar curso";

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

    function openDeleteModal(courseId) {
        const course =
            courses.find(
                item =>
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

    function deleteCourse() {
        if (!courseToDeleteId) {
            return;
        }

        const courseIndex =
            courses.findIndex(
                item =>
                    Number(item.id) ===
                    Number(courseToDeleteId)
            );

        if (courseIndex === -1) {
            showToast(
                "Curso não encontrado."
            );

            return;
        }

        courses[courseIndex].status =
            "INATIVO";

        saveCoursesToStorage();

        closeAllModals();

        showToast(
            "Curso inativado com sucesso."
        );

        courseToDeleteId = null;
        currentDetailsCourseId = null;

        renderCourses();
    }

    function activateCourse(courseId) {
        const courseIndex =
            courses.findIndex(
                item =>
                    Number(item.id) ===
                    Number(courseId)
            );

        if (courseIndex === -1) {
            showToast(
                "Curso não encontrado."
            );

            return;
        }

        courses[courseIndex].status =
            "ATIVO";

        saveCoursesToStorage();

        closeAllModals();

        showToast(
            "Curso ativado com sucesso."
        );

        currentDetailsCourseId = null;

        renderCourses();
    }

    function generateCourseId() {
        const numericIds =
            courses
                .map(course =>
                    Number(course.id)
                )
                .filter(id =>
                    Number.isFinite(id)
                );

        if (numericIds.length === 0) {
            return 1;
        }

        return (
            Math.max(...numericIds) + 1
        );
    }

    function saveCourse(event) {
        event.preventDefault();

        const name =
            courseName.value.trim();

        const description =
            courseDescription.value.trim();

        const clientName =
            courseClient.value.trim();

        const clientEmail =
            courseClientEmail.value.trim();

        const instrumentId =
            Number(courseInstrument.value);

        const selectedInstrument =
            instrumentos.find(
                instrumento =>
                    Number(instrumento.id) ===
                    instrumentId
            );

        const instrument =
            selectedInstrument
                ? selectedInstrument.nome
                : "";

        const status =
            courseStatus.value;

        if (
            !name ||
            !description ||
            !clientName ||
            !clientEmail ||
            !instrument
        ) {
            showToast(
                "Preencha todos os campos obrigatórios."
            );

            return;
        }

        if (editingCourseId.value) {
            const courseIndex =
                courses.findIndex(
                    item =>
                        Number(item.id) ===
                        Number(editingCourseId.value)
                );

            if (courseIndex === -1) {
                showToast(
                    "Curso não encontrado."
                );

                return;
            }

            courses[courseIndex] = {
                ...courses[courseIndex],

                name: name,

                description: description,

                client: clientName,

                clientEmail: clientEmail,

                instrument: instrument,

                instrumentId: instrumentId,

                coverImage:
                    pendingCoverImage || null,

                status: status
            };

            saveCoursesToStorage();

            closeAllModals();

            showToast(
                "Curso atualizado com sucesso."
            );

            currentDetailsCourseId =
                editingCourseId.value;

            editingCourseId.value = "";

            renderCourses();

            return;
        }

        const newCourse = {
            id: generateCourseId(),

            name: name,

            description: description,

            client: clientName,

            clientEmail: clientEmail,

            clientId: null,

            instrument: instrument,

            instrumentId: instrumentId,

            coverImage:
                pendingCoverImage || null,

            status: "ATIVO"
        };

        courses.unshift(newCourse);

        saveCoursesToStorage();

        closeAllModals();

        showToast(
            "Curso cadastrado com sucesso."
        );

        renderCourses();
    }

    courseCover.addEventListener(
        "change",
        event => {
            const file =
                event.target.files[0];

            if (!file) {
                return;
            }

            if (!file.type.startsWith("image/")) {
                showToast(
                    "Selecione um arquivo de imagem."
                );

                courseCover.value = "";

                return;
            }

            const maxSize =
                2 * 1024 * 1024;

            if (file.size > maxSize) {
                showToast(
                    "A imagem deve ter no máximo 2 MB."
                );

                courseCover.value = "";

                return;
            }

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

    removeCoverButton.addEventListener(
        "click",
        event => {
            event.preventDefault();

            event.stopPropagation();

            pendingCoverImage = null;

            courseCover.value = "";

            coverPreviewImage.src = "";

            coverPreviewImage.hidden = true;

            coverPlaceholder.hidden = false;

            removeCoverButton.hidden = true;
        }
    );

    newCourseButton.addEventListener(
        "click",
        openNewCourseModal
    );

    emptyNewCourse.addEventListener(
        "click",
        openNewCourseModal
    );

    quickCreateCourse.addEventListener(
        "click",
        openNewCourseModal
    );

    courseSearch.addEventListener(
        "input",
        renderCourses
    );

    courseFilterButtons.forEach(button => {
        button.addEventListener("click", () => {
            currentStatusFilter =
                button.dataset.statusFilter;

            courseFilterButtons.forEach(filterButton => {
                const isActive =
                    filterButton === button;

                filterButton.classList.toggle(
                    "active",
                    isActive
                );

                filterButton.setAttribute(
                    "aria-pressed",
                    String(isActive)
                );
            });

            renderCourses();
        });
    });

    courseForm.addEventListener(
        "submit",
        saveCourse
    );

    courseGrid.addEventListener(
        "click",
        event => {
            const detailsButton =
                event.target.closest(
                    "[data-details-id]"
                );

            if (!detailsButton) {
                return;
            }

            const courseId =
                detailsButton.dataset.detailsId;

            openDetailsModal(courseId);
        }
    );

    detailsEditButton.addEventListener(
        "click",
        () => {
            if (!currentDetailsCourseId) {
                return;
            }

            const courseId =
                currentDetailsCourseId;

            closeModal(detailsModal);

            setTimeout(() => {
                openEditCourseModal(
                    courseId
                );
            }, 100);
        }
    );

    detailsDeleteButton.addEventListener(
        "click",
        () => {
            if (!currentDetailsCourseId) {
                return;
            }

            const courseId =
                currentDetailsCourseId;

            const course =
                courses.find(
                    item =>
                        Number(item.id) ===
                        Number(courseId)
                );

            if (!course) {
                showToast(
                    "Curso não encontrado."
                );

                return;
            }

            if (course.status === "INATIVO") {
                activateCourse(courseId);

                return;
            }

            closeModal(detailsModal);

            setTimeout(() => {
                openDeleteModal(
                    courseId
                );
            }, 100);
        }
    );

    confirmDeleteButton.addEventListener(
        "click",
        deleteCourse
    );

    document.addEventListener(
        "click",
        event => {
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

    backdrop.addEventListener(
        "click",
        closeAllModals
    );

    document.addEventListener(
        "keydown",
        event => {
            if (event.key === "Escape") {
                closeAllModals();
            }
        }
    );

    let toastTimeout;

    function showToast(message) {
        if (
            window.Sonora &&
            typeof window.Sonora.toast === "function"
        ) {
            window.Sonora.toast(message);

            return;
        }

        clearTimeout(toastTimeout);

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

    await loadInstrumentos();

    loadCourses();
});