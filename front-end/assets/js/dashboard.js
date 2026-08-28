const pages = document.querySelectorAll(".page");
const navItems = document.querySelectorAll(".nav-item");
const title = document.querySelector("#page-title");
const toast = document.querySelector(".toast");

let toastTimer;

function openPage(id) {
  pages.forEach((page) => {
    page.classList.toggle("active", page.id === id);
  });

  navItems.forEach((item) => {
    item.classList.toggle("active", item.dataset.page === id);
  });

  title.textContent = id.charAt(0).toUpperCase() + id.slice(1);

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}

document.querySelectorAll("[data-page]").forEach((button) => {
  button.addEventListener("click", () => {
    openPage(button.dataset.page);
  });
});

document.querySelectorAll("[data-toast]").forEach((button) => {
  button.addEventListener("click", () => {
    showToast(button.dataset.toast);
  });
});

document.querySelector(".bell").addEventListener("click", () => {
  showToast("Você não tem novas notificações.");
});

document.querySelector(".search").addEventListener("click", () => {
  showToast("Use os filtros em cada página para pesquisar.");
});