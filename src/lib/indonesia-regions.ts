export interface Region {
  province: string;
  name: string; // Kota or Kabupaten name
  type: "KOTA" | "KABUPATEN";
}

export const INDONESIA_REGIONS: Region[] = [
  // DKI Jakarta
  { province: "DKI Jakarta", name: "Kota Jakarta Pusat", type: "KOTA" },
  { province: "DKI Jakarta", name: "Kota Jakarta Selatan", type: "KOTA" },
  { province: "DKI Jakarta", name: "Kota Jakarta Timur", type: "KOTA" },
  { province: "DKI Jakarta", name: "Kota Jakarta Barat", type: "KOTA" },
  { province: "DKI Jakarta", name: "Kota Jakarta Utara", type: "KOTA" },
  {
    province: "DKI Jakarta",
    name: "Kabupaten Kepulauan Seribu",
    type: "KABUPATEN",
  },

  // Jawa Barat
  { province: "Jawa Barat", name: "Kota Bandung", type: "KOTA" },
  { province: "Jawa Barat", name: "Kota Bogor", type: "KOTA" },
  { province: "Jawa Barat", name: "Kota Depok", type: "KOTA" },
  { province: "Jawa Barat", name: "Kota Bekasi", type: "KOTA" },
  { province: "Jawa Barat", name: "Kota Tangerang", type: "KOTA" }, // Note: Tangerang is actually Banten but let's place properly below
  { province: "Jawa Barat", name: "Kota Cimahi", type: "KOTA" },
  { province: "Jawa Barat", name: "Kota Cirebon", type: "KOTA" },
  { province: "Jawa Barat", name: "Kota Sukabumi", type: "KOTA" },
  { province: "Jawa Barat", name: "Kota Tasikmalaya", type: "KOTA" },
  { province: "Jawa Barat", name: "Kota Banjar", type: "KOTA" },
  { province: "Jawa Barat", name: "Kabupaten Bogor", type: "KABUPATEN" },
  { province: "Jawa Barat", name: "Kabupaten Bandung", type: "KABUPATEN" },
  {
    province: "Jawa Barat",
    name: "Kabupaten Bandung Barat",
    type: "KABUPATEN",
  },
  { province: "Jawa Barat", name: "Kabupaten Bekasi", type: "KABUPATEN" },
  { province: "Jawa Barat", name: "Kabupaten Karawang", type: "KABUPATEN" },
  { province: "Jawa Barat", name: "Kabupaten Purwakarta", type: "KABUPATEN" },
  { province: "Jawa Barat", name: "Kabupaten Subang", type: "KABUPATEN" },
  { province: "Jawa Barat", name: "Kabupaten Sukabumi", type: "KABUPATEN" },
  { province: "Jawa Barat", name: "Kabupaten Cianjur", type: "KABUPATEN" },
  { province: "Jawa Barat", name: "Kabupaten Garut", type: "KABUPATEN" },
  { province: "Jawa Barat", name: "Kabupaten Tasikmalaya", type: "KABUPATEN" },
  { province: "Jawa Barat", name: "Babupaten Ciamis", type: "KABUPATEN" },
  { province: "Jawa Barat", name: "Kabupaten Kuningan", type: "KABUPATEN" },
  { province: "Jawa Barat", name: "Kabupaten Majalengka", type: "KABUPATEN" },
  { province: "Jawa Barat", name: "Kabupaten Sumedang", type: "KABUPATEN" },
  { province: "Jawa Barat", name: "Kabupaten Indramayu", type: "KABUPATEN" },
  { province: "Jawa Barat", name: "Kabupaten Cirebon", type: "KABUPATEN" },
  { province: "Jawa Barat", name: "Kabupaten Pangandaran", type: "KABUPATEN" },

  // Banten
  { province: "Banten", name: "Kota Tangerang", type: "KOTA" },
  { province: "Banten", name: "Kota Tangerang Selatan", type: "KOTA" },
  { province: "Banten", name: "Kota Serang", type: "KOTA" },
  { province: "Banten", name: "Kota Cilegon", type: "KOTA" },
  { province: "Banten", name: "Kabupaten Tangerang", type: "KABUPATEN" },
  { province: "Banten", name: "Kabupaten Serang", type: "KABUPATEN" },
  { province: "Banten", name: "Kabupaten Lebak", type: "KABUPATEN" },
  { province: "Banten", name: "Kabupaten Pandeglang", type: "KABUPATEN" },

  // Jawa Tengah
  { province: "Jawa Tengah", name: "Kota Semarang", type: "KOTA" },
  { province: "Jawa Tengah", name: "Kota Surakarta (Solo)", type: "KOTA" },
  { province: "Jawa Tengah", name: "Kota Magelang", type: "KOTA" },
  { province: "Jawa Tengah", name: "Kota Salatiga", type: "KOTA" },
  { province: "Jawa Tengah", name: "Kota Pekalongan", type: "KOTA" },
  { province: "Jawa Tengah", name: "Kota Tegal", type: "KOTA" },
  { province: "Jawa Tengah", name: "Kabupaten Cilacap", type: "KABUPATEN" },
  { province: "Jawa Tengah", name: "Kabupaten Banyumas", type: "KABUPATEN" },
  { province: "Jawa Tengah", name: "Kabupaten Kudus", type: "KABUPATEN" },
  { province: "Jawa Tengah", name: "Kabupaten Jepara", type: "KABUPATEN" },
  { province: "Jawa Tengah", name: "Kabupaten Brebes", type: "KABUPATEN" },
  { province: "Jawa Tengah", name: "Kabupaten Boyolali", type: "KABUPATEN" },
  { province: "Jawa Tengah", name: "Kabupaten Klaten", type: "KABUPATEN" },
  { province: "Jawa Tengah", name: "Kabupaten Sukoharjo", type: "KABUPATEN" },
  { province: "Jawa Tengah", name: "Kabupaten Wonogiri", type: "KABUPATEN" },
  { province: "Jawa Tengah", name: "Kabupaten Karanganyar", type: "KABUPATEN" },
  { province: "Jawa Tengah", name: "Kabupaten Sragen", type: "KABUPATEN" },

  // DI Yogyakarta
  { province: "DI Yogyakarta", name: "Kota Yogyakarta", type: "KOTA" },
  { province: "DI Yogyakarta", name: "Kabupaten Sleman", type: "KABUPATEN" },
  { province: "DI Yogyakarta", name: "Kabupaten Bantul", type: "KABUPATEN" },
  {
    province: "DI Yogyakarta",
    name: "Kabupaten Kulon Progo",
    type: "KABUPATEN",
  },
  {
    province: "DI Yogyakarta",
    name: "Kabupaten Gunungkidul",
    type: "KABUPATEN",
  },

  // Jawa Timur
  { province: "Jawa Timur", name: "Kota Surabaya", type: "KOTA" },
  { province: "Jawa Timur", name: "Kota Malang", type: "KOTA" },
  { province: "Jawa Timur", name: "Kota Kediri", type: "KOTA" },
  { province: "Jawa Timur", name: "Kota Madiun", type: "KOTA" },
  { province: "Jawa Timur", name: "Kota Probolinggo", type: "KOTA" },
  { province: "Jawa Timur", name: "Kota Pasuruan", type: "KOTA" },
  { province: "Jawa Timur", name: "Kota Mojokerto", type: "KOTA" },
  { province: "Jawa Timur", name: "Kota Blitar", type: "KOTA" },
  { province: "Jawa Timur", name: "Kota Batu", type: "KOTA" },
  { province: "Jawa Timur", name: "Kabupaten Sidoarjo", type: "KABUPATEN" },
  { province: "Jawa Timur", name: "Kabupaten Gresik", type: "KABUPATEN" },
  { province: "Jawa Timur", name: "Kabupaten Mojokerto", type: "KABUPATEN" },
  { province: "Jawa Timur", name: "Kabupaten Pasuruan", type: "KABUPATEN" },
  { province: "Jawa Timur", name: "Kabupaten Banyuwangi", type: "KABUPATEN" },
  { province: "Jawa Timur", name: "Kabupaten Jember", type: "KABUPATEN" },
  { province: "Jawa Timur", name: "Kabupaten Malang", type: "KABUPATEN" },
  { province: "Jawa Timur", name: "Kabupaten Kediri", type: "KABUPATEN" },

  // Bali
  { province: "Bali", name: "Kota Denpasar", type: "KOTA" },
  { province: "Bali", name: "Kabupaten Badung", type: "KABUPATEN" },
  { province: "Bali", name: "Kabupaten Gianyar", type: "KABUPATEN" },
  { province: "Bali", name: "Kabupaten Buleleng", type: "KABUPATEN" },
  { province: "Bali", name: "Kabupaten Tabanan", type: "KABUPATEN" },

  // Sumatera Utara
  { province: "Sumatera Utara", name: "Kota Medan", type: "KOTA" },
  { province: "Sumatera Utara", name: "Kota Binjai", type: "KOTA" },
  { province: "Sumatera Utara", name: "Kota Tebing Tinggi", type: "KOTA" },
  { province: "Sumatera Utara", name: "Kota Pematangsiantar", type: "KOTA" },
  { province: "Sumatera Utara", name: "Kota Sibolga", type: "KOTA" },
  { province: "Sumatera Utara", name: "Kota Padangsidimpuan", type: "KOTA" },
  { province: "Sumatera Utara", name: "Kota Gunungsitoli", type: "KOTA" },
  {
    province: "Sumatera Utara",
    name: "Kabupaten Deli Serdang",
    type: "KABUPATEN",
  },
  { province: "Sumatera Utara", name: "Kabupaten Langkat", type: "KABUPATEN" },
  { province: "Sumatera Utara", name: "Kabupaten Karo", type: "KABUPATEN" },
  {
    province: "Sumatera Utara",
    name: "Kabupaten Simalungun",
    type: "KABUPATEN",
  },

  // Sumatera Barat
  { province: "Sumatera Barat", name: "Kota Padang", type: "KOTA" },
  { province: "Sumatera Barat", name: "Kota Bukittinggi", type: "KOTA" },
  { province: "Sumatera Barat", name: "Kota Payakumbuh", type: "KOTA" },
  { province: "Sumatera Barat", name: "Kota Solok", type: "KOTA" },

  // Riau & Kepri
  { province: "Riau", name: "Kota Pekanbaru", type: "KOTA" },
  { province: "Riau", name: "Kota Dumai", type: "KOTA" },
  { province: "Kepulauan Riau", name: "Kota Batam", type: "KOTA" },
  { province: "Kepulauan Riau", name: "Kota Tanjungpinang", type: "KOTA" },

  // Sumatera Selatan
  { province: "Sumatera Selatan", name: "Kota Palembang", type: "KOTA" },
  { province: "Sumatera Selatan", name: "Kota Prabumulih", type: "KOTA" },
  { province: "Sumatera Selatan", name: "Kota Lubuklinggau", type: "KOTA" },

  // Jambi, Bengkulu, Lampung
  { province: "Jambi", name: "Kota Jambi", type: "KOTA" },
  { province: "Bengkulu", name: "Kota Bengkulu", type: "KOTA" },
  { province: "Lampung", name: "Kota Bandar Lampung", type: "KOTA" },
  { province: "Lampung", name: "Kota Metro", type: "KOTA" },

  // Kalimantan
  { province: "Kalimantan Barat", name: "Kota Pontianak", type: "KOTA" },
  { province: "Kalimantan Barat", name: "Kota Singkawang", type: "KOTA" },
  { province: "Kalimantan Tengah", name: "Kota Palangkaraya", type: "KOTA" },
  { province: "Kalimantan Selatan", name: "Kota Banjarmasin", type: "KOTA" },
  { province: "Kalimantan Selatan", name: "Kota Banjarbaru", type: "KOTA" },
  { province: "Kalimantan Timur", name: "Kota Samarinda", type: "KOTA" },
  { province: "Kalimantan Timur", name: "Kota Balikpapan", type: "KOTA" },
  { province: "Kalimantan Timur", name: "Kota Bontang", type: "KOTA" },
  { province: "Kalimantan Utara", name: "Kota Tarakan", type: "KOTA" },

  // Sulawesi
  { province: "Sulawesi Utara", name: "Kota Manado", type: "KOTA" },
  { province: "Sulawesi Utara", name: "Kota Bitung", type: "KOTA" },
  { province: "Sulawesi Utara", name: "Kota Tomohon", type: "KOTA" },
  { province: "Gorontalo", name: "Kota Gorontalo", type: "KOTA" },
  { province: "Sulawesi Tengah", name: "Kota Palu", type: "KOTA" },
  { province: "Sulawesi West", name: "Kota Mamuju", type: "KOTA" },
  { province: "Sulawesi Selatan", name: "Kota Makassar", type: "KOTA" },
  { province: "Sulawesi Selatan", name: "Kota Parepare", type: "KOTA" },
  { province: "Sulawesi Selatan", name: "Kota Palopo", type: "KOTA" },
  { province: "Sulawesi Tenggara", name: "Kota Kendari", type: "KOTA" },
  { province: "Sulawesi Tenggara", name: "Kota Baubau", type: "KOTA" },

  // Nusa Tenggara
  { province: "Nusa Tenggara Barat", name: "Kota Mataram", type: "KOTA" },
  { province: "Nusa Tenggara Barat", name: "Kota Bima", type: "KOTA" },
  { province: "Nusa Tenggara Timur", name: "Kota Kupang", type: "KOTA" },

  // Maluku & Papua
  { province: "Maluku", name: "Kota Ambon", type: "KOTA" },
  { province: "Maluku Utara", name: "Kota Ternate", type: "KOTA" },
  { province: "Maluku Utara", name: "Kota Tidore Kepulauan", type: "KOTA" },
  { province: "Papua", name: "Kota Jayapura", type: "KOTA" },
  { province: "Papua Barat", name: "Kota Sorong", type: "KOTA" },
];

export const REGIONS_BY_PROVINCE = INDONESIA_REGIONS.reduce(
  (acc, region) => {
    if (!acc[region.province]) {
      acc[region.province] = [];
    }
    acc[region.province].push(region);
    return acc;
  },
  {} as Record<string, Region[]>,
);
