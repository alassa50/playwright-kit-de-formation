export const chatbotHtml = `
  <main>
    <h1>Assistant IA</h1>
    <section id="messages" aria-live="polite" aria-label="Conversation"></section>
    <p role="status" id="status" hidden></p>
    <form id="chat-form">
      <label for="user-input">Votre message</label>
      <input id="user-input" type="text" autocomplete="off" />
      <button type="submit">Envoyer</button>
    </form>
    <script>
      const form = document.getElementById('chat-form');
      const input = document.getElementById('user-input');
      const messages = document.getElementById('messages');
      const status = document.getElementById('status');

      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const message = input.value.trim();
        if (!message) return;

        input.value = '';
        status.textContent = 'Chargement...';
        status.removeAttribute('hidden');

        try {
          const res = await fetch('/api/ai/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message }),
          });

          if (!res.ok) throw new Error('Erreur serveur: ' + res.status);

          const data = await res.json();
          const article = document.createElement('article');
          article.textContent = data.response;
          messages.appendChild(article);
        } catch (err) {
          const error = document.createElement('p');
          error.setAttribute('role', 'alert');
          error.textContent = 'Une erreur est survenue. Veuillez réessayer.';
          messages.appendChild(error);
        } finally {
          status.setAttribute('hidden', '');
          status.textContent = '';
        }
      });
    </script>
  </main>
`;
