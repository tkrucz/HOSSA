-- SQLite schema for the standalone build. Functionally equivalent to your
-- Postgres schema, with these deliberate differences:
--   - UUID columns are TEXT (SQLite has no native UUID type) - the app
--     generates uuid4() strings in Python before every insert.
--   - No PL/pgSQL: trigger logic goes directly in the trigger body.
--   - AFTER UPDATE (not BEFORE) for both triggers: SQLite trigger bodies
--     can't assign to NEW.column directly like Postgres can - the
--     standard SQLite idiom is an AFTER trigger that issues a follow-up
--     UPDATE on the same row. This relies on SQLite's default
--     `recursive_triggers = OFF`, which prevents that follow-up UPDATE
--     from re-firing these same triggers (no infinite loop, no extra
--     guard code needed).

PRAGMA foreign_keys = ON;

DROP TRIGGER IF EXISTS trg_archive_document_version;
DROP TRIGGER IF EXISTS trg_set_modification_dt;
DROP TABLE IF EXISTS not_applicable_markers;
DROP TABLE IF EXISTS document_versions;
DROP TABLE IF EXISTS documents;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS status;

CREATE TABLE status (
    status_id INTEGER PRIMARY KEY AUTOINCREMENT,
    status TEXT NOT NULL,
    color TEXT NOT NULL
);

INSERT INTO status (status, color)
VALUES
('brak', '9E9D9B'),
('w trakcie przygotowania', 'FFA200'),
('przygotowany', 'A4E805'),
('zatwierdzony', '05E810'),
('nie dotyczy', 'B8A1CC'),
('wymaga zmian', 'E81033');

CREATE TABLE users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_name TEXT NOT NULL,
    user_surname TEXT NOT NULL,
    login TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL  -- always a bcrypt hash, set by the backend
);

-- Placeholder account for sync-created documents (see repository.py). Its
-- hash is not a valid bcrypt hash, so nobody can log in as it.
INSERT INTO users (user_name, user_surname, login, password)
VALUES ('System', 'Synchronizacja', 'system', '!');

CREATE TABLE documents (
    document_id TEXT PRIMARY KEY,
    status_id INTEGER NOT NULL DEFAULT 1,
    doc_name TEXT NOT NULL,
    extension_ TEXT,
    absolute_path TEXT,
    relative_path TEXT UNIQUE,
    size_ INTEGER,
    data_utworzenia_dokumentu TEXT,
    data_zmiany_dokumentu TEXT,
    hash TEXT,
    source_ TEXT,
    rola_osoby_odpowiedzialnej TEXT,
    zatwierdzone INTEGER NOT NULL DEFAULT 0,
    user_id INTEGER NOT NULL DEFAULT 1,
    data_waznosci TEXT,
    start_dt TEXT DEFAULT CURRENT_TIMESTAMP,
    end_dt TEXT,
    data_modyfikacji_statusu_dokumentu TEXT DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (status_id) REFERENCES status(status_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE document_versions (
    version_id TEXT PRIMARY KEY,
    document_id TEXT NOT NULL,
    status_id INTEGER NOT NULL,
    rola_osoby_odpowiedzialnej TEXT,
    zatwierdzone INTEGER NOT NULL DEFAULT 0,
    user_id INTEGER NOT NULL,
    data_waznosci TEXT,
    start_dt TEXT NOT NULL,
    end_dt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (document_id) REFERENCES documents(document_id) ON DELETE CASCADE,
    FOREIGN KEY (status_id) REFERENCES status(status_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE INDEX idx_document_versions_document_id ON document_versions(document_id);

CREATE TABLE not_applicable_markers (
    marker_id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    folder TEXT NOT NULL DEFAULT '',
    stage_name TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(user_id),
    UNIQUE (project_id, folder, stage_name)
);

CREATE INDEX idx_not_applicable_markers_project ON not_applicable_markers(project_id);

-- Bumps data_modyfikacji_statusu_dokumentu whenever anything meaningful
-- about a document changes (mirrors the Postgres version's broad
-- `OLD.* IS DISTINCT FROM NEW.*` check, enumerated explicitly since SQLite
-- has no row-wildcard comparison).
CREATE TRIGGER trg_set_modification_dt
AFTER UPDATE ON documents
FOR EACH ROW
WHEN
    OLD.status_id IS NOT NEW.status_id OR
    OLD.doc_name IS NOT NEW.doc_name OR
    OLD.extension_ IS NOT NEW.extension_ OR
    OLD.absolute_path IS NOT NEW.absolute_path OR
    OLD.relative_path IS NOT NEW.relative_path OR
    OLD.size_ IS NOT NEW.size_ OR
    OLD.data_utworzenia_dokumentu IS NOT NEW.data_utworzenia_dokumentu OR
    OLD.data_zmiany_dokumentu IS NOT NEW.data_zmiany_dokumentu OR
    OLD.hash IS NOT NEW.hash OR
    OLD.source_ IS NOT NEW.source_ OR
    OLD.rola_osoby_odpowiedzialnej IS NOT NEW.rola_osoby_odpowiedzialnej OR
    OLD.zatwierdzone IS NOT NEW.zatwierdzone OR
    OLD.user_id IS NOT NEW.user_id OR
    OLD.data_waznosci IS NOT NEW.data_waznosci
BEGIN
    UPDATE documents
    SET data_modyfikacji_statusu_dokumentu = CURRENT_TIMESTAMP
    WHERE document_id = NEW.document_id;
END;

-- Archives the OUTGOING row into document_versions whenever status,
-- rola_osoby_odpowiedzialnej, zatwierdzone, or data_waznosci change, then
-- resets start_dt on the live row. Routine re-sync noise (hash/size_/
-- data_zmiany_dokumentu/user_id) does NOT trigger a new version.
--
-- NOTE: this generates the archived row's version_id in SQL via a
-- pseudo-random hex string (SQLite has no gen_random_uuid()). It doesn't
-- need to be a real RFC4122 UUID - just unique - so this is fine, but
-- unlike every other id in this app it isn't produced by Python's uuid4().
CREATE TRIGGER trg_archive_document_version
AFTER UPDATE ON documents
FOR EACH ROW
WHEN
    OLD.status_id IS NOT NEW.status_id OR
    OLD.rola_osoby_odpowiedzialnej IS NOT NEW.rola_osoby_odpowiedzialnej OR
    OLD.zatwierdzone IS NOT NEW.zatwierdzone OR
    OLD.data_waznosci IS NOT NEW.data_waznosci
BEGIN
    INSERT INTO document_versions
        (version_id, document_id, status_id, rola_osoby_odpowiedzialnej, zatwierdzone, user_id, data_waznosci, start_dt, end_dt)
    VALUES
        (
            lower(hex(randomblob(16))),
            OLD.document_id,
            OLD.status_id,
            OLD.rola_osoby_odpowiedzialnej,
            OLD.zatwierdzone,
            OLD.user_id,
            OLD.data_waznosci,
            OLD.start_dt,
            CURRENT_TIMESTAMP
        );

    UPDATE documents
    SET start_dt = CURRENT_TIMESTAMP
    WHERE document_id = NEW.document_id;
END;