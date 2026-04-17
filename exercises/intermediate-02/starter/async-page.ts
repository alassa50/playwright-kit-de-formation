export const asyncHtml = `
  <main>
    <button id="start">Démarrer</button>
    <p role="status">Prêt</p>
    <script>
      const status = document.querySelector('[role="status"]');
      document.getElementById('start')?.addEventListener('click', () => {
        if (status) status.textContent = 'Chargement...';
        setTimeout(() => {
          if (status) status.textContent = 'Terminé';
        }, 200);
      });
    </script>
  </main>
`;
