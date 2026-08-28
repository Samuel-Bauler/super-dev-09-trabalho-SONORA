/* =========================================================
   PROFESSORES — JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

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

    const quickNewTeacher =
        document.getElementById("quick-new-teacher");

    const rows =
        Array.from(
            teachersList.querySelectorAll("tr")
        );


    /* =====================================================
       TOAST
    ====================================================== */

    function showToast(message) {

        let toast =
            document.getElementById("toast");

        if (!toast) {
            return;
        }

        toast.textContent = message;

        toast.classList.add("show");

        clearTimeout(window.teacherToastTimer);

        window.teacherToastTimer =
            setTimeout(() => {

                toast.classList.remove("show");

            }, 3000);
    }


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

        let visibleCount = 0;


        rows.forEach(row => {

            const name =
                (row.dataset.name || "")
                    .toLowerCase();

            const email =
                (row.dataset.email || "")
                    .toLowerCase();

            const rowStatus =
                row.dataset.status || "";

            const rowCourse =
                row.dataset.course || "";


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
                visible ? "" : "none";


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

        if (visibleCount === 0) {

            emptyState.hidden = false;

        } else {

            emptyState.hidden = true;

        }

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
       NOVO PROFESSOR
    ====================================================== */

    function createTeacher() {

        showToast(
            "Editor de professores em breve."
        );

    }


    if (newTeacherButton) {

        newTeacherButton.addEventListener(
            "click",
            createTeacher
        );

    }


    if (quickNewTeacher) {

        quickNewTeacher.addEventListener(
            "click",
            createTeacher
        );

    }


    /* =====================================================
       INICIALIZAÇÃO
    ====================================================== */

    filterTeachers();

});