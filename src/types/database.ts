// =====================================================
// Types TypeScript du schéma Supabase
// =====================================================
// Ces types reflètent les migrations dans supabase/migrations.
// On peut les régénérer plus tard via :
//   npx supabase gen types typescript --project-id <id> --schema public

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type SubscriptionStatus = "free" | "pack" | "premium";
export type ProjectStatus =
  | "draft"
  | "uploading"
  | "analyzing"
  | "analyzed"
  | "failed";
export type DocumentCategory = "course" | "past_exam" | "syllabus";
export type ConfidenceLevel = "low" | "medium" | "high";
export type SubscriptionPlan = "pack" | "premium";

// -----------------------------------------------------
// Tables
// -----------------------------------------------------
export interface ProfileRow {
  id: string;
  email: string | null;
  full_name: string | null;
  subscription_status: SubscriptionStatus;
  stripe_customer_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectRow {
  id: string;
  user_id: string;
  subject_name: string;
  study_level: string | null;
  exam_type: string | null;
  exam_date: string | null;
  target_grade: string | null;
  available_time_per_day: string | null;
  current_level: string | null;
  status: ProjectStatus;
  preparation_score: number | null;
  created_at: string;
  updated_at: string;
}

export interface DocumentRow {
  id: string;
  project_id: string;
  user_id: string;
  file_name: string;
  file_type: string | null;
  file_size: number | null;
  document_category: DocumentCategory;
  storage_path: string;
  extracted_text: string | null;
  created_at: string;
}

export interface AnalysisRow {
  id: string;
  project_id: string;
  user_id: string;
  global_summary: string | null;
  detected_subject: string | null;
  exam_strategy: string | null;
  preparation_score: number | null;
  confidence_level: ConfidenceLevel | null;
  missing_information: Json;
  detected_chapters: Json;
  priority_chapters: Json;
  revision_sheets: Json;
  mock_exam: Json | null;
  revision_plan: Json;
  next_actions: Json;
  disclaimer: string;
  raw_ai_response: Json | null;
  created_at: string;
}

export interface UsageLimitsRow {
  id: string;
  user_id: string;
  projects_count: number;
  analyses_count: number;
  files_uploaded_count: number;
  updated_at: string;
}

export interface StripeCustomerRow {
  id: string;
  user_id: string;
  stripe_customer_id: string;
  created_at: string;
}

export interface SubscriptionRow {
  id: string;
  user_id: string;
  stripe_subscription_id: string | null;
  status: string | null;
  plan: SubscriptionPlan | null;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
}

// -----------------------------------------------------
// Database type — pour le client Supabase typé
// -----------------------------------------------------
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: Partial<ProfileRow> & { id: string };
        Update: Partial<ProfileRow>;
      };
      projects: {
        Row: ProjectRow;
        Insert: Omit<
          ProjectRow,
          "id" | "created_at" | "updated_at" | "status" | "preparation_score"
        > & {
          id?: string;
          status?: ProjectStatus;
          preparation_score?: number | null;
        };
        Update: Partial<ProjectRow>;
      };
      documents: {
        Row: DocumentRow;
        Insert: Omit<DocumentRow, "id" | "created_at"> & {
          id?: string;
        };
        Update: Partial<DocumentRow>;
      };
      analyses: {
        Row: AnalysisRow;
        Insert: Omit<AnalysisRow, "id" | "created_at" | "disclaimer"> & {
          id?: string;
          disclaimer?: string;
        };
        Update: Partial<AnalysisRow>;
      };
      usage_limits: {
        Row: UsageLimitsRow;
        Insert: Partial<UsageLimitsRow> & { user_id: string };
        Update: Partial<UsageLimitsRow>;
      };
      stripe_customers: {
        Row: StripeCustomerRow;
        Insert: Omit<StripeCustomerRow, "id" | "created_at"> & {
          id?: string;
        };
        Update: Partial<StripeCustomerRow>;
      };
      subscriptions: {
        Row: SubscriptionRow;
        Insert: Omit<SubscriptionRow, "id" | "created_at" | "updated_at"> & {
          id?: string;
        };
        Update: Partial<SubscriptionRow>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
