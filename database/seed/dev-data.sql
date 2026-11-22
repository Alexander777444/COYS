-- Deterministic development data. Fixed UUIDs are referenced by the QA suite.
-- created_at is explicit so list ordering (created_at DESC, id ASC) never changes.

INSERT INTO projects (
  id, title, slug, description, client_name, technologies,
  project_url, repository_url, status, created_at, updated_at
) VALUES
(
  '00000000-0000-4000-8000-000000000001',
  'Portfolio Website',
  'portfolio-website',
  'A responsive portfolio website for a software studio.',
  NULL,
  '["Node.js","React"]',
  NULL,
  NULL,
  'PUBLISHED',
  '2026-01-01T10:00:00.000Z',
  '2026-01-01T10:00:00.000Z'
),
(
  '00000000-0000-4000-8000-000000000002',
  'Inventory API',
  'inventory-api',
  'A REST API to manage stock, suppliers and movements.',
  NULL,
  '["Node.js","SQLite"]',
  NULL,
  NULL,
  'PUBLISHED',
  '2026-01-02T10:00:00.000Z',
  '2026-01-02T10:00:00.000Z'
),
(
  '00000000-0000-4000-8000-000000000003',
  'Mobile Booking App',
  'mobile-booking-app',
  'A mobile app for booking appointments and managing schedules.',
  NULL,
  '["React Native"]',
  NULL,
  NULL,
  'PUBLISHED',
  '2026-01-03T10:00:00.000Z',
  '2026-01-03T10:00:00.000Z'
),
(
  '00000000-0000-4000-8000-000000000004',
  'Legacy CRM Migration',
  'legacy-crm-migration',
  'Migration of a legacy CRM database to a modern relational schema.',
  NULL,
  '[]',
  NULL,
  NULL,
  'DRAFT',
  '2026-01-04T10:00:00.000Z',
  '2026-01-04T10:00:00.000Z'
),
(
  '00000000-0000-4000-8000-000000000005',
  'Analytics Dashboard',
  'analytics-dashboard',
  'A dashboard with sales and traffic analytics for small businesses.',
  NULL,
  '["Python","SQL"]',
  NULL,
  NULL,
  'ARCHIVED',
  '2026-01-05T10:00:00.000Z',
  '2026-01-05T10:00:00.000Z'
);
