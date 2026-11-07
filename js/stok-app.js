const stockBahanAjarData = [
  {
    kodematakuliah: "STSI4101",
    namamatakulaih: "Pengantar Sistem Informasi",
    kategorimatakulaih: "BMP",
    "ut-daerah": "Bandung",
    lokasirak: "2",
    jmlstokbahanajar: 54,
    jmlstoksafetybahanajar: 50,
    keterangan: "ADA",
    catatan: "Modul edisi revisi"
  },
  {
    kodematakuliah: "STMA4113",
    namamatakulaih: "Aljabar Linear Elementer 8",
    kategorimatakulaih: "BMP",
    "ut-daerah": "Bandung",
    lokasirak: "2",
    jmlstokbahanajar: 22,
    jmlstoksafetybahanajar: 30,
    keterangan: "ADA",
    catatan: ""
  },
  {
    kodematakuliah: "ASIP4301",
    namamatakulaih: "Pengantar Ilmu Komunikasi",
    kategorimatakulaih: "BMP",
    "ut-daerah": "Jakarta",
    lokasirak: "0TMP01",
    jmlstokbahanajar: 548,
    jmlstoksafetybahanajar: 100,
    keterangan: "ADA",
    catatan: ""
  }
];

document.addEventListener('DOMContentLoaded', () => {
  const { createApp } = Vue;

  createApp({
    data() {
      return {
        upbjjList: ['Bandung', 'Jakarta', 'Surabaya', 'Yogyakarta', 'Medan'], // Sesuaikan dengan daftar UT Daerah
        kategoriList: ['BMP', 'Non-BMP', 'Modul Pendukung', 'Rangkuman'],     // Sesuaikan dengan kategori yang digunakan
        // Ambil data awal dari localStorage jika ada, jika tidak gunakan stockBahanAjarData
        stokList: JSON.parse(localStorage.getItem('sitba_stok_data')) || stockBahanAjarData,
        openModal: false,
        editingKodeMatakuliah: null,
        formError: "",
        searchQuery: "",
        selectedUpbjj: "",
        selectedKategori: "",
        filterReorderOnly: false,
        sortBy: "judul",
        form: {
          kodematakuliah: "",
          namamatakulaih: "",
          kategorimatakulaih: "",
          "ut-daerah": "",
          lokasirak: "",
          jmlstokbahanajar: 0,
          jmlstoksafetybahanajar: 0,
          keterangan: "ADA",
          catatan: ""
        }
      };
    },
    computed: {
      totalJenisBahanAjar() {
        return this.filteredStok.length;
      },
      totalStokQty() {
        return this.filteredStok.reduce((acc, item) => acc + Number(item.jmlstokbahanajar), 0);
      },
      lowStockCount() {
        return this.stokList.filter(item => Number(item.jmlstokbahanajar) <= Number(item.jmlstoksafetybahanajar) || Number(item.jmlstokbahanajar) === 0).length;
      },
      filteredStok() {
        let result = this.stokList.filter(item => {
          const matchesSearch = item.kodematakuliah.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                                item.namamatakulaih.toLowerCase().includes(this.searchQuery.toLowerCase());
          const matchesUpbjj = this.selectedUpbjj ? item["ut-daerah"] === this.selectedUpbjj : true;
          const matchesKategori = this.selectedKategori ? item.kategorimatakulaih === this.selectedKategori : true;
          const matchesReorder = this.filterReorderOnly ? (Number(item.jmlstokbahanajar) <= Number(item.jmlstoksafetybahanajar) || Number(item.jmlstokbahanajar) === 0) : true;

          return matchesSearch && matchesUpbjj && matchesKategori && matchesReorder;
        });

        result.sort((a, b) => {
          if (this.sortBy === 'judul') {
            return a.namamatakulaih.localeCompare(b.namamatakulaih);
          } else if (this.sortBy === 'stok') {
            return b.jmlstokbahanajar - a.jmlstokbahanajar;
          }
          return 0;
        });

        return result;
      }
    },
    watch: {
      selectedUpbjj(newVal) {
        if (!newVal) this.selectedKategori = "";
      }
    },
    methods: {
      resetFilter() {
        this.searchQuery = "";
        this.selectedUpbjj = "";
        this.selectedKategori = "";
        this.filterReorderOnly = false;
        this.sortBy = "judul";
      },
      // Contoh fungsi saat tombol ＋ Tambah Stok diklik:
openModalTambah() {
  this.editingKodeMatakuliah = null; // Reset ke mode tambah
  this.form = {
    kodematakuliah: "",
    namamatakulaih: "",
    kategorimatakulaih: "",
    "ut-daerah": "",
    lokasirak: "",
    jmlstokbahanajar: 0,
    jmlstoksafetybahanajar: 0,
    keterangan: "ADA",
    catatan: ""
  };
  this.openModal = true;
},

// Contoh metode saat tombol Edit pada tabel diklik:
editDataStok(item, index) {
  this.editingKodeMatakuliah = item.kodematakuliah; // PERBAIKAN: Gunakan editingKodeMatakuliah agar sinkron
  
  // Salin data baris ke dalam form
  this.form = {
    kodematakuliah: item.kodematakuliah,
    namamatakulaih: item.namamatakulaih,
    kategorimatakulaih: item.kategorimatakulaih,
    "ut-daerah": item["ut-daerah"],
    lokasirak: item.lokasirak,
    jmlstokbahanajar: item.jmlstokbahanajar,
    jmlstoksafetybahanajar: item.jmlstoksafetybahanajar,
    keterangan: item.keterangan,
    catatan: item.catatan
  };
  
  this.openModal = true; // Buka pop-up
},

tambahDataStok() {
  if (!this.form.kodematakuliah || !this.form.namamatakulaih || !this.form["ut-daerah"]) {
    this.formError = "Mohon lengkapi data wajib (Kode, Nama Matakuliah, dan UT Daerah)!";
    return;
  }

  const dataProcessed = {
    kodematakuliah: this.form.kodematakuliah.toUpperCase().trim(),
    namamatakulaih: this.form.namamatakulaih.trim(),
    kategorimatakulaih: this.form.kategorimatakulaih || "BMP",
    "ut-daerah": this.form["ut-daerah"],
    lokasirak: this.form.lokasirak.toUpperCase().trim() || "1",
    jmlstokbahanajar: Number(this.form.jmlstokbahanajar),
    jmlstoksafetybahanajar: Number(this.form.jmlstoksafetybahanajar),
    keterangan: Number(this.form.jmlstokbahanajar) > 0 ? "ADA" : "HABIS",
    catatan: this.form.catatan.trim()
  };

  if (this.editingKodeMatakuliah !== null) {
    // Mode Edit: Cari berdasarkan kode mata kuliah asli yang sedang diedit
    const originalIndex = this.stokList.findIndex(item => item.kodematakuliah === this.editingKodeMatakuliah);
    if (originalIndex !== -1) {
      this.stokList[originalIndex] = dataProcessed;
    }
    alert(`Data Bahan Ajar ${dataProcessed.kodematakuliah} berhasil diperbarui!`);
  } else {
    // Mode Tambah Baru: Cek duplikasi kode
    const isDuplicate = this.stokList.some(item => item.kodematakuliah === dataProcessed.kodematakuliah);
    if (isDuplicate) {
      this.formError = `Kode Mata kuliah ${dataProcessed.kodematakuliah} sudah terdaftar di sistem!`;
      return;
    }
    
    this.stokList.unshift(dataProcessed);
    alert(`Data Bahan Ajar baru berhasil ditambahkan!`);
  }

  localStorage.setItem('sitba_stok_data', JSON.stringify(this.stokList));

  this.formError = "";
  this.openModal = false;
  this.editingKodeMatakuliah = null;
},


      hapusDataStok(kodematakuliah) {
        if (confirm(`Apakah Anda yakin ingin menghapus data bahan ajar dengan kode ${kodematakuliah}?`)) {
          this.stokList = this.stokList.filter(item => item.kodematakuliah !== kodematakuliah);
          localStorage.setItem('sitba_stok_data', JSON.stringify(this.stokList));
          alert(`Data ${kodematakuliah} berhasil dihapus.`);
        }
      }
    }
  }).mount('.app-layout');
});