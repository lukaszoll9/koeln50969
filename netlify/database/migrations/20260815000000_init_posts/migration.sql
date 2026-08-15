CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  image_keys TEXT[] NOT NULL,
  display_name TEXT,
  location_text TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  comment TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- pending | approved | rejected
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  moderated_at TIMESTAMPTZ,
  client_ip_hash TEXT
);

CREATE INDEX idx_posts_status ON posts (status);
CREATE INDEX idx_posts_created_at ON posts (created_at DESC);
