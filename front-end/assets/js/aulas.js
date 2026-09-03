// app.js
document.addEventListener("DOMContentLoaded", () => {
  const days = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

  const times = Array.from(
    { length: 24 },
    (_, index) =>
      `${String(8 + Math.floor(index / 2)).padStart(2, "0")}:${index % 2 ? "30" : "00"}`
  );

  const styleByInstrument = {
    Violão: "guitar",
    Piano: "piano",
    Canto: "vocal",
    Bateria: "drums",
    Teclado: "keyboard",
    Guitarra: "guitar-blue"
  };

  let classes = [
    { id: 1, student: "Mariana Oliveira", email: "mariana@email.com", instrument: "Violão", teacher: "Ricardo Nunes", day: "Segunda", time: "09:00", duration: "60" },
    { id: 2, student: "Lucas Martins", email: "lucas@email.com", instrument: "Piano", teacher: "Helena Martins", day: "Segunda", time: "10:30", duration: "45" },
    { id: 3, student: "Beatriz Souza", email: "beatriz@email.com", instrument: "Canto", teacher: "Carolina Freitas", day: "Terça", time: "14:00", duration: "60" },
    { id: 4, student: "Pedro Henrique", email: "pedro@email.com", instrument: "Violão", teacher: "Ricardo Nunes", day: "Terça", time: "16:00", duration: "45" },
    { id: 5, student: "Camila Ferreira", email: "camila@email.com", instrument: "Piano", teacher: "Helena Martins", day: "Quarta", time: "08:30", duration: "60" },
    { id: 6, student: "Rafael Almeida", email: "rafael@email.com", instrument: "Bateria", teacher: "Eduardo Lima", day: "Quarta", time: "15:30", duration: "90" },
    { id: 7, student: "Juliana Costa", email: "juliana@email.com", instrument: "Teclado", teacher: "Paula Vieira", day: "Quinta", time: "11:00", duration: "60" },
    { id: 8, student: "Gabriel Santos", email: "gabriel@email.com", instrument: "Guitarra", teacher: "Mateus Rocha", day: "Sexta", time: "15:00", duration: "90" }
  ];

  let selectedId = null;

  const grid = document.querySelector("#calendar-grid");
  const counter = document.querySelector("#class-counter");
  const search = document.querySelector("#class-search");
  const backdrop = document.querySelector("#modal-backdrop");
  const detailsModal = document.querySelector("#details-modal");
  const formModal = document.querySelector("#form-modal");
  const deleteModal = document.querySelector("#delete-modal");
  const form = document.querySelector("#class-form");
  const toast = document.querySelector("#toast");

  function getSlotIndex(time) {
    const [hour, minute] = time.split(":").map(Number);

    return Math.max(
      0,
      Math.min(23, (hour - 8) * 2 + (minute >= 30 ? 1 : 0))
    );
  }

  function renderCalendar() {
    const term = search.value.trim().toLowerCase();

    const visibleClasses = classes.filter((item) =>
      `${item.student} ${item.instrument} ${item.teacher}`
        .toLowerCase()
        .includes(term)
    );

    counter.textContent = `${visibleClasses.length} ${
      visibleClasses.length === 1 ? "aula" : "aulas"
    }`;

    grid.innerHTML = "";

    times.forEach((time, row) => {
      const label = document.createElement("div");

      label.className = "time-label";
      label.style.gridColumn = "1";
      label.style.gridRow = row + 1;
      label.textContent = time.endsWith(":00") ? time : "";

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
      const start = getSlotIndex(item.time);
      const dayIndex = days.indexOf(item.day);
      const height = item.duration === "90" ? 3 : 2;

      const card = document.createElement("button");

      card.type = "button";
      card.className = `class-card ${styleByInstrument[item.instrument]}`;
      card.style.gridColumn = dayIndex + 2;
      card.style.gridRow = `${start + 1} / span ${height}`;
      card.dataset.id = item.id;

      card.innerHTML = `
        <strong>${item.student}</strong>
        <span>${item.instrument}</span>
        <small>${item.time} · ${item.duration} min</small>
      `;

      grid.append(card);
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
    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => toast.classList.remove("show"), 2500);
  }

  function showDetails(id) {
    selectedId = Number(id);

    const item = classes.find((entry) => entry.id === selectedId);

    if (!item) return;

    document.querySelector("#details-title").textContent =
      `Aula de ${item.instrument.toLowerCase()}`;

    document.querySelector("#details-content").innerHTML = `
      <div class="details-list">
        <div class="detail-row">
          <div>
            <small>ALUNO</small>
            <strong>${item.student}</strong>
            <small>${item.email}</small>
          </div>
        </div>

        <div class="detail-row">
          <div>
            <small>INSTRUMENTO</small>
            <strong>${item.instrument}</strong>
          </div>
        </div>

        <div class="detail-row">
          <div>
            <small>HORÁRIO</small>
            <strong>${item.day}, ${item.time} · ${item.duration} min</strong>
          </div>
        </div>

        <div class="detail-row">
          <div>
            <small>PROFESSOR(A)</small>
            <strong>${item.teacher}</strong>
          </div>
        </div>
      </div>
    `;

    openModal(detailsModal);
  }

  function openForm(item = null, defaults = {}) {
    form.reset();

    document.querySelector("#class-id").value = item?.id ?? "";
    document.querySelector("#student-name").value = item?.student ?? "";
    document.querySelector("#student-email").value = item?.email ?? "";
    document.querySelector("#class-instrument").value = item?.instrument ?? "Violão";
    document.querySelector("#class-teacher").value = item?.teacher ?? "";
    document.querySelector("#class-day").value = item?.day ?? defaults.day ?? "Segunda";
    document.querySelector("#class-time").value = item?.time ?? defaults.time ?? "09:00";
    document.querySelector("#class-duration").value = item?.duration ?? "60";

    document.querySelector("#form-title").textContent =
      item ? "Editar aula" : "Cadastrar aula";

    openModal(formModal);
  }

  document.querySelector("#new-class-button").addEventListener("click", () => {
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
    if (event.target === backdrop) closeModal();
  });

  document.querySelector("#open-edit").addEventListener("click", () => {
    const item = classes.find((entry) => entry.id === selectedId);

    if (item) openForm(item);
  });

  document.querySelector("#open-delete").addEventListener("click", () => {
    openModal(deleteModal);
  });

  document.querySelector("#confirm-delete").addEventListener("click", () => {
    const item = classes.find((entry) => entry.id === selectedId);

    classes = classes.filter((entry) => entry.id !== selectedId);

    renderCalendar();
    closeModal();
    showToast(`Aula de ${item.student} excluída.`);
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = Object.fromEntries(new FormData(form));

    const record = {
      id: data["class-id"] ? Number(data["class-id"]) : Date.now(),
      student: data.student.trim(),
      email: data.email.trim(),
      instrument: data.instrument,
      teacher: data.teacher.trim(),
      day: data.day,
      time: data.time,
      duration: data.duration
    };

    const existing = classes.findIndex((item) => item.id === record.id);

    if (existing >= 0) {
      classes[existing] = record;
      showToast("Aula atualizada com sucesso.");
    } else {
      classes.push(record);
      showToast("Nova aula cadastrada com sucesso.");
    }

    renderCalendar();
    closeModal();
  });

  renderCalendar();
});