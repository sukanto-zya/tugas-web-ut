// js/app.js
// Fungsi untuk membuka modal detail bahan ajar
function bukaDetailStok(kode, nama, kategori, stok, lokasi, kondisi, gambar) {
  document.getElementById('detailKode').innerText = kode;
  document.getElementById('detailNamaBahan').innerText = nama;
  document.getElementById('detailKategori').innerText = kategori;
  document.getElementById('detailStok').innerText = Number(stok).toLocaleString("id-ID");
  document.getElementById('detailLokasi').innerText = lokasi;
  document.getElementById('detailKondisi').innerText = kondisi;
  
  // Mengatur sumber gambar (cover) buku
  const imgElement = document.getElementById('detailGambarBuku');
  if (imgElement) {
    imgElement.src = gambar ? gambar : "img/default-book.png";
  }

  const modal = document.getElementById('detailStokModal');
  if (modal) {
    if (typeof modal.showModal === 'function') {
      modal.showModal();
    } else {
      modal.style.display = 'block';
    }
  }
}

// Fungsi untuk menutup modal detail bahan ajar
function tutupDetailModal() {
  const modal = document.getElementById('detailStokModal');
  if (modal) {
    if (typeof modal.close === 'function') {
      modal.close();
    } else {
      modal.style.display = 'none';
    }
  }
}
document.addEventListener("DOMContentLoaded", () => {
  const toast = document.getElementById("toast");
  let toastTimer;

  function showToast(message) {
    if (!toast) { alert(message); return; }
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 3200);
  }

  function rupiah(value) {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
  }

  function tanggal(value) {
    return new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(value + "T00:00:00"));
  }

  // Modal handler
  document.querySelectorAll("[data-modal]").forEach(button => {
    button.addEventListener("click", () => document.getElementById(button.dataset.modal)?.showModal());
  });

  document.querySelectorAll(".modal-close-form").forEach(form => {
    form.addEventListener("submit", () => form.closest("dialog")?.close());
  });

  // Login Form Dinamis mencocokkan dataPengguna dari data.js
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", event => {
      event.preventDefault();
      const email = document.getElementById("email").value.trim().toLowerCase();
      const password = document.getElementById("password").value;

      // Mencari kecocokan dari array dataPengguna
      const akunValid = typeof dataPengguna !== "undefined" && dataPengguna.find(user => user.email.toLowerCase() === email && user.password === password);

      if (akunValid) {
        sessionStorage.setItem("sittaDemoUser", akunValid.nama);
        window.location.href = "dashboard.html";
      } else {
        alert("Email atau password yang Anda masukkan salah.");
      }
    });
  }

  // Form Lupa Password & Register Simulasi
  const forgotForm = document.getElementById("forgotForm");
  if (forgotForm) {
    forgotForm.addEventListener("submit", event => {
      event.preventDefault();
      document.getElementById("forgotModal").close();
      forgotForm.reset();
      showToast("Simulasi: Instruksi pemulihan telah dikirim ke email Anda.");
    });
  }

  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", event => {
      event.preventDefault();
      document.getElementById("registerModal").close();
      registerForm.reset();
      showToast("Pendaftaran demo berhasil. Silakan coba login menggunakan akun terdaftar.");
    });
  }

  // Sapaan Berdasarkan Waktu dan Nama User
  const greeting = document.getElementById("greeting");
  if (greeting) {
    const hour = new Date().getHours();
    greeting.textContent = hour >= 4 && hour < 11 ? "Selamat pagi!" : hour >= 11 && hour < 15 ? "Selamat siang!" : hour >= 15 && hour < 18 ? "Selamat sore!" : "Selamat malam!";
    const userName = sessionStorage.getItem("sittaDemoUser");
    if (userName) document.querySelectorAll(".top-user span:last-child").forEach(el => el.textContent = userName);
  }

  // Dashboard & Tabel Stok (Disesuaikan dengan dataBahanAjar baru)
  const stockTable = document.getElementById("stockTable");
  let stokLokal = typeof dataBahanAjar !== "undefined" ? [...dataBahanAjar] : [];

  function renderStock(query = "") {
    if (!stockTable) return;
    const filtered = stokLokal.filter(item => `${item.kodeBarang} ${item.namaBarang} ${item.jenisBarang} ${item.kodeLokasi}`.toLowerCase().includes(query.toLowerCase()));
    
    stockTable.replaceChildren();
    filtered.forEach(item => {
      const tr = document.createElement("tr");
      const values = [item.kodeBarang, item.namaBarang, item.jenisBarang, Number(item.stok).toLocaleString("id-ID"), item.kodeLokasi];
      values.forEach(value => { const td = document.createElement("td"); td.textContent = value; tr.appendChild(td); });
      
      const status = document.createElement("td");
      
      // DIUBAH: Membuat tombol interaktif untuk kondisi/status
      const btnStatus = document.createElement("button");
      btnStatus.type = "button";
      btnStatus.className = "btn-tersedia-link";
      btnStatus.style.cssText = "background: none; border: none; padding: 0; cursor: pointer; font: inherit;";
      
      const pill = document.createElement("span");
      pill.className = `status-pill ${item.stok <= 20 ? "status-warning" : "status-success"}`;
      pill.textContent = item.stok <= 20 ? "Stok rendah" : "Tersedia";
      
      btnStatus.appendChild(pill);
      
      // Event klik untuk memanggil fungsi modal detail
      btnStatus.addEventListener("click", () => {
        bukaDetailStok(item.kodeBarang, item.namaBarang, item.jenisBarang, item.stok, item.kodeLokasi, pill.textContent, item.cover);
      });
      
      status.appendChild(btnStatus);
      tr.appendChild(status); 
      stockTable.appendChild(tr);
    });
  }

  if (stockTable) {
    renderStock();
    document.getElementById("stockSearch")?.addEventListener("input", event => renderStock(event.target.value));
  }

  // Halaman Tracking (Disesuaikan dengan ID elemen HTML & Chip Demo)
  const trackingForm = document.getElementById("trackingForm");
  const resultContainer = document.getElementById("trackingResult");
  const doInput = document.getElementById("doNumber"); // Diperbaiki dari "trackingInput" ke "doNumber"

  function prosesTracking(nomorDO) {
    if (!resultContainer) return;
    const order = typeof dataTracking !== "undefined" ? dataTracking[nomorDO] : null;

    if (!order) {
      resultContainer.innerHTML = '<section class="empty-state error-state"><h3>Nomor DO tidak ditemukan</h3><p>Pastikan nomor Delivery Order yang Anda masukkan sudah benar.</p></section>';
      return;
    }

    const perjalananHtml = order.perjalanan.map(p => `<li><small>${p.waktu}</small><p>${p.keterangan}</p></li>`).join("");

    resultContainer.innerHTML = `
      <section class="panel tracking-card" style="padding: 20px; background: #fff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
        <h2>Nomor DO: ${order.nomorDO}</h2>
        <p><strong>Status:</strong> ${order.status} (${order.ekspedisi})</p>
        <p><strong>Penerima:</strong> ${order.nama}</p>
        <p><strong>Tanggal Kirim:</strong> ${order.tanggalKirim}</p>
        <p><strong>Total Transaksi:</strong> ${order.total}</p>
        <hr style="margin: 15px 0; border: 0; border-top: 1px solid #eee;">
        <h3>Riwayat Pengiriman</h3>
        <ul style="list-style-type: disc; padding-left: 20px; margin-top: 10px;">${perjalananHtml}</ul>
      </section>
    `;
  }

  if (trackingForm && doInput) {
    trackingForm.addEventListener("submit", event => {
      event.preventDefault();
      prosesTracking(doInput.value.trim());
    });
  }

  // Handler untuk tombol Chip / Demo Nomor DO
  document.querySelectorAll(".example-do .chip").forEach(chip => {
    chip.addEventListener("click", () => {
      const doVal = chip.getAttribute("data-do");
      if (doInput) doInput.value = doVal;
      prosesTracking(doVal);
    });
  });

  // Render Tabel Histori Transaksi Bahan Ajar secara otomatis
  const historyTable = document.getElementById("historyTable");
  if (historyTable && typeof dataTracking !== "undefined") {
    historyTable.replaceChildren();
    Object.values(dataTracking).forEach(order => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><strong>${order.nomorDO}</strong></td>
        <td>${order.nama}</td>
        <td>${order.tanggalKirim}</td>
        <td><span class="status-pill status-success">${order.status}</span></td>
        <td><button type="button" class="btn-sm" style="padding: 4px 8px; cursor: pointer;" onclick="document.getElementById('doNumber').value='${order.nomorDO}';">Pilih</button></td>
      `;
      historyTable.appendChild(tr);
    });
  }
});
