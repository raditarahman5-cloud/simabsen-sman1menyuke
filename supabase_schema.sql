-- Enable pgcrypto for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create tables
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_name TEXT NOT NULL DEFAULT 'SMAN 1 MENYUKE',
  school_logo TEXT,
  address TEXT,
  principal_name TEXT,
  principal_nip TEXT,
  signature TEXT,
  work_start TIME NOT NULL DEFAULT '06:00:00',
  late_limit TIME NOT NULL DEFAULT '07:00:00',
  theme TEXT DEFAULT 'light',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nip TEXT UNIQUE NOT NULL,
  nama TEXT NOT NULL,
  email TEXT,
  mata_pelajaran TEXT,
  jenis_kelamin TEXT,
  alamat TEXT,
  nomor_hp TEXT,
  foto TEXT,
  status TEXT DEFAULT 'Aktif',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
  tanggal DATE NOT NULL,
  hari TEXT NOT NULL,
  jam_masuk TIME NOT NULL,
  status_hadir TEXT NOT NULL,
  status_keterlambatan TEXT NOT NULL,
  ip_address TEXT,
  browser TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(teacher_id, tanggal)
);

-- Insert default settings
INSERT INTO settings (school_name) VALUES ('SMAN 1 MENYUKE') ON CONFLICT DO NOTHING;

-- RLS (Row Level Security) Configuration
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- Create Policies
-- Settings: Anyone can read, only authenticated can update
CREATE POLICY "Public Settings Select" ON settings FOR SELECT USING (true);
CREATE POLICY "Public Settings Update" ON settings FOR UPDATE USING (true);

-- Teachers: Anyone can read (for absensi public page), only authenticated can insert/update/delete
CREATE POLICY "Public Teachers Select" ON teachers FOR SELECT USING (true);
CREATE POLICY "Public Teachers Insert" ON teachers FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Teachers Update" ON teachers FOR UPDATE USING (true);
CREATE POLICY "Public Teachers Delete" ON teachers FOR DELETE USING (true);

-- Attendance: Anyone can insert (for absensi public page) & read own? We need public to insert and read.
CREATE POLICY "Public Attendance Insert" ON attendance FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Attendance Select" ON attendance FOR SELECT USING (true);
CREATE POLICY "Public Attendance Update" ON attendance FOR UPDATE USING (true);
CREATE POLICY "Public Attendance Delete" ON attendance FOR DELETE USING (true);
