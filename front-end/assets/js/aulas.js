document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       CONFIGURAÇÕES
    ====================================================== */

    const days = [
        "Segunda",
        "Terça",
        "Quarta",
        "Quinta",
        "Sexta",
        "Sábado",
        "Domingo"
    ];


    /*
        HORÁRIOS DO CALENDÁRIO

        O calendário começa às 08:00
        e vai até às 19:00.

        Cada linha representa 1 hora.

        08:00
        09:00
        10:00
        11:00
        ...
        19:00
    */

    const times = Array.from(
        { length: 12 },
        (_, index) => {

            return `${String(
                8 + index
            ).padStart(2, "0")}:00`;

        }
    );


    /* =====================================================
       CORES DOS INSTRUMENTOS
    ====================================================== */

    const styleByInstrument = {

        Violão: "guitar",

        Piano: "piano",

        Canto: "vocal",

        Bateria: "drums",

        Teclado: "keyboard",

        Guitarra: "guitar-blue"

    };


    /* =====================================================
       DADOS DAS AULAS
    ====================================================== */

    let classes = [

        {
            id: 1,

            student:
                "Mariana Oliveira",

            email:
                "mariana@email.com",

            instrument:
                "Violão",

            teacher:
                "Ricardo Nunes",

            day:
                "Segunda",

            time:
                "09:00",

            duration:
                "60"
        },


        {
            id: 2,

            student:
                "Lucas Martins",

            email:
                "lucas@email.com",

            instrument:
                "Piano",

            teacher:
                "Helena Martins",

            day:
                "Segunda",

            time:
                "10:30",

            duration:
                "45"
        },


        {
            id: 3,

            student:
                "Beatriz Souza",

            email:
                "beatriz@email.com",

            instrument:
                "Canto",

            teacher:
                "Carolina Freitas",

            day:
                "Terça",

            time:
                "14:00",

            duration:
                "60"
        },


        {
            id: 4,

            student:
                "Pedro Henrique",

            email:
                "pedro@email.com",

            instrument:
                "Violão",

            teacher:
                "Ricardo Nunes",

            day:
                "Terça",

            time:
                "16:00",

            duration:
                "45"
        },


        {
            id: 5,

            student:
                "Camila Ferreira",

            email:
                "camila@email.com",

            instrument:
                "Piano",

            teacher:
                "Helena Martins",

            day:
                "Quarta",

            time:
                "08:30",

            duration:
                "60"
        },


        {
            id: 6,

            student:
                "Rafael Almeida",

            email:
                "rafael@email.com",

            instrument:
                "Bateria",

            teacher:
                "Eduardo Lima",

            day:
                "Quarta",

            time:
                "15:30",

            duration:
                "90"
        },


        {
            id: 7,

            student:
                "Juliana Costa",

            email:
                "juliana@email.com",

            instrument:
                "Teclado",

            teacher:
                "Paula Vieira",

            day:
                "Quinta",

            time:
                "11:00",

            duration:
                "60"
        },


        {
            id: 8,

            student:
                "Gabriel Santos",

            email:
                "gabriel@email.com",

            instrument:
                "Guitarra",

            teacher:
                "Mateus Rocha",

            day:
                "Sexta",

            time:
                "15:00",

            duration:
                "90"
        }

    ];


    /* =====================================================
       ESTADO
    ====================================================== */

    let selectedId = null;


    /* =====================================================
       ELEMENTOS
    ====================================================== */

    const grid =
        document.querySelector(
            "#calendar-grid"
        );


    const counter =
        document.querySelector(
            "#class-counter"
        );


    const search =
        document.querySelector(
            "#class-search"
        );


    const backdrop =
        document.querySelector(
            "#modal-backdrop"
        );


    const detailsModal =
        document.querySelector(
            "#details-modal"
        );


    const formModal =
        document.querySelector(
            "#form-modal"
        );


    const deleteModal =
        document.querySelector(
            "#delete-modal"
        );


    const form =
        document.querySelector(
            "#class-form"
        );


    const toast =
        document.querySelector(
            "#toast"
        );


    /* =====================================================
       CONVERTER HORÁRIO PARA MINUTOS
    ====================================================== */

    function getTimeInMinutes(time) {

        const [
            hour,
            minute
        ] =
            time
                .split(":")
                .map(Number);


        return (
            (hour - 8) * 60 +
            minute
        );

    }


    /* =====================================================
       OBTER LINHA DO GRID
    ====================================================== */

    function getSlotIndex(time) {

        const minutes =
            getTimeInMinutes(time);


        /*
            Cada linha representa 1 hora.

            08:00 → 0
            09:00 → 1
            10:00 → 2
            10:30 → 2
            15:30 → 7
        */

        return Math.max(
            0,
            Math.min(
                11,
                Math.floor(
                    minutes / 60
                )
            )
        );

    }


    /* =====================================================
       OBTER MINUTOS DENTRO DA HORA
    ====================================================== */

    function getMinutesInsideHour(time) {

        const [
            ,
            minute
        ] =
            time
                .split(":")
                .map(Number);


        return minute;

    }


    /* =====================================================
       CALCULAR ALTURA DA AULA
    ====================================================== */

    function getDurationHeight(duration) {

        /*
            Cada linha possui 1 hora.

            45 minutos = 75%
            60 minutos = 100%
            90 minutos = 150%
        */

        return (
            Number(duration) / 60
        );

    }


    /* =====================================================
       RENDERIZAR CALENDÁRIO
    ====================================================== */

    function renderCalendar() {

        const term =
            search.value
                .trim()
                .toLowerCase();


        /* =================================================
           FILTRAR AULAS
        ================================================= */

        const visibleClasses =
            classes.filter(
                (item) => {

                    return `
                        ${item.student}
                        ${item.instrument}
                        ${item.teacher}
                    `
                        .toLowerCase()
                        .includes(term);

                }
            );


        /* =================================================
           ATUALIZAR CONTADOR
        ================================================= */

        counter.textContent =
            `${visibleClasses.length} ${
                visibleClasses.length === 1
                    ? "aula"
                    : "aulas"
            }`;


        /* =================================================
           LIMPAR GRID
        ================================================= */

        grid.innerHTML = "";


        /* =================================================
           CRIAR LINHAS DE HORÁRIO
        ================================================= */

        times.forEach(
            (time, row) => {

                /* =========================================
                   HORÁRIO
                ========================================= */

                const label =
                    document.createElement(
                        "div"
                    );


                label.className =
                    "time-label";


                label.style.gridColumn =
                    "1";


                label.style.gridRow =
                    row + 1;


                label.textContent =
                    time;


                grid.append(
                    label
                );


                /* =========================================
                   SLOTS DOS DIAS
                ========================================= */

                days.forEach(
                    (day, dayIndex) => {

                        const slot =
                            document.createElement(
                                "button"
                            );


                        slot.type =
                            "button";


                        slot.className =
                            "slot";


                        slot.style.gridColumn =
                            dayIndex + 2;


                        slot.style.gridRow =
                            row + 1;


                        slot.dataset.day =
                            day;


                        slot.dataset.time =
                            time;


                        grid.append(
                            slot
                        );

                    }
                );

            }
        );


        /* =================================================
           CRIAR CARDS
        ================================================= */

        visibleClasses.forEach(
            (item) => {

                const dayIndex =
                    days.indexOf(
                        item.day
                    );


                /*
                    Se o dia não existir,
                    não cria o card.
                */

                if (dayIndex === -1) {

                    return;

                }


                /* =========================================
                   LINHA INICIAL
                ========================================= */

                const startRow =
                    getSlotIndex(
                        item.time
                    ) + 1;


                /* =========================================
                   MINUTOS DENTRO DA HORA
                ========================================= */

                const minutesInsideHour =
                    getMinutesInsideHour(
                        item.time
                    );


                /* =========================================
                   CRIAR CARD
                ========================================= */

                const card =
                    document.createElement(
                        "button"
                    );


                card.type =
                    "button";


                card.className =
                    `class-card ${
                        styleByInstrument[
                            item.instrument
                        ] || ""
                    }`;


                /* =========================================
                   COLUNA
                ========================================= */

                card.style.gridColumn =
                    dayIndex + 2;


                /* =========================================
                   LINHA
                ========================================= */

                card.style.gridRow =
                    startRow;


                /* =========================================
                   POSIÇÃO PARA :30
                ========================================= */

                if (
                    minutesInsideHour > 0
                ) {

                    /*
                        Como a linha possui 96px:

                        30 minutos = 48px

                        Portanto:
                        30 / 60 = 50%
                    */

                    card.style.transform =
                        `translateY(${
                            (
                                minutesInsideHour /
                                60
                            ) * 96
                        }px)`;

                }


                /* =========================================
                   ALTURA PROPORCIONAL
                ========================================= */

                const height =
                    getDurationHeight(
                        item.duration
                    );


                /*
                    Cada linha = 96px.

                    45 min:
                    96 × 0.75 = 72px

                    60 min:
                    96 × 1 = 96px

                    90 min:
                    96 × 1.5 = 144px
                */

                card.style.height =
                    `calc(${
                        height * 96
                    }px - 8px)`;


                /* =========================================
                   ID
                ========================================= */

                card.dataset.id =
                    item.id;


                /* =========================================
                   CONTEÚDO
                ========================================= */

                card.innerHTML = `
                    <strong>
                        ${item.student}
                    </strong>

                    <span>
                        ${item.instrument}
                    </span>

                    <small>
                        ${item.time}
                        ·
                        ${item.duration} min
                    </small>
                `;


                grid.append(
                    card
                );

            }
        );

    }


    /* =====================================================
       ABRIR MODAL
    ====================================================== */

    function openModal(modal) {

        backdrop.hidden =
            false;


        [
            detailsModal,
            formModal,
            deleteModal

        ].forEach(
            (item) => {

                item.hidden =
                    item !== modal;

            }
        );

    }


    /* =====================================================
       FECHAR MODAL
    ====================================================== */

    function closeModal() {

        backdrop.hidden =
            true;


        [
            detailsModal,
            formModal,
            deleteModal

        ].forEach(
            (item) => {

                item.hidden =
                    true;

            }
        );

    }


    /* =====================================================
       TOAST
    ====================================================== */

    function showToast(message) {

        toast.textContent =
            message;


        toast.classList.add(
            "show"
        );


        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            2500
        );

    }


    /* =====================================================
       MOSTRAR DETALHES
    ====================================================== */

    function showDetails(id) {

        selectedId =
            Number(id);


        const item =
            classes.find(
                (entry) =>
                    entry.id ===
                    selectedId
            );


        if (!item) {

            return;

        }


        document.querySelector(
            "#details-title"
        ).textContent =
            `Aula de ${
                item.instrument
                    .toLowerCase()
            }`;


        document.querySelector(
            "#details-content"
        ).innerHTML = `

            <div class="details-list">

                <div class="detail-row">

                    <div>

                        <small>
                            ALUNO
                        </small>

                        <strong>
                            ${item.student}
                        </strong>

                        <small>
                            ${item.email}
                        </small>

                    </div>

                </div>


                <div class="detail-row">

                    <div>

                        <small>
                            INSTRUMENTO
                        </small>

                        <strong>
                            ${item.instrument}
                        </strong>

                    </div>

                </div>


                <div class="detail-row">

                    <div>

                        <small>
                            HORÁRIO
                        </small>

                        <strong>
                            ${item.day},
                            ${item.time}
                            ·
                            ${item.duration} min
                        </strong>

                    </div>

                </div>


                <div class="detail-row">

                    <div>

                        <small>
                            PROFESSOR(A)
                        </small>

                        <strong>
                            ${item.teacher}
                        </strong>

                    </div>

                </div>

            </div>

        `;


        openModal(
            detailsModal
        );

    }


    /* =====================================================
       ABRIR FORMULÁRIO
    ====================================================== */

    function openForm(
        item = null,
        defaults = {}
    ) {

        form.reset();


        document.querySelector(
            "#class-id"
        ).value =
            item?.id ?? "";


        document.querySelector(
            "#student-name"
        ).value =
            item?.student ?? "";


        document.querySelector(
            "#student-email"
        ).value =
            item?.email ?? "";


        document.querySelector(
            "#class-instrument"
        ).value =
            item?.instrument ??
            "Violão";


        document.querySelector(
            "#class-teacher"
        ).value =
            item?.teacher ?? "";


        document.querySelector(
            "#class-day"
        ).value =
            item?.day ??
            defaults.day ??
            "Segunda";


        document.querySelector(
            "#class-time"
        ).value =
            item?.time ??
            defaults.time ??
            "09:00";


        document.querySelector(
            "#class-duration"
        ).value =
            item?.duration ??
            "60";


        document.querySelector(
            "#form-title"
        ).textContent =
            item
                ? "Editar aula"
                : "Cadastrar aula";


        document.querySelector(
            "#form-kicker"
        ).textContent =
            item
                ? "EDITAR AULA"
                : "NOVA AULA";


        openModal(
            formModal
        );

    }


    /* =====================================================
       NOVA AULA
    ====================================================== */

    document
        .querySelector(
            "#new-class-button"
        )
        .addEventListener(
            "click",
            () => {

                openForm();

            }
        );


    /* =====================================================
       CLICAR NO DIA
    ====================================================== */

    document
        .querySelectorAll(
            ".day-header"
        )
        .forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    () => {

                        openForm(
                            null,
                            {
                                day:
                                    button.dataset.day
                            }
                        );

                    }
                );

            }
        );


    /* =====================================================
       CLIQUES NO CALENDÁRIO
    ====================================================== */

    grid.addEventListener(
        "click",
        (event) => {

            const card =
                event.target.closest(
                    ".class-card"
                );


            const slot =
                event.target.closest(
                    ".slot"
                );


            /* =============================================
               CLICOU EM UMA AULA
            ============================================= */

            if (card) {

                showDetails(
                    card.dataset.id
                );

                return;

            }


            /* =============================================
               CLICOU EM HORÁRIO
            ============================================= */

            if (slot) {

                openForm(
                    null,
                    {
                        day:
                            slot.dataset.day,

                        time:
                            slot.dataset.time
                    }
                );

            }

        }
    );


    /* =====================================================
       BUSCA
    ====================================================== */

    search.addEventListener(
        "input",
        renderCalendar
    );


    /* =====================================================
       FECHAR MODAIS
    ====================================================== */

    document
        .querySelectorAll(
            "[data-close-modal]"
        )
        .forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    closeModal
                );

            }
        );


    /* =====================================================
       CLICAR FORA DO MODAL
    ====================================================== */

    backdrop.addEventListener(
        "click",
        (event) => {

            if (
                event.target ===
                backdrop
            ) {

                closeModal();

            }

        }
    );


    /* =====================================================
       EDITAR AULA
    ====================================================== */

    document
        .querySelector(
            "#open-edit"
        )
        .addEventListener(
            "click",
            () => {

                const item =
                    classes.find(
                        (entry) =>
                            entry.id ===
                            selectedId
                    );


                if (item) {

                    openForm(
                        item
                    );

                }

            }
        );


    /* =====================================================
       ABRIR EXCLUSÃO
    ====================================================== */

    document
        .querySelector(
            "#open-delete"
        )
        .addEventListener(
            "click",
            () => {

                openModal(
                    deleteModal
                );

            }
        );


    /* =====================================================
       CONFIRMAR EXCLUSÃO
    ====================================================== */

    document
        .querySelector(
            "#confirm-delete"
        )
        .addEventListener(
            "click",
            () => {

                const item =
                    classes.find(
                        (entry) =>
                            entry.id ===
                            selectedId
                    );


                if (!item) {

                    return;

                }


                classes =
                    classes.filter(
                        (entry) =>
                            entry.id !==
                            selectedId
                    );


                renderCalendar();


                closeModal();


                showToast(
                    `Aula de ${
                        item.student
                    } excluída.`
                );

            }
        );


    /* =====================================================
       SALVAR FORMULÁRIO
    ====================================================== */

    form.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();


            const data =
                Object.fromEntries(
                    new FormData(form)
                );


            const record = {

                id:
                    data["class-id"]
                        ? Number(
                            data["class-id"]
                        )
                        : Date.now(),


                student:
                    data.student.trim(),


                email:
                    data.email.trim(),


                instrument:
                    data.instrument,


                teacher:
                    data.teacher.trim(),


                day:
                    data.day,


                time:
                    data.time,


                duration:
                    data.duration

            };


            /* =============================================
               VERIFICAR EDIÇÃO
            ============================================= */

            const existing =
                classes.findIndex(
                    (item) =>
                        item.id ===
                        record.id
                );


            if (
                existing >= 0
            ) {

                classes[existing] =
                    record;


                showToast(
                    "Aula atualizada com sucesso."
                );

            } else {

                classes.push(
                    record
                );


                showToast(
                    "Nova aula cadastrada com sucesso."
                );

            }


            /* =============================================
               ATUALIZAR
            ============================================= */

            renderCalendar();


            closeModal();

        }
    );


    /* =====================================================
       INICIALIZAR
    ====================================================== */

    renderCalendar();

});