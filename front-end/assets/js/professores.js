document.addEventListener("DOMContentLoaded", () => {


    /* =====================================================
       ELEMENTOS
    ====================================================== */

    const searchInput =
        document.getElementById("teacher-search");


    const statusFilter =
        document.getElementById("teacher-status-filter");


    const courseFilter =
        document.getElementById("teacher-course-filter");


    const teachersList =
        document.getElementById("teachers-list");


    const emptyState =
        document.getElementById("empty-state");


    const counter =
        document.getElementById("teachers-counter");


    const newTeacherButton =
        document.getElementById("new-teacher-button");


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


    const teacherEmail =
        document.getElementById("teacher-email");


    const teacherInstrument =
        document.getElementById("teacher-instrument");


    const teacherStudents =
        document.getElementById("teacher-students");


    const teacherStatus =
        document.getElementById("teacher-status");


    const rows =
        Array.from(
            teachersList.querySelectorAll("tr")
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


        toast.textContent =
            message;


        toast.classList.add("show");


        clearTimeout(
            window.teacherToastTimer
        );


        window.teacherToastTimer =
            setTimeout(() => {

                toast.classList.remove("show");

            }, 3000);

    }



    /* =====================================================
       ABRIR MODAL
    ====================================================== */

    function openTeacherModal() {

        teacherModal.hidden = false;

        document.body.style.overflow = "hidden";

        setTimeout(() => {

            teacherName.focus();

        }, 100);

    }



    /* =====================================================
       FECHAR MODAL
    ====================================================== */

    function closeModal() {

        teacherModal.hidden = true;

        document.body.style.overflow = "";

        teacherForm.reset();

        teacherStudents.value = "0";

        teacherStatus.value = "active";

    }



    /* =====================================================
       EVENTOS DO MODAL
    ====================================================== */

    newTeacherButton.addEventListener(
        "click",
        openTeacherModal
    );


    closeTeacherModal.addEventListener(
        "click",
        closeModal
    );


    cancelTeacherModal.addEventListener(
        "click",
        closeModal
    );



    /* =====================================================
       FECHAR CLICANDO FORA
    ====================================================== */

    teacherModal.addEventListener(
        "click",
        event => {

            if (
                event.target === teacherModal
            ) {

                closeModal();

            }

        }
    );



    /* =====================================================
       FECHAR COM ESC
    ====================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                !teacherModal.hidden
            ) {

                closeModal();

            }

        }
    );



    /* =====================================================
       FILTRAR PROFESSORES
    ====================================================== */

    function filterTeachers() {

        const search =
            searchInput.value
                .trim()
                .toLowerCase();


        const status =
            statusFilter.value;


        const course =
            courseFilter.value;


        const currentRows =
            Array.from(
                teachersList.querySelectorAll("tr")
            );


        let visibleCount = 0;


        currentRows.forEach(row => {

            const name =
                (
                    row.dataset.name ||
                    ""
                ).toLowerCase();


            const email =
                (
                    row.dataset.email ||
                    ""
                ).toLowerCase();


            const rowStatus =
                row.dataset.status ||
                "";


            const rowCourse =
                row.dataset.course ||
                "";


            const matchesSearch =
                !search ||
                name.includes(search) ||
                email.includes(search);


            const matchesStatus =
                status === "all" ||
                rowStatus === status;


            const matchesCourse =
                course === "all" ||
                rowCourse === course;


            const visible =
                matchesSearch &&
                matchesStatus &&
                matchesCourse;


            row.style.display =
                visible
                    ? ""
                    : "none";


            if (visible) {
                visibleCount++;
            }

        });



        /* CONTADOR */

        counter.textContent =
            `${visibleCount} ${
                visibleCount === 1
                    ? "professor"
                    : "professores"
            }`;



        /* ESTADO VAZIO */

        emptyState.hidden =
            visibleCount !== 0;

    }



    /* =====================================================
       EVENTOS DE BUSCA
    ====================================================== */

    searchInput.addEventListener(
        "input",
        filterTeachers
    );


    statusFilter.addEventListener(
        "change",
        filterTeachers
    );


    courseFilter.addEventListener(
        "change",
        filterTeachers
    );



    /* =====================================================
       GERAR INICIAIS
    ====================================================== */

    function getInitials(name) {

        const parts =
            name
                .trim()
                .split(/\s+/);


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



    /* =====================================================
       CLASSE DO INSTRUMENTO
    ====================================================== */

    function getInstrumentClass(instrument) {

        switch (instrument) {

            case "violao":
                return {
                    name: "Violão",
                    tag: "green-tag",
                    avatar: "avatar-green"
                };


            case "piano":
                return {
                    name: "Piano",
                    tag: "blue-tag",
                    avatar: "avatar-blue"
                };


            case "canto":
                return {
                    name: "Canto",
                    tag: "rose-tag",
                    avatar: "avatar-rose"
                };


            case "guitarra":
                return {
                    name: "Guitarra",
                    tag: "purple-tag",
                    avatar: "avatar-purple"
                };


            case "bateria":
                return {
                    name: "Bateria",
                    tag: "sand-tag",
                    avatar: "avatar-sand"
                };


            case "violino":
                return {
                    name: "Violino",
                    tag: "purple-tag",
                    avatar: "avatar-purple"
                };


            default:
                return {
                    name: instrument,
                    tag: "green-tag",
                    avatar: "avatar-green"
                };

        }

    }



    /* =====================================================
       CRIAR LINHA
    ====================================================== */

    function createTeacherRow(
        name,
        email,
        instrument,
        students,
        status
    ) {

        const instrumentInfo =
            getInstrumentClass(
                instrument
            );


        const initials =
            getInitials(name);


        const statusText =
            status === "active"
                ? "Ativo"
                : "Inativo";


        const row =
            document.createElement("tr");


        row.dataset.name =
            name;


        row.dataset.email =
            email;


        row.dataset.status =
            status;


        row.dataset.course =
            instrument;


        row.innerHTML = `

            <td>

                <div class="teacher-person">

                    <span
                        class="teacher-avatar ${instrumentInfo.avatar}"
                    >
                        ${initials}
                    </span>

                    <div>

                        <strong>
                            ${name}
                        </strong>

                        <small>
                            ${email}
                        </small>

                    </div>

                </div>

            </td>


            <td>

                <span
                    class="specialty-tag ${instrumentInfo.tag}"
                >
                    ${instrumentInfo.name}
                </span>

            </td>


            <td>
                ${students} alunos
            </td>


            <td>

                <span
                    class="status ${
                        status === "active"
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

                    <button
                        type="button"
                        class="teacher-action"
                        data-action="view"
                        title="Visualizar"
                    >
                        ◉
                    </button>

                    <button
                        type="button"
                        class="teacher-action"
                        data-action="edit"
                        title="Editar"
                    >
                        ✎
                    </button>

                    <button
                        type="button"
                        class="teacher-action"
                        data-action="more"
                        title="Mais opções"
                    >
                        ⋮
                    </button>

                </div>

            </td>

        `;


        return row;

    }



    /* =====================================================
       CADASTRAR PROFESSOR
    ====================================================== */

    teacherForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const name =
                teacherName.value.trim();


            const email =
                teacherEmail.value.trim();


            const instrument =
                teacherInstrument.value;


            const students =
                Number(
                    teacherStudents.value
                );


            const status =
                teacherStatus.value;



            /* VALIDAÇÃO */

            if (!name) {

                showToast(
                    "Digite o nome do professor."
                );

                teacherName.focus();

                return;

            }


            if (!email) {

                showToast(
                    "Digite o e-mail do professor."
                );

                teacherEmail.focus();

                return;

            }


            if (!instrument) {

                showToast(
                    "Selecione um instrumento."
                );

                teacherInstrument.focus();

                return;

            }


            if (students < 0) {

                showToast(
                    "A quantidade de alunos não pode ser negativa."
                );

                teacherStudents.focus();

                return;

            }



            /* VERIFICAR E-MAIL DUPLICADO */

            const existingRows =
                Array.from(
                    teachersList.querySelectorAll("tr")
                );


            const emailExists =
                existingRows.some(row => {

                    return (
                        row.dataset.email &&
                        row.dataset.email.toLowerCase() ===
                        email.toLowerCase()
                    );

                });


            if (emailExists) {

                showToast(
                    "Já existe um professor com este e-mail."
                );

                teacherEmail.focus();

                return;

            }



            /* CRIAR LINHA */

            const row =
                createTeacherRow(
                    name,
                    email,
                    instrument,
                    students,
                    status
                );


            teachersList.appendChild(row);



            /* FECHAR MODAL */

            closeModal();



            /* ATUALIZAR */

            filterTeachers();



            /* MENSAGEM */

            showToast(
                `${name} foi cadastrado com sucesso.`
            );

        }
    );



    /* =====================================================
       AÇÕES DA TABELA
    ====================================================== */

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


            const row =
                button.closest("tr");


            if (!row) {
                return;
            }


            const action =
                button.dataset.action;


            const name =
                row.dataset.name;



            if (action === "view") {

                showToast(
                    `Visualizando ${name}.`
                );

            }



            if (action === "edit") {

                showToast(
                    `Editando ${name}.`
                );

            }



            if (action === "more") {

                showToast(
                    `Mais opções para ${name}.`
                );

            }

        }
    );



    /* =====================================================
       INICIALIZAÇÃO
    ====================================================== */

    filterTeachers();

});