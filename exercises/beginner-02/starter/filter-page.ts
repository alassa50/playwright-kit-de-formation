export const filterHtml = `
  <main>
    <label for="search">Recherche</label>
    <input id="search" />
    <ul>
      <li data-item>livre TypeScript</li>
      <li data-item>clavier mécanique</li>
      <li data-item>livre Playwright</li>
    </ul>
    <script>
      const search = document.getElementById('search');
      const items = Array.from(document.querySelectorAll('[data-item]'));
      search?.addEventListener('input', () => {
        const query = search.value.toLowerCase();
        items.forEach((item) => {
          item.style.display = item.textContent.toLowerCase().includes(query) ? 'list-item' : 'none';
        });
      });
    </script>
  </main>
`;
