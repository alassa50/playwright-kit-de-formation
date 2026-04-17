export const loginHtml = `
  <main>
    <h1>Connexion</h1>
    <form aria-label="formulaire de connexion">
      <label for="email">Email</label>
      <input id="email" type="email" />
      <label for="password">Mot de passe</label>
      <input id="password" type="password" />
      <button type="submit">Se connecter</button>
      <p role="status" aria-live="polite"></p>
    </form>
    <script>
      document.querySelector('form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const status = document.querySelector('[role="status"]');
        if (status) status.textContent = 'Connexion réussie';
      });
    </script>
  </main>
`;
