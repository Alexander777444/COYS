-- Creates the only MVP table. Copied from docs/context/database-structure.md.
-- The database enforces uniqueness (slug -> 409) and allowed statuses, not only the API.
CREATE TABLE projects (
  id             TEXT PRIMARY KEY,
  title          TEXT NOT NULL CHECK (length(title) BETWEEN 1 AND 150),
  slug           TEXT NOT NULL UNIQUE CHECK (length(slug) BETWEEN 1 AND 100),
  description    TEXT NOT NULL CHECK (length(description) BETWEEN 1 AND 5000),
  client_name    TEXT CHECK (client_name IS NULL OR length(client_name) <= 150),
  technologies   TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(technologies)),
  project_url    TEXT,
  repository_url TEXT,
  status         TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT','PUBLISHED','ARCHIVED')),
  created_at     TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at     TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX idx_projects_status ON projects(status);
