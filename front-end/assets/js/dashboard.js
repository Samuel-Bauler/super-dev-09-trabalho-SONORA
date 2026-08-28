/* =====================================================
   SONORA — GLOBAL JS
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* =================================================
       ELEMENTOS
    ================================================= */

    const toast = document.getElementById("toast");

    const adminButton =
        document.getElementById("admin-button");

    const adminMenu =
        document.getElementById("admin-menu");

    const logoutButton =
        document.getElementById("logout-button");

    const searchButton =
        document.getElementById("search-button");

    const notificationButton =
        document.getElementById("notification-button");


    /* =================================================
       PÁGINA ATUAL
    ================================================= */

    function setActivePage() {

        const currentPage =
            window.location.pathname
                .split("/")
                .pop()
                .replace(".html", "");

        const navItems =
            document.querySelectorAll(".nav-item");

        navItems.forEach((item) => {

            const page =
                item.dataset.page;

            if (page === currentPage) {
                item.classList.add("active");
            } else {
                item.classList.remove("active");
            }

        });

    }

    setActivePage();


    /* =================================================
       TÍTULO DA PÁGINA
    ================================================= */

    function setPageTitle() {

        const title =
            document.getElementById("page-title");

        if (!title) {
            return;
        }

        const currentPage =
            window.location.pathname
                .split("/")
                .pop()
                .replace(".html", "");

        const titles = {
            cursos: "Cursos",
            clientes: "Clientes",
            professores: "Professores",
            instrumentos: "Instrumentos",
            aulas: "Aulas"
        };

        if (titles[currentPage]) {
            title.textContent =
                titles[currentPage];
        }

    }

    setPageTitle();


    /* =================================================
       TOAST
    ================================================= */

    let toastTimeout;

    function showToast(message) {

        if (!toast) {
            return;
        }

        clearTimeout(toastTimeout);

        toast.textContent = message;

        toast.classList.add("show");

        toastTimeout = setTimeout(() => {

            toast.classList.remove("show");

        }, 3000);

    }


    /* =================================================
       BOTÕES COM DATA-TOAST
    ================================================= */

    document.addEventListener("click", (event) => {

        const button =
            event.target.closest("[data-toast]");

        if (!button) {
            return;
        }

        const message =
            button.dataset.toast;

        showToast(message);

    });


    /* =================================================
       MENU DO ADMINISTRADOR
    ================================================= */

    if (adminButton && adminMenu) {

        adminButton.addEventListener("click", (event) => {

            event.stopPropagation();

            const isOpen =
                !adminMenu.hasAttribute("hidden");

            if (isOpen) {
                adminMenu.setAttribute("hidden", "");
            } else {
                adminMenu.removeAttribute("hidden");
            }

        });


        document.addEventListener("click", (event) => {

            if (
                !adminMenu.contains(event.target) &&
                !adminButton.contains(event.target)
            ) {
                adminMenu.setAttribute("hidden", "");
            }

        });

    }


    /* =================================================
       LOGOUT
    ================================================= */

    if (logoutButton) {

        logoutButton.addEventListener("click", () => {

            showToast("Sessão encerrada.");

            setTimeout(() => {

                // Futuramente:
                // window.location.href = "login.html";

            }, 1000);

        });

    }


    /* =================================================
       PESQUISA
    ================================================= */

    if (searchButton) {

        searchButton.addEventListener("click", () => {

            showToast("Pesquisa em breve.");

        });

    }


    /* =================================================
       NOTIFICAÇÕES
    ================================================= */

    if (notificationButton) {

        notificationButton.addEventListener("click", () => {

            showToast("Você não possui novas notificações.");

        });

    }


    /* =================================================
       LINKS INTERNOS
    ================================================= */

    const navItems =
        document.querySelectorAll(
            ".nav-item"
        );

    navItems.forEach((item) => {

        item.addEventListener("click", () => {

            navItems.forEach((nav) => {
                nav.classList.remove("active");
            });

            item.classList.add("active");

        });

    });


    /* =================================================
       EXPOR TOAST GLOBALMENTE
    ================================================= */

    window.Sonora = {

        toast: showToast

    };

});