CREATE TABLE IF NOT EXISTS palette_ (
  id bigint UNIQUE GENERATED ALWAYS AS IDENTITY,
  name text NOT NULL,
  thumbnail_colors text[],
  raw_css text NOT NULL
);

CREATE TABLE IF NOT EXISTS project_ (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  palette_id bigint REFERENCES palette_(id) DEFAULT 0,
  prompt text NOT NULL,
  public boolean DEFAULT true
);

CREATE TABLE IF NOT EXISTS preview_ (
  id bigint UNIQUE GENERATED ALWAYS AS IDENTITY,
  project_id uuid REFERENCES project_(id),
  version smallint DEFAULT 0,
  prompt text NOT NULL,
  code text,
  thumbnail_src text,
  UNIQUE (project_id, version)
);