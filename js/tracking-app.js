const paketBahanAjarList = [
  {
    kode: "PKT-01",
    nama: "Paket Semester 1 - Ilmu Komunikasi",
    harga: 350000,
    deskripsi: "Pengantar Ilmu Komunikasi, Pengantar Sosiologi, Pendidikan Agama, Bahasa Inggris I"
  },
  {
    kode: "PKT-02",
    nama: "Paket Semester 3 - Manajemen",
    harga: 420000,
    deskripsi: "Manajemen Keuangan, Ekonomi Manajerial, Statistik Bisnis, Hukum Bisnis"
  },
  {
    kode: "PKT-03",
    nama: "Paket Semester 5 - Sistem Informasi",
    harga: 480000,
    deskripsi: "Analisis & Perancangan Sistem, Pemrograman Web, Basis Data Lanjut, Jaringan Komputer"
  }
];

const ekspedisiList = ["JNE Regular", "JNE Express", "POS Indonesia", "SiCepat Express"];

document.addEventListener('DOMContentLoaded', () => {
  const { createApp } = Vue;

  createApp({
    data() {
      return {
        openModal: false,
        searchQuery: "",
        searchResult: null,
        hasSearched: false,
        editingDo: null, // Menyimpan status nomor DO yang sedang di-edit
        trackingList: localStorage.getItem('sitba_tracking_data') 
          ? JSON.parse(localStorage.getItem('sitba_tracking_data')) 
          : [
              {
                noDo: "DO2026-002",
                nim: "055930374",
                nama: "Sukanto",
                ekspedisi: "JNE Regular",
                paket: "Paket Semester 1 - Ilmu Komunikasi",
                selectedPaketKode: ["PKT-01"],
                tanggalKirim: "2026-10-31",
                totalHarga: 350000,
                status: "Diproses"
              },
              {
                noDo: "DO2026-001",
                nim: "012345678",
                nama: "Budi Santoso",
                ekspedisi: "JNE Regular",
                paket: "Paket Semester 1 - Ilmu Komunikasi",
                selectedPaketKode: ["PKT-01"],
                tanggalKirim: "2026-10-25",
                totalHarga: 350000,
                status: "Dalam Pengiriman"
              }
            ],
        form: {
          nim: "",
          nama: "",
          ekspedisi: "",
          selectedPaketKode: []
        },
        ekspedisiOptions: ekspedisiList,
        paketList: paketBahanAjarList
      };
    },
    computed: {
      // Menghasilkan nomor DO otomatis (Hanya berlaku untuk transaksi baru)
      nextDoNumber() {
        if (this.editingDo) return this.editingDo;
        const tahun = new Date().getFullYear();
        const sequence = String(this.trackingList.length + 1).padStart(3, '0');
        return `DO${tahun}-${sequence}`;
      },
      // Menampilkan detail gabungan paket di form (Disesuaikan dengan kebutuhan HTML)
      selectedPaketDetail() {
        if (!Array.isArray(this.form.selectedPaketKode) || this.form.selectedPaketKode.length === 0) return null;
        const selected = this.paketList.filter(p => this.form.selectedPaketKode.includes(p.kode));
        
        return {
          deskripsi: selected.map(p => p.deskripsi).join(" | "),
          harga: selected.reduce((sum, p) => sum + p.harga, 0),
          namaGabungan: selected.map(p => p.nama).join(", ")
        };
      }
    },
    methods: {
      formatRupiah(value) {
        return Number(value).toLocaleString('id-ID');
      },
      searchDO() {
        this.hasSearched = true;
        const query = this.searchQuery.trim().toLowerCase();
        const found = this.trackingList.find(item => item.noDo.toLowerCase() === query);
        this.searchResult = found || null;
      },
      viewDetail(noDo) {
        this.searchQuery = noDo;
        this.searchDO();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      editTransaction(noDo) {
        const itemToEdit = this.trackingList.find(item => item.noDo === noDo);
        if (!itemToEdit) return;

        // Mengisi formulir dengan data lama
        this.form.nim = itemToEdit.nim;
        this.form.nama = itemToEdit.nama;
        this.form.ekspedisi = itemToEdit.ekspedisi;
        this.form.selectedPaketKode = itemToEdit.selectedPaketKode || [];
        
        // Kunci status ke mode EDIT
        this.editingDo = noDo;

        alert(`Nomor DO ${noDo} dimuat ke formulir. Silakan sesuaikan datanya lalu klik Simpan Transaksi.`);
        window.scrollTo({ top: 300, behavior: 'smooth' });
      },
      
      addTransaction() {
        // 1. Validasi field wajib
        if (!this.form.nim || !this.form.nama || !this.form.ekspedisi || this.form.selectedPaketKode.length === 0) {
          alert("Mohon lengkapi seluruh field dan pilih minimal satu paket bahan ajar!");
          return;
        }

        if (this.editingDo) {
          // Mode Edit: Perbarui data
          const index = this.trackingList.findIndex(item => item.noDo === this.editingDo);
          if (index !== -1) {
            this.trackingList[index].nim = this.form.nim;
            this.trackingList[index].nama = this.form.nama;
            this.trackingList[index].ekspedisi = this.form.ekspedisi;
            this.trackingList[index].paket = this.selectedPaketDetail.namaGabungan;
            this.trackingList[index].selectedPaketKode = [...this.form.selectedPaketKode];
            this.trackingList[index].totalHarga = this.selectedPaketDetail.harga;
          }
          this.editingDo = null;
          alert(`Transaksi berhasil diperbarui!`);
        } else {
          // Mode Tambah Baru: Pastikan variabel 'newDo' terdefinisi dengan benar
          const newDo = {
            noDo: this.nextDoNumber,
            nim: this.form.nim,
            nama: this.form.nama,
            ekspedisi: this.form.ekspedisi,
            paket: this.selectedPaketDetail.namaGabungan,
            selectedPaketKode: [...this.form.selectedPaketKode],
            tanggalKirim: new Date().toISOString().split('T')[0],
            totalHarga: this.selectedPaketDetail.harga,
            status: "Diproses"
          };
          
          this.trackingList.unshift(newDo);
          alert(`Transaksi baru berhasil disimpan!`);
        }

        // 2. Simpan ke LocalStorage
        localStorage.setItem('sitba_tracking_data', JSON.stringify(this.trackingList));

        // 3. Reset form input
        this.form.nim = "";
        this.form.nama = "";
        this.form.ekspedisi = "";
        this.form.selectedPaketKode = [];
        this.searchResult = null;
        this.hasSearched = false;

        // 4. TUTUP MODAL SECARA OTOMATIS DI SINI
        this.openModal = false;
      }
    }
  }).mount('#app');
});
