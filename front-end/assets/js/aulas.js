document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "http://localhost:8000/aulas";
    const HOUR_HEIGHT = 96;

    const days = [
        "Segunda",
        "Terça",
        "Quarta",
        "Quinta",
        "Sexta",
        "Sábado",
        "Domingo"
    ];

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

    // Ajustes restritos ao alinhamento do calendário.
    const calendarStyle = document.createElement("style");

    calendarStyle.textContent = `
        .weekly-calendar {
            grid-template-rows: 82px auto;
        }

        #calendar-grid {
            position: relative;
            gap: 0;
            padding: 0;
            align-content: start;
        }

        #calendar-grid > .time-label,
        #calendar-grid > .slot {
            box-sizing: border-box;
            height: ${HOUR_HEIGHT}px;
            min-height: 0;
            margin: 0;
        }

        #calendar-grid > .class-card {
            position: absolute;
            box-sizing: border-box;
            min-width: 0;
            min-height: 0;
            margin: 0;
            padding: 8px;
            transform: none;
            overflow: hidden;
            transition: box-shadow .15s ease;
        }

        #calendar-grid > .class-card:hover {
            transform: none;
        }

        #calendar-grid > .class-card strong,
        #calendar-grid > .class-card span,
        #calendar-grid > .class-card small {
            min-width: 0;
            flex-shrink: 0;
            max-width: 100%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    `;

    document.head.appendChild(calendarStyle);

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

    function formatMinutes(minutes) {
        const hour = Math.floor(minutes / 60);
        const minute = minutes % 60;

        return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
    }

    function normalizeTime(time) {
        const value = String(time ?? "").trim();

        if (!value) {
            return "";
        }

        // Horários numéricos retornados em segundos.
        if (/^\d+(\.\d+)?$/.test(value)) {
            const seconds = Number(value);

            if (seconds < 0 || seconds >= 86400) {
                return "";
            }

            return formatMinutes(Math.floor(seconds / 60));
        }

        // Aceita HH:mm, HH:mm:ss e horário dentro de uma data ISO.
        const match = value.match(
            /(?:^|T|\s)(\d{1,2}):(\d{2})(?::\d{2})?/
        );

        if (
            !match ||
            Number(match[1]) > 23 ||
            Number(match[2]) > 59
        ) {
            return "";
        }

        return `${match[1].padStart(2, "0")}:${match[2]}`;
    }

    function normalizeDuration(duration) {
        const value = String(duration ?? "").trim();
        const match = value.match(/^(\d+):(\d{2})(?::(\d{2}))?$/);

        let minutes;

        if (match) {
            minutes = Number(match[1]) * 60 + Number(match[2]);
        } else {
            const numericDuration = Number(value);

            minutes = numericDuration > 240
                ? Math.round(numericDuration / 60)
                : numericDuration;
        }

        return String(
            Number.isFinite(minutes) && minutes > 0
                ? minutes
                : 60
        );
    }

    function timeToMinutes(time) {
        const [hour, minute] = time.split(":").map(Number);
        return hour * 60 + minute;
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
            day: getDayFromDate(date) || item.day || "",
            time: normalizeTime(item.hora_inicio ?? item.time),
            duration: normalizeDuration(item.duracao ?? item.duration)
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

            showToast("Não foi possível carregar as aulas do servidor.");
        }
    }

    // Distribui aulas simultâneas em colunas dentro do mesmo dia.
    function arrangeClasses(items) {
        const entries = items
            .map((item) => ({
                item,
                start: timeToMinutes(item.time),
                end: timeToMinutes(item.time) + Number(item.duration),
                column: 0,
                columnCount: 1
            }))
            .sort((a, b) => a.start - b.start || a.end - b.end);

        let group = [];
        let groupEnd = -1;
        let columnEnds = [];

        function finishGroup() {
            group.forEach((entry) => {
                entry.columnCount = columnEnds.length;
            });
        }

        entries.forEach((entry) => {
            if (group.length && entry.start >= groupEnd) {
                finishGroup();
                group = [];
                columnEnds = [];
                groupEnd = -1;
            }

            let column = columnEnds.findIndex(
                (end) => end <= entry.start
            );

            if (column === -1) {
                column = columnEnds.length;
            }

            entry.column = column;
            columnEnds[column] = entry.end;
            groupEnd = Math.max(groupEnd, entry.end);
            group.push(entry);
        });

        finishGroup();

        return entries;
    }

    function renderCalendar() {
        const term = search.value.trim().toLowerCase();

        const validClasses = classes.filter((item) => item.time);

        const visibleClasses = validClasses.filter((item) =>
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
            visibleClasses.length === 1 ? "aula" : "aulas"
        }`;

        // Mantém 08:00–20:00 e amplia quando uma aula exige.
        let startMinutes = 8 * 60;
        let endMinutes = 20 * 60;

        validClasses.forEach((item) => {
            const start = timeToMinutes(item.time);
            const end = start + Number(item.duration);

            startMinutes = Math.min(
                startMinutes,
                Math.floor(start / 60) * 60
            );

            endMinutes = Math.max(
                endMinutes,
                Math.ceil(end / 60) * 60
            );
        });

        const rowCount = (endMinutes - startMinutes) / 60;

        grid.innerHTML = "";
        grid.style.gridTemplateRows =
            `repeat(${rowCount}, ${HOUR_HEIGHT}px)`;
        grid.style.height = `${rowCount * HOUR_HEIGHT}px`;

        for (let row = 0; row < rowCount; row++) {
            const time = formatMinutes(startMinutes + row * 60);
            const label = document.createElement("div");

            label.className = "time-label";
            label.style.gridColumn = "1";
            label.style.gridRow = String(row + 1);
            label.textContent = time;

            grid.append(label);

            days.forEach((day, dayIndex) => {
                const slot = document.createElement("button");

                slot.type = "button";
                slot.className = "slot";
                slot.style.gridColumn = String(dayIndex + 2);
                slot.style.gridRow = String(row + 1);
                slot.dataset.day = day;
                slot.dataset.time = time;
                slot.setAttribute("aria-label", `${day}, ${time}`);

                grid.append(slot);
            });
        }

        days.forEach((day, dayIndex) => {
            const entries = arrangeClasses(
                visibleClasses.filter((item) => item.day === day)
            );

            entries.forEach((entry) => {
                const { item, start, end, column, columnCount } = entry;
                const card = document.createElement("button");

                card.type = "button";
                card.className = `class-card ${
                    styleByInstrument[item.instrument] || ""
                }`;

                // A coluna do grid mantém o cartão alinhado ao dia.
                card.style.gridColumn = String(dayIndex + 2);

                // A linha automática usa o calendário como referência vertical.
                card.style.gridRow = "auto";

                card.style.top = `${
                    ((start - startMinutes) / 60) * HOUR_HEIGHT + 4
                }px`;

                card.style.height = `${
                    Math.max(1, ((end - start) / 60) * HOUR_HEIGHT - 8)
                }px`;

                card.style.left =
                    `calc(${(column / columnCount) * 100}% + 5px)`;

                card.style.width =
                    `calc(${100 / columnCount}% - 10px)`;

                card.dataset.id = item.id;

                card.title =
                    `${item.student} · ${item.instrument} · ` +
                    `${item.time} · ${item.duration} min`;

                card.innerHTML = `
                    <strong>${escapeHtml(item.student)}</strong>
                    <span>${escapeHtml(item.instrument)}</span>
                    <small>
                        ${escapeHtml(item.time)}
                        · ${escapeHtml(item.duration)} min
                    </small>
                `;

                grid.append(card);
            });
        });
    }

    function openModal(modal) {
        backdrop.hidden = false;

        [detailsModal, formModal, deleteModal].forEach((item) => {
            item.hidden = item !== modal;
        });
    }

    function closeModal() {
        backdrop.hidden = true;

        [detailsModal, formModal, deleteModal].forEach((item) => {
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

        const item = classes.find((entry) => entry.id === selectedId);

        if (!item) {
            return;
        }

        document.querySelector("#details-title").textContent =
            `Aula de ${item.instrument.toLowerCase()}`;

        document.querySelector("#details-content").innerHTML = `
            <div class="details-list">
                <div class="detail-row">
                    <div>
                        <small>ALUNO</small>
                        <strong>${escapeHtml(item.student)}</strong>
                        <small>${escapeHtml(item.email)}</small>
                    </div>
                </div>

                <div class="detail-row">
                    <div>
                        <small>CURSO</small>
                        <strong>${escapeHtml(item.courseName)}</strong>
                    </div>
                </div>

                <div class="detail-row">
                    <div>
                        <small>INSTRUMENTO</small>
                        <strong>${escapeHtml(item.instrument)}</strong>
                    </div>
                </div>

                <div class="detail-row">
                    <div>
                        <small>DATA E HORÁRIO</small>
                        <strong>
                            ${escapeHtml(item.date)}
                            · ${escapeHtml(item.time)}
                            · ${escapeHtml(item.duration)} min
                        </strong>
                    </div>
                </div>

                <div class="detail-row">
                    <div>
                        <small>PROFESSOR(A)</small>
                        <strong>${escapeHtml(item.teacher)}</strong>
                    </div>
                </div>
            </div>
        `;

        openModal(detailsModal);
    }

    function getDateForDay(day) {
        const monday = new Date("2026-08-31T12:00:00");

        monday.setDate(monday.getDate() + days.indexOf(day));

        return monday.toISOString().slice(0, 10);
    }

    function openForm(item = null, defaults = {}) {
        form.reset();

        document.querySelector("#class-id").value = item?.id ?? "";
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
            item?.time ?? defaults.time ?? "09:00";

        document.querySelector("#class-duration").value =
            item?.duration ?? "60";

        document.querySelector("#form-title").textContent =
            item ? "Editar aula" : "Cadastrar aula";

        document.querySelector("#form-kicker").textContent =
            item ? "EDITAR AULA" : "NOVA AULA";

        openModal(formModal);
    }

    document.querySelector("#new-class-button")
        .addEventListener("click", () => {
            openForm();
        });

    document.querySelectorAll(".day-header").forEach((button) => {
        button.addEventListener("click", () => {
            openForm(null, { day: button.dataset.day });
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
            openForm(null, {
                day: slot.dataset.day,
                time: slot.dataset.time
            });
        }
    });

    search.addEventListener("input", renderCalendar);

    document.querySelectorAll("[data-close-modal]").forEach((button) => {
        button.addEventListener("click", closeModal);
    });

    backdrop.addEventListener("click", (event) => {
        if (event.target === backdrop) {
            closeModal();
        }
    });

    document.querySelector("#open-edit").addEventListener("click", () => {
        const item = classes.find((entry) => entry.id === selectedId);

        if (item) {
            openForm(item);
        }
    });

    document.querySelector("#open-delete").addEventListener("click", () => {
        openModal(deleteModal);
    });

    document.querySelector("#confirm-delete")
        .addEventListener("click", async () => {
            if (!selectedId) {
                return;
            }

            try {
                await request(`${API_URL}/${selectedId}`, {
                    method: "DELETE"
                });

                closeModal();
                showToast("Aula excluída com sucesso.");

                selectedId = null;

                await loadClasses();
            } catch (error) {
                console.error("Erro ao excluir aula:", error);

                showToast(
                    error.message || "Não foi possível excluir a aula."
                );
            }
        });

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const id = document.querySelector("#class-id").value;

        const payload = {
            professor: document.querySelector("#class-teacher").value.trim(),
            cliente: document.querySelector("#student-name").value.trim(),
            curso: document.querySelector("#class-course").value.trim(),
            data: document.querySelector("#class-date").value,
            hora_inicio:
                document.querySelector("#class-time").value + ":00",
            duracao: durationToApiTime(
                document.querySelector("#class-duration").value
            )
        };

        try {
            await request(id ? `${API_URL}/${id}` : API_URL, {
                method: id ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            closeModal();

            showToast(
                id
                    ? "Aula atualizada com sucesso."
                    : "Aula cadastrada com sucesso."
            );

            await loadClasses();
        } catch (error) {
            console.error("Erro ao salvar aula:", error);

            showToast(
                error.message || "Não foi possível salvar a aula."
            );
        }
    });

    loadClasses();
});