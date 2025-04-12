const GITHUB_TOKEN = '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'; // ***JANGAN dipakai di publik***
const GITHUB_USERNAME = 'MoonTechHost';
const GITHUB_REPO = 'SiestaDatabase';
const FILE_PATH = 'user.json';

const form = document.getElementById('dataForm');
const statusText = document.getElementById('status');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();

  statusText.textContent = "Mengirim...";

  try {
    // Ambil file dari repo
    const res = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/${FILE_PATH}`, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json'
      }
    });

    const contentData = await res.json();
    const sha = contentData.sha;
    const currentData = JSON.parse(atob(contentData.content));

    // Tambahkan data baru
    currentData.push({ name, email });

    // Encode ulang dan upload
    const updatedContent = btoa(JSON.stringify(currentData, null, 2));

    const updateRes = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/${FILE_PATH}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json'
      },
      body: JSON.stringify({
        message: `Tambah data ${name}`,
        content: updatedContent,
        sha: sha
      })
    });

    if (updateRes.ok) {
      statusText.textContent = "Data berhasil ditambahkan!";
      form.reset();
    } else {
      statusText.textContent = "Gagal menambahkan data.";
    }
  } catch (error) {
    console.error(error);
    statusText.textContent = "Terjadi kesalahan.";
  }
});
