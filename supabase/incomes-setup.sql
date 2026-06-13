-- 収入テーブルと RLS
-- rls-auth.sql 実行済みのプロジェクトで SQL Editor から 1 回 Run

CREATE TABLE IF NOT EXISTS incomes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  amount integer NOT NULL CHECK (amount > 0),
  date date NOT NULL,
  memo text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS incomes_user_id_date_idx
  ON incomes (user_id, date DESC);

ALTER TABLE incomes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "incomes_select_own" ON incomes;
CREATE POLICY "incomes_select_own"
  ON incomes
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "incomes_insert_own" ON incomes;
CREATE POLICY "incomes_insert_own"
  ON incomes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "incomes_update_own" ON incomes;
CREATE POLICY "incomes_update_own"
  ON incomes
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "incomes_delete_own" ON incomes;
CREATE POLICY "incomes_delete_own"
  ON incomes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
