// =====================================================
// Helpers profil + usage_limits
// =====================================================

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  ProfileRow,
  UsageLimitsRow,
  SubscriptionStatus,
} from "@/types/database";
import { FREE_LIMITS, PREMIUM_LIMITS } from "@/lib/constants";

interface PlanLimits {
  maxProjects: number;
  maxFilesPerProject: number;
  maxAnalyses: number;
}

export interface UserContext {
  profile: ProfileRow | null;
  usage: UsageLimitsRow | null;
  limits: PlanLimits;
  isPremium: boolean;
}

function isPremiumStatus(status: SubscriptionStatus | undefined): boolean {
  return status === "premium" || status === "pack";
}

export async function getUserContext(userId: string): Promise<UserContext> {
  const supabase = createSupabaseServerClient();

  const profileResult = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  const usageResult = await supabase
    .from("usage_limits")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  const profile = profileResult.data as ProfileRow | null;
  const usage = usageResult.data as UsageLimitsRow | null;

  const isPremium = isPremiumStatus(profile?.subscription_status);

  return {
    profile,
    usage,
    limits: isPremium ? PREMIUM_LIMITS : FREE_LIMITS,
    isPremium,
  };
}

export function displayName(
  profile: ProfileRow | null | undefined,
  fallbackEmail?: string | null,
): string {
  if (profile?.full_name && profile.full_name.trim().length > 0) {
    return profile.full_name.trim().split(" ")[0];
  }
  const email = profile?.email ?? fallbackEmail ?? "";
  if (email) return email.split("@")[0];
  return "toi";
}
