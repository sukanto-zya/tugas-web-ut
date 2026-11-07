// js/app.js

// Fungsi untuk membuka modal detail bahan ajar (diletakkan global agar bisa dipanggil dari onclick / event dinamis)
function bukaDetailStok(kode, nama, kategori, stok, lokasi, kondisi, gambar) {
  document.getElementById('detailKode').innerText = kode;
  document.getElementById('detailNamaBahan').innerText = nama;
  document.getElementById('detailKategori').innerText = kategori;
  document.getElementById('detailStok').innerText = Number(stok).toLocaleString("id-ID");
  document.getElementById('detailLokasi').innerText = lokasi;
  document.getElementById('detailKondisi').innerText = kondisi;
  
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

// Seluruh inisialisasi dijalankan 
document.addEventListener("DOMContentLoaded", function() {
    
    // 1. Menghitung Total Jenis & Total Stok (Mendukung dataBahanAjar atau stockBahanAjarData)
    let sumberData = [];
    if (typeof stockBahanAjarData !== "undefined" && Array.isArray(stockBahanAjarData)) {
        sumberData = stockBahanAjarData;
    } else if (typeof dataBahanAjar !== "undefined" && Array.isArray(dataBahanAjar)) {
        sumberData = dataBahanAjar;
    }

    if (sumberData.length > 0) {
        // Total Jenis Bahan Ajar
        const totalJenis = sumberData.length;
        const statTypesEl = document.getElementById("statTypes");
        if (statTypesEl) statTypesEl.textContent = totalJenis;

        // Total Stok Tersedia (Mengecek properti jmlstokbahanajar atau stok)
        const totalStok = sumberData.reduce((accumulator, item) => {
            const jumlah = item.jmlstokbahanajar !== undefined ? Number(item.jmlstokbahanajar) : Number(item.stok || 0);
            return accumulator + jumlah;
        }, 0);

        const statStockEl = document.getElementById("statStock");
        if (statStockEl) {
            statStockEl.textContent = totalStok.toLocaleString("id-ID");
        }
    }

    // Modal handler umum
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
            document.getElementById("forgotModal")?.close();
            forgotForm.reset();
            alert("Simulasi: Instruksi pemulihan telah dikirim ke email Anda.");
        });
    }

    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", event => {
            event.preventDefault();
            document.getElementById("registerModal")?.close();
            registerForm.reset();
            alert("Pendaftaran demo berhasil. Silakan coba login menggunakan akun terdaftar.");
        });
    }

    // Sapaan Berdasarkan Waktu
    const greeting = document.getElementById("greeting");
    if (greeting) {
        const hour = new Date().getHours();
        greeting.textContent = hour >= 4 && hour < 11 ? "Selamat pagi!" : hour >= 11 && hour < 15 ? "Selamat siang!" : hour >= 15 && hour < 18 ? "Selamat sore!" : "Selamat malam!";
    }

    // Pembaruan Nama User yang Login di Sidebar & Topbar secara Menyeluruh
    const userName = sessionStorage.getItem("sittaDemoUser");
    if (userName) {
        document.querySelectorAll(".top-user span").forEach(el => {
            if (!el.querySelector("img") && el.textContent.trim() !== "") {
                el.textContent = userName;
            }
        });
        
        const sidebarUserName = document.querySelector(".sidebar-bottom strong");
        if (sidebarUserName) {
            sidebarUserName.textContent = userName;
        }
    }

    // Dashboard & Tabel Stok
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
            const btnStatus = document.createElement("button");
            btnStatus.type = "button";
            btnStatus.className = "btn-tersedia-link";
            btnStatus.style.cssText = "background: none; border: none; padding: 0; cursor: pointer; font: inherit;";
            
            const pill = document.createElement("span");
            pill.className = `status-pill ${item.stok <= 20 ? "status-warning" : "status-success"}`;
            pill.textContent = item.stok <= 20 ? "Stok rendah" : "Tersedia";
            
            btnStatus.appendChild(pill);
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

    // Halaman Tracking
    const trackingForm = document.getElementById("trackingForm");
    const resultContainer = document.getElementById("trackingResult");
    const doInput = document.getElementById("doNumber");

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

    // Render Aktivitas Terbaru di Dashboard dari dataTracking
    const aktivitasContainer = document.getElementById("aktivitasTerbaruList");
    if (aktivitasContainer && typeof dataTracking !== "undefined") {
        aktivitasContainer.replaceChildren();
        
        const trackingValues = Object.values(dataTracking);
        trackingValues.slice(0, 3).forEach(order => {
            const lastPerjalanan = order.perjalanan && order.perjalanan.length > 0 
                ? order.perjalanan[order.perjalanan.length - 1] 
                : { waktu: order.tanggalKirim, keterangan: order.status };

            const itemDiv = document.createElement("div");
            itemDiv.className = "aktivitas-item";
            itemDiv.style.cssText = "display: flex; gap: 12px; align-items: flex-start; padding: 10px 0; border-bottom: 1px solid #f0f0f0;";
            
            itemDiv.innerHTML = `
              <div style="width: 10px; height: 10px; background: #2563eb; border-radius: 50%; margin-top: 6px;"></div>
              <div style="flex: 1;">
                <div style="display: flex; justify-content: space-between;">
                  <strong>DO: ${order.nomorDO} (${order.nama})</strong>
                  <small class="muted">${lastPerjalanan.waktu}</small>
                </div>
                <p style="margin: 4px 0 0; font-size: 0.9rem; color: #4b5563;">${lastPerjalanan.keterangan}</p>
              </div>
            `;
            aktivitasContainer.appendChild(itemDiv);
        });
    }
});