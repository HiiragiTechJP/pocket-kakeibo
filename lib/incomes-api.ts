import { createClient } from "@/lib/supabase/client";
import type { IncomeInsert, IncomeRecord, IncomeUpdate } from "@/lib/types";

async function getRequiredUserId(): Promise<string> {
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("ログインが必要です");
  }

  return user.id;
}

type IncomeRow = {
  id: string;
  user_id: string;
  amount: number;
  date: string;
  memo: string | null;
  created_at: string;
};

function toIncomeRecord(row: IncomeRow): IncomeRecord {
  return {
    id: row.id,
    user_id: row.user_id,
    amount: row.amount,
    date: row.date.slice(0, 10),
    memo: row.memo,
    created_at: row.created_at,
  };
}

export async function fetchIncomes(): Promise<IncomeRecord[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("incomes")
    .select("*")
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map((row) => toIncomeRecord(row as IncomeRow));
}

export async function createIncome(input: IncomeInsert): Promise<IncomeRecord> {
  const supabase = createClient();
  const userId = await getRequiredUserId();
  const { data, error } = await supabase
    .from("incomes")
    .insert({
      user_id: userId,
      amount: input.amount,
      date: input.date,
      memo: input.memo,
    })
    .select()
    .single();

  if (error) throw error;
  return toIncomeRecord(data as IncomeRow);
}

export async function updateIncome(
  id: string,
  input: IncomeUpdate,
): Promise<IncomeRecord> {
  const supabase = createClient();
  await getRequiredUserId();
  const { data, error } = await supabase
    .from("incomes")
    .update({
      amount: input.amount,
      date: input.date,
      memo: input.memo,
    })
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) throw error;
  if (!data) {
    throw new Error("更新対象の収入が見つかりません");
  }
  return toIncomeRecord(data as IncomeRow);
}

export async function deleteIncome(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("incomes").delete().eq("id", id);

  if (error) throw error;
}
