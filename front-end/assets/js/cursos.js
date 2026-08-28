/* =====================================================
   SONORA — CURSOS
===================================================== */

document.addEventListener("DOMContentLoaded", () => {


    /* =================================================
       ELEMENTOS
    ================================================= */

    const newCourseButton =
        document.getElementById(
            "new-course-button"
        );


    /* =================================================
       NOVO CURSO
    ================================================= */

    if (newCourseButton) {

        newCourseButton.addEventListener(
            "click",
            () => {

                if (window.Sonora?.toast) {

                    window.Sonora.toast(
                        "Novo curso criado com sucesso."
                    );

                }

                console.log(
                    "Ação: criar novo curso"
                );

            }
        );

    }


    /* =================================================
       CURSOS
    ================================================= */

    const courseCards =
        document.querySelectorAll(
            ".course-card"
        );


    courseCards.forEach((card) => {

        card.addEventListener(
            "mouseenter",
            () => {

                card.classList.add(
                    "is-hovered"
                );

            }
        );


        card.addEventListener(
            "mouseleave",
            () => {

                card.classList.remove(
                    "is-hovered"
                );

            }
        );

    });


    /* =================================================
       AÇÕES RÁPIDAS
    ================================================= */

    const quickCreateButton =
        document.querySelector(
            ".quick-actions button"
        );


    if (quickCreateButton) {

        quickCreateButton.addEventListener(
            "click",
            () => {

                if (window.Sonora?.toast) {

                    window.Sonora.toast(
                        "Editor de cursos em breve."
                    );

                }

            }
        );

    }


});