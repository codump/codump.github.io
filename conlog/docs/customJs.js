document.addEventListener("DOMContentLoaded", () => {
  // Selecteer alle elementen die een 'data-isopen' attribuut hebben
  const sidebarItems = document.querySelectorAll('[data-isopen]');

  sidebarItems.forEach(item => {
    item.setAttribute('data-isopen', 'true');
  });

  // Tijdstempel logica
  const today = new Date();
  const lastupdate = document.getElementById("lastupdate");
  if (lastupdate) {
    lastupdate.innerHTML = today.toUTCString();
  }
});
