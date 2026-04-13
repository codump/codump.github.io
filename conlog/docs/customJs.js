document.addEventListener("DOMContentLoaded", () => {
  const sidebarItems = document.querySelectorAll('[data-isopen]');
  
  sidebarItems.forEach(item => {
    item.setAttribute('data-isopen', 'true');
  });

  const today = new Date();
  const lastupdate = document.getElementById("lastupdate");
  if (lastupdate) {
    lastupdate.innerHTML = today.toUTCString();
  }
});