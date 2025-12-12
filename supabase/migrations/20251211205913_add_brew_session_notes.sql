/*
  # Add Brew Session Notes Table

  1. New Tables
    - `brew_session_notes`
      - Timestamped notes during brew sessions
      - Linked to brew_sessions
      - Allows tracking events during brewing
  
  2. Security
    - Enable RLS
    - Users can manage notes in their own brew sessions
*/

CREATE TABLE IF NOT EXISTS brew_session_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES brew_sessions(id) ON DELETE CASCADE NOT NULL,
  note text NOT NULL,
  timestamp timestamptz DEFAULT now()
);

ALTER TABLE brew_session_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage notes in their sessions"
  ON brew_session_notes FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM brew_sessions
      WHERE brew_sessions.id = brew_session_notes.session_id
      AND brew_sessions.user_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_brew_session_notes_session_id ON brew_session_notes(session_id);