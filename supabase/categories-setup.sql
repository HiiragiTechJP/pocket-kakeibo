-- カテゴリ機能（ユーザー別・未分類・ドラッグ並び替え）
-- 前提: rls-auth.sql 実行済み
-- 新規: 全文を SQL Editor で Run（1回）
-- 並び替え列だけ足す: 下の「並び順」ブロックのみ Run

-- =============================================================================
-- ① スキーマ
-- =============================================================================

ALTER TABLE categories
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users (id) ON DELETE CASCADE;

ALTER TABLE categories
  ADD COLUMN IF NOT EXISTS is_system boolean NOT NULL DEFAULT false;

ALTER TABLE categories
  ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();

CREATE UNIQUE INDEX IF NOT EXISTS categories_one_system_per_user
  ON categories (user_id)
  WHERE is_system = true;

-- =============================================================================
-- ② データ移行（旧共通カテゴリ seed 利用者向け）
-- =============================================================================

INSERT INTO categories (user_id, name, type, is_system)
SELECT u.id, '未分類', 'expense', true
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1
  FROM categories c
  WHERE c.user_id = u.id
    AND c.is_system = true
);

UPDATE expenses e
SET category_id = c.id
FROM categories c
WHERE c.user_id = e.user_id
  AND c.is_system = true
  AND e.category_id IN (
    'c1000001-0000-4000-8000-000000000001',
    'c1000001-0000-4000-8000-000000000002',
    'c1000001-0000-4000-8000-000000000003',
    'c1000001-0000-4000-8000-000000000004',
    'c1000001-0000-4000-8000-000000000005'
  );

DELETE FROM categories
WHERE user_id IS NULL;

ALTER TABLE categories
  ALTER COLUMN user_id SET NOT NULL;

-- =============================================================================
-- ③ RLS
-- =============================================================================

DROP POLICY IF EXISTS "categories_select_authenticated" ON categories;

DROP POLICY IF EXISTS "categories_select_own" ON categories;
CREATE POLICY "categories_select_own"
  ON categories
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "categories_insert_own" ON categories;
CREATE POLICY "categories_insert_own"
  ON categories
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id AND is_system = false);

DROP POLICY IF EXISTS "categories_insert_system_once" ON categories;
CREATE POLICY "categories_insert_system_once"
  ON categories
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND is_system = true
    AND NOT EXISTS (
      SELECT 1
      FROM categories c
      WHERE c.user_id = auth.uid()
        AND c.is_system = true
    )
  );

DROP POLICY IF EXISTS "categories_update_own" ON categories;
CREATE POLICY "categories_update_own"
  ON categories
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "categories_delete_own" ON categories;
CREATE POLICY "categories_delete_own"
  ON categories
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id AND is_system = false);

-- =============================================================================
-- 並び順（sort_order・ドラッグ並び替え）
-- =============================================================================

ALTER TABLE categories
  ADD COLUMN IF NOT EXISTS sort_order integer NOT NULL DEFAULT 0;

UPDATE categories SET sort_order = 0 WHERE is_system = true;

WITH ranked AS (
  SELECT
    id,
    10 * ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY name) AS new_order
  FROM categories
  WHERE NOT is_system
)
UPDATE categories c
SET sort_order = ranked.new_order
FROM ranked
WHERE c.id = ranked.id;
