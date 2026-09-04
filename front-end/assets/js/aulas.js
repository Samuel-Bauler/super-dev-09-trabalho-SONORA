document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "http://localhost:8000/aulas";

    const days = [
        "Segunda",
        "Terça",
        "Quarta",
        "Quinta",
        "Sexta",
        "Sábado",
        "Domingo"
    ];

    const times = Array.from(
        { length: 12 },
        (_, index) => `${String(8 + index).padStart(2, "0")}:00`
    );

    const styleByInstrument = {
        "Violão": "guitar",
        Piano: "piano",
        Canto: "vocal",
        Bateria: "drums",
        Teclado: "keyboard",
        Guitarra: "guitar-blue"
    };

    const grid = document.querySelector("#calendar-grid");
    const counter = document.querySelector("#class-counter");
    const search = document.querySelector("#class-search");
    const backdrop = document.querySelector("#modal-backdrop");
    const detailsModal = document.querySelector("#details-modal");
    const formModal = document.querySelector("#form-modal");
    const deleteModal = document.querySelector("#delete-modal");
    const form = document.querySelector("#class-form");
    const toast = document.querySelector("#toast");

    let classes = [];
    let selectedId = null;
    let toastTimeout;

    function escapeHtml(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function getDayFromDate(date) {
        const formattedDate = String(date || "").slice(0, 10);

        if (!/^\d{4}-\d{2}-\d{2}$/.test(formattedDate)) {
            return "";
        }

        const value = new Date(`${formattedDate}T12:00:00`);

        if (Number.isNaN(value.getTime())) {
            return "";
        }

        return [
            "Domingo",
            "Segunda",
            "Terça",
            "Quarta",
            "Quinta",
            "Sexta",
            "Sábado"
        ][value.getDay()];
    }

    function normalizeTime(time) {
    if (!time) {
        return "08:00";
    }

    const value = String(time);

    const match = value.match(/(\d{1,2}):(\d{2})/);

    if (!match) {
        return "08:00";
    }

    return `${match[1].padStart(2, "0")}:${match[2]}`;
}

    function normalizeDuration(duration) {
    if (typeof duration === "number") {
        return String(
            duration > 240
                ? Math.round(duration / 60)
                : duration
        );
    }

    const value = String(duration || "");
    const match = value.match(/^(\d{1,2}):(\d{2})/);

    if (match) {
        return String(
            Number(match[1]) * 60 +
            Number(match[2])
        );
    }

    const numericDuration = Number(value);

    if (!Number.isFinite(numericDuration)) {
        return "60";
    }

    return String(
        numericDuration > 240
            ? Math.round(numericDuration / 60)
            : numericDuration
    );
}

    function durationToApiTime(duration) {
        const totalMinutes = Number(duration);

        return `${String(Math.floor(totalMinutes / 60)).padStart(2, "0")}:${String(totalMinutes % 60).padStart(2, "0")}:00`;
    }

    function normalizeClass(item) {
        const date = String(item.data || item.date || "").slice(0, 10);

        return {
            id: Number(item.id),

            student:
                item.cliente?.nome ||
                item.student ||
                "Aluno não informado",

            email:
                item.cliente?.email ||
                item.email ||
                "E-mail não informado",

            instrument:
                item.curso?.instrumento?.nome ||
                item.instrument ||
                "Outro",

            courseName:
                item.curso?.nome ||
                item.courseName ||
                "Curso não informado",

            teacher:
                item.professor?.nome ||
                item.teacher ||
                "Professor não informado",

            date,

            day:
                getDayFromDate(date) ||
                item.day ||
                "",

            time:
                normalizeTime(
                    item.hora_inicio ||
                    item.time
                ),

            duration:
                normalizeDuration(
                    item.duracao ||
                    item.duration
                )
        };
    }

    async function request(url, options = {}) {
        const response = await fetch(url, options);

        if (response.ok) {
            return response.status === 204
                ? null
                : response.json();
        }

        let message = "Não foi possível concluir a operação.";

        try {
            const error = await response.json();
            message = error.detail || message;
        } catch (error) {
            // A resposta não contém detalhes em JSON.
        }

        throw new Error(message);
    }

    async function loadClasses() {
        try {
            const data = await request(API_URL);

            classes = data
                .map(normalizeClass)
                .filter((item) => days.includes(item.day));

            renderCalendar();

        } catch (error) {
            console.error("Erro ao carregar aulas:", error);

            classes = [];

            renderCalendar();

            showToast(
                "Não foi possível carregar as aulas do servidor."
            );
        }
    }

    function getSlotIndex(time) {
        const [hour, minute] = time.split(":").map(Number);

        return Math.max(
            0,
            Math.min(
                11,
                Math.floor(
                    ((hour - 8) * 60 + minute) / 60
                )
            )
        );
    }

    function renderCalendar() {
        const term = search.value.trim().toLowerCase();

        const visibleClasses = classes.filter((item) =>
            [
                item.student,
                item.email,
                item.instrument,
                item.courseName,
                item.teacher,
                item.day,
                item.time
            ]
                .join(" ")
                .toLowerCase()
                .includes(term)
        );

        counter.textContent = `${visibleClasses.length} ${
            visibleClasses.length === 1
                ? "aula"
                : "aulas"
        }`;

        grid.innerHTML = "";

        times.forEach((time, row) => {
            const label = document.createElement("div");

            label.className = "time-label";
            label.style.gridColumn = "1";
            label.style.gridRow = row + 1;
            label.textContent = time;

            grid.append(label);

            days.forEach((day, dayIndex) => {
                const slot = document.createElement("button");

                slot.type = "button";
                slot.className = "slot";
                slot.style.gridColumn = dayIndex + 2;
                slot.style.gridRow = row + 1;
                slot.dataset.day = day;
                slot.dataset.time = time;

                grid.append(slot);
            });
        });

        visibleClasses.forEach((item) => {
            const dayIndex = days.indexOf(item.day);

            if (dayIndex === -1) {
                return;
            }

            const card = document.createElement("button");

            card.type = "button";
            card.className = `class-card ${
                styleByInstrument[item.instrument] || ""
            }`;

            card.style.gridColumn = dayIndex + 2;
            card.style.gridRow = getSlotIndex(item.time) + 1;

            card.style.height = `calc(${
                (Number(item.duration) / 60) * 96
            }px - 8px)`;

            card.style.transform = `translateY(${
                (
                    (Number(item.time.split(":")[1]) || 0) /
                    60
                ) * 96
            }px)`;

            card.dataset.id = item.id;

            card.innerHTML = `
                <strong>
                    ${escapeHtml(item.student)}
                </strong>

                <span>
                    ${escapeHtml(item.instrument)}
                </span>

                <small>
                    ${escapeHtml(item.time)}
                    ·
                    ${escapeHtml(item.duration)} min
                </small>
            `;

            grid.append(card);
        });
    }

    function openModal(modal) {
        backdrop.hidden = false;

        [
            detailsModal,
            formModal,
            deleteModal
        ].forEach((item) => {
            item.hidden = item !== modal;
        });
    }

    function closeModal() {
        backdrop.hidden = true;

        [
            detailsModal,
            formModal,
            deleteModal
        ].forEach((item) => {
            item.hidden = true;
        });
    }

    function showToast(message) {
        clearTimeout(toastTimeout);

        toast.textContent = message;
        toast.classList.add("show");

        toastTimeout = setTimeout(() => {
            toast.classList.remove("show");
        }, 2500);
    }

    function showDetails(id) {
        selectedId = Number(id);

        const item = classes.find(
            (entry) => entry.id === selectedId
        );

        if (!item) {
            return;
        }

        document.querySelector(
            "#details-title"
        ).textContent = `Aula de ${
            item.instrument.toLowerCase()
        }`;

        document.querySelector(
            "#details-content"
        ).innerHTML = `
            <div class="details-list">

                <div class="detail-row">
                    <div>
                        <small>ALUNO</small>

                        <strong>
                            ${escapeHtml(item.student)}
                        </strong>

                        <small>
                            ${escapeHtml(item.email)}
                        </small>
                    </div>
                </div>

                <div class="detail-row">
                    <div>
                        <small>CURSO</small>

                        <strong>
                            ${escapeHtml(item.courseName)}
                        </strong>
                    </div>
                </div>

                <div class="detail-row">
                    <div>
                        <small>INSTRUMENTO</small>

                        <strong>
                            ${escapeHtml(item.instrument)}
                        </strong>
                    </div>
                </div>

                <div class="detail-row">
                    <div>
                        <small>DATA E HORÁRIO</small>

                        <strong>
                            ${escapeHtml(item.date)}
                            ·
                            ${escapeHtml(item.time)}
                            ·
                            ${escapeHtml(item.duration)} min
                        </strong>
                    </div>
                </div>

                <div class="detail-row">
                    <div>
                        <small>PROFESSOR(A)</small>

                        <strong>
                            ${escapeHtml(item.teacher)}
                        </strong>
                    </div>
                </div>

            </div>
        `;

        openModal(detailsModal);
    }

    function getDateForDay(day) {
        const monday = new Date("2026-08-31T12:00:00");

        monday.setDate(
            monday.getDate() + days.indexOf(day)
        );

        return monday.toISOString().slice(0, 10);
    }

    function openForm(item = null, defaults = {}) {
        form.reset();

        document.querySelector("#class-id").value =
            item?.id ?? "";

        document.querySelector("#student-name").value =
            item?.student ?? "";

        document.querySelector("#student-email").value =
            item?.email ?? "";

        document.querySelector("#class-course").value =
            item?.courseName ?? "";

        document.querySelector("#class-teacher").value =
            item?.teacher ?? "";

        document.querySelector("#class-date").value =
            item?.date ??
            defaults.date ??
            getDateForDay(defaults.day || "Segunda");

        document.querySelector("#class-time").value =
            item?.time ??
            defaults.time ??
            "09:00";

        document.querySelector("#class-duration").value =
            item?.duration ??
            "60";

        document.querySelector("#form-title").textContent =
            item
                ? "Editar aula"
                : "Cadastrar aula";

        document.querySelector("#form-kicker").textContent =
            item
                ? "EDITAR AULA"
                : "NOVA AULA";

        openModal(formModal);
    }

    document
        .querySelector("#new-class-button")
        .addEventListener("click", () => {
            openForm();
        });

    document
        .querySelectorAll(".day-header")
        .forEach((button) => {
            button.addEventListener("click", () => {
                openForm(
                    null,
                    { day: button.dataset.day }
                );
            });
        });

    grid.addEventListener("click", (event) => {
        const card = event.target.closest(".class-card");
        const slot = event.target.closest(".slot");

        if (card) {
            showDetails(card.dataset.id);
            return;
        }

        if (slot) {
            openForm(
                null,
                {
                    day: slot.dataset.day,
                    time: slot.dataset.time
                }
            );
        }
    });

    search.addEventListener("input", renderCalendar);

    document
        .querySelectorAll("[data-close-modal]")
        .forEach((button) => {
            button.addEventListener("click", closeModal);
        });

    backdrop.addEventListener("click", (event) => {
        if (event.target === backdrop) {
            closeModal();
        }
    });

    document
        .querySelector("#open-edit")
        .addEventListener("click", () => {
            const item = classes.find(
                (entry) => entry.id === selectedId
            );

            if (item) {
                openForm(item);
            }
        });

    document
        .querySelector("#open-delete")
        .addEventListener("click", () => {
            openModal(deleteModal);
        });

    document
        .querySelector("#confirm-delete")
        .addEventListener("click", async () => {
            if (!selectedId) {
                return;
            }

            try {
                await request(
                    `${API_URL}/${selectedId}`,
                    { method: "DELETE" }
                );

                closeModal();

                showToast(
                    "Aula excluída com sucesso."
                );

                selectedId = null;

                await loadClasses();

            } catch (error) {
                console.error(
                    "Erro ao excluir aula:",
                    error
                );

                showToast(
                    error.message ||
                    "Não foi possível excluir a aula."
                );
            }
        });

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const id = document.querySelector("#class-id").value;

        const payload = {
            professor: document
                .querySelector("#class-teacher")
                .value
                .trim(),

            cliente: document
                .querySelector("#student-name")
                .value
                .trim(),

            curso: document
                .querySelector("#class-course")
                .value
                .trim(),

            data: document
                .querySelector("#class-date")
                .value,

            hora_inicio: document
                .querySelector("#class-time")
                .value + ":00",

            duracao: durationToApiTime(
                document
                    .querySelector("#class-duration")
                    .value
            )
        };

        try {
            await request(
                id
                    ? `${API_URL}/${id}`
                    : API_URL,
                {
                    method: id
                        ? "PUT"
                        : "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify(payload)
                }
            );

            closeModal();

            showToast(
                id
                    ? "Aula atualizada com sucesso."
                    : "Aula cadastrada com sucesso."
            );

            await loadClasses();

        } catch (error) {
            console.error(
                "Erro ao salvar aula:",
                error
            );

            showToast(
                error.message ||
                "Não foi possível salvar a aula."
            );
        }
    });

    loadClasses();
});