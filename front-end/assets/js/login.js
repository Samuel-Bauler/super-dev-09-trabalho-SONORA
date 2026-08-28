
const modes = document.querySelectorAll(".mode");
const forms = document.querySelectorAll(".auth-form");

modes.forEach((mode) => {
  mode.addEventListener("click", () => {
    modes.forEach((button) => {
      button.classList.remove("active");
      button.setAttribute("aria-selected", "false");
    });

    forms.forEach((form) => {
      form.classList.remove("active");
    });

    mode.classList.add("active");
    mode.setAttribute("aria-selected", "true");

    document
      .getElementById(mode.dataset.target)
      .classList.add("active");
  });
});

document.querySelectorAll(".password-toggle").forEach((button) => {
  button.addEventListener("click", () => {
    const input = button.previousElementSibling;
    const visible = input.type === "text";

    input.type = visible ? "password" : "text";

    button.classList.toggle("showing", !visible);

    button.setAttribute(
      "aria-label",
      visible ? "Mostrar senha" : "Esconder senha"
    );

    button.setAttribute(
      "aria-pressed",
      visible ? "false" : "true"
    );
  });
});

function messageFor(input) {
  if (input.validity.valueMissing) {
    return "Este campo é obrigatório.";
  }

  if (input.validity.typeMismatch) {
    return "Digite um endereço de email válido.";
  }

  if (input.validity.tooShort) {
    return `Digite pelo menos ${input.minLength} caracteres.`;
  }

  return "";
}

forms.forEach((form) => {
  const message = form.querySelector(".message");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    let valid = true;

    form.querySelectorAll("input[required]").forEach((input) => {
      const label = input.closest("label");
      const error = label.querySelector("small");
      const text = messageFor(input);

      label.classList.toggle("invalid", Boolean(text));

      if (error) {
        error.textContent = text;
      }

      if (text) {
        valid = false;
      }
    });

    message.textContent = valid
      ? form.id === "login"
        ? "Login realizado com sucesso — bem-vindo de volta!"
        : "Conta criada com sucesso — bem-vindo à SONORA!"
      : "";
  });

  form.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", () => {
      const label = input.closest("label");

      label.classList.remove("invalid");

      const error = label.querySelector("small");

      if (error) {
        error.textContent = "";
      }
    });
  });
});

