-- Rows that exercise encoding, length limits, empty arrays and SQL-injection text.
-- Loaded on top of dev-data.sql with `npm run db:seed:edge`.

INSERT INTO projects (
  id, title, slug, description, client_name, technologies,
  project_url, repository_url, status, created_at, updated_at
) VALUES (
  '00000000-0000-4000-8000-000000000101',
  'Diseño "Ágil" y ''calidad'' — ñandú',
  'accents-and-quotes',
  'Descripción con acentos, comillas simples '' y dobles " para probar la codificación.',
  NULL,
  '["Node.js"]',
  NULL,
  NULL,
  'PUBLISHED',
  '2026-01-11T10:00:00.000Z',
  '2026-01-11T10:00:00.000Z'
);

INSERT INTO projects (
  id, title, slug, description, client_name, technologies,
  project_url, repository_url, status, created_at, updated_at
) VALUES (
  '00000000-0000-4000-8000-000000000102',
  '''; DROP TABLE projects; --',
  'sql-injection-attempt',
  'Text is stored literally to prove that queries are parameterized.',
  NULL,
  '[]',
  NULL,
  NULL,
  'DRAFT',
  '2026-01-12T10:00:00.000Z',
  '2026-01-12T10:00:00.000Z'
);

INSERT INTO projects (
  id, title, slug, description, client_name, technologies,
  project_url, repository_url, status, created_at, updated_at
) VALUES (
  '00000000-0000-4000-8000-000000000103',
  replace(hex(zeroblob(150)), '00', 'A'),
  'max-length-fields',
  replace(hex(zeroblob(5000)), '00', 'A'),
  NULL,
  '[]',
  NULL,
  NULL,
  'DRAFT',
  '2026-01-13T10:00:00.000Z',
  '2026-01-13T10:00:00.000Z'
);

INSERT INTO projects (
  id, title, slug, description, client_name, technologies,
  project_url, repository_url, status, created_at, updated_at
) VALUES (
  '00000000-0000-4000-8000-000000000104',
  'Empty Optional Fields',
  'empty-technologies',
  'Row with an empty technologies array and every optional field set to NULL.',
  NULL,
  '[]',
  NULL,
  NULL,
  'DRAFT',
  '2026-01-14T10:00:00.000Z',
  '2026-01-14T10:00:00.000Z'
);

INSERT INTO projects (
  id, title, slug, description, client_name, technologies,
  project_url, repository_url, status, created_at, updated_at
) VALUES (
  '00000000-0000-4000-8000-000000000105',
  'Maximum Length Slug',
  replace(hex(zeroblob(100)), '00', 'a'),
  'Row whose slug uses the full 100-character limit.',
  NULL,
  '[]',
  NULL,
  NULL,
  'DRAFT',
  '2026-01-15T10:00:00.000Z',
  '2026-01-15T10:00:00.000Z'
);
