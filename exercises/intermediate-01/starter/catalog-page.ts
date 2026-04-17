export const catalogHtml = `
  <main>
    <h1>Catalogue</h1>
    <button id="load">Charger</button>
    <ul id="products"></ul>
    <p id="total"></p>
    <script>
      async function load() {
        const response = await fetch('https://example.test/api/products');
        const products = await response.json();
        const list = document.getElementById('products');
        const total = document.getElementById('total');
        list.innerHTML = '';
        let sum = 0;
        products.forEach((product) => {
          const li = document.createElement('li');
          li.textContent = product.name + ' - ' + product.price + '€';
          list.appendChild(li);
          sum += product.price;
        });
        total.textContent = 'Total: ' + sum + '€';
      }
      document.getElementById('load')?.addEventListener('click', load);
    </script>
  </main>
`;
