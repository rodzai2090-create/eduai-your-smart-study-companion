export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      activity_log: {
        Row: {
          activity_type: string
          created_at: string
          id: string
          minutes: number
          topic_id: string | null
          user_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string
          id?: string
          minutes?: number
          topic_id?: string | null
          user_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string
          id?: string
          minutes?: number
          topic_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_log_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      bookmarks: {
        Row: {
          created_at: string
          id: string
          topic_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          topic_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          topic_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookmarks_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      chapters: {
        Row: {
          chapter_number: number
          created_at: string
          description: string | null
          id: string
          name: string
          status: boolean
          subject_id: string
          updated_at: string
        }
        Insert: {
          chapter_number: number
          created_at?: string
          description?: string | null
          id?: string
          name: string
          status?: boolean
          subject_id: string
          updated_at?: string
        }
        Update: {
          chapter_number?: number
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          status?: boolean
          subject_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chapters_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          board_id: string
          created_at: string
          id: string
          level: number
          name: string
          status: boolean
          updated_at: string
        }
        Insert: {
          board_id: string
          created_at?: string
          id?: string
          level: number
          name: string
          status?: boolean
          updated_at?: string
        }
        Update: {
          board_id?: string
          created_at?: string
          id?: string
          level?: number
          name?: string
          status?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "classes_board_id_fkey"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "education_boards"
            referencedColumns: ["id"]
          },
        ]
      }
      countries: {
        Row: {
          code: string
          created_at: string
          id: string
          name: string
          status: boolean
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          name: string
          status?: boolean
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          name?: string
          status?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      education_boards: {
        Row: {
          code: string
          country_id: string
          created_at: string
          description: string | null
          id: string
          name: string
          status: boolean
          updated_at: string
        }
        Insert: {
          code: string
          country_id: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          status?: boolean
          updated_at?: string
        }
        Update: {
          code?: string
          country_id?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          status?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "education_boards_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
      flashcard_reviews: {
        Row: {
          due_at: string
          flashcard_id: string
          id: string
          interval_days: number
          reviewed_at: string
          state: Database["public"]["Enums"]["flashcard_state"]
          user_id: string
        }
        Insert: {
          due_at?: string
          flashcard_id: string
          id?: string
          interval_days?: number
          reviewed_at?: string
          state?: Database["public"]["Enums"]["flashcard_state"]
          user_id: string
        }
        Update: {
          due_at?: string
          flashcard_id?: string
          id?: string
          interval_days?: number
          reviewed_at?: string
          state?: Database["public"]["Enums"]["flashcard_state"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "flashcard_reviews_flashcard_id_fkey"
            columns: ["flashcard_id"]
            isOneToOne: false
            referencedRelation: "flashcards"
            referencedColumns: ["id"]
          },
        ]
      }
      flashcards: {
        Row: {
          back: string
          created_at: string
          front: string
          id: string
          is_demo: boolean
          status: boolean
          topic_id: string
          updated_at: string
        }
        Insert: {
          back: string
          created_at?: string
          front: string
          id?: string
          is_demo?: boolean
          status?: boolean
          topic_id: string
          updated_at?: string
        }
        Update: {
          back?: string
          created_at?: string
          front?: string
          id?: string
          is_demo?: boolean
          status?: boolean
          topic_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "flashcards_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          created_at: string
          examples: string | null
          explanation: string | null
          formulas: string[]
          id: string
          is_demo: boolean
          key_concepts: string[]
          notes: string | null
          status: boolean
          summary: string | null
          title: string
          topic_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          examples?: string | null
          explanation?: string | null
          formulas?: string[]
          id?: string
          is_demo?: boolean
          key_concepts?: string[]
          notes?: string | null
          status?: boolean
          summary?: string | null
          title: string
          topic_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          examples?: string | null
          explanation?: string | null
          formulas?: string[]
          id?: string
          is_demo?: boolean
          key_concepts?: string[]
          notes?: string | null
          status?: boolean
          summary?: string | null
          title?: string
          topic_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lessons_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          board_id: string | null
          class_id: string | null
          country_id: string | null
          created_at: string
          daily_study_minutes: number
          email: string | null
          exam_date: string | null
          full_name: string | null
          id: string
          onboarded: boolean
          preferred_days: string[]
          updated_at: string
        }
        Insert: {
          board_id?: string | null
          class_id?: string | null
          country_id?: string | null
          created_at?: string
          daily_study_minutes?: number
          email?: string | null
          exam_date?: string | null
          full_name?: string | null
          id: string
          onboarded?: boolean
          preferred_days?: string[]
          updated_at?: string
        }
        Update: {
          board_id?: string | null
          class_id?: string | null
          country_id?: string | null
          created_at?: string
          daily_study_minutes?: number
          email?: string | null
          exam_date?: string | null
          full_name?: string | null
          id?: string
          onboarded?: boolean
          preferred_days?: string[]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_board_id_fkey"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "education_boards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
      question_attempts: {
        Row: {
          created_at: string
          given_answer: string | null
          id: string
          is_correct: boolean
          question_id: string
          time_seconds: number
          topic_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          given_answer?: string | null
          id?: string
          is_correct?: boolean
          question_id: string
          time_seconds?: number
          topic_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          given_answer?: string | null
          id?: string
          is_correct?: boolean
          question_id?: string
          time_seconds?: number
          topic_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_attempts_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "question_attempts_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          correct_answer: string | null
          created_at: string
          difficulty: Database["public"]["Enums"]["difficulty_level"]
          explanation: string | null
          id: string
          is_demo: boolean
          options: Json
          prompt: string
          status: boolean
          topic_id: string
          type: Database["public"]["Enums"]["question_type"]
          updated_at: string
        }
        Insert: {
          correct_answer?: string | null
          created_at?: string
          difficulty?: Database["public"]["Enums"]["difficulty_level"]
          explanation?: string | null
          id?: string
          is_demo?: boolean
          options?: Json
          prompt: string
          status?: boolean
          topic_id: string
          type?: Database["public"]["Enums"]["question_type"]
          updated_at?: string
        }
        Update: {
          correct_answer?: string | null
          created_at?: string
          difficulty?: Database["public"]["Enums"]["difficulty_level"]
          explanation?: string | null
          id?: string
          is_demo?: boolean
          options?: Json
          prompt?: string
          status?: boolean
          topic_id?: string
          type?: Database["public"]["Enums"]["question_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "questions_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_attempts: {
        Row: {
          correct_answers: number
          created_at: string
          details: Json
          duration_seconds: number
          id: string
          scope_id: string | null
          scope_type: string
          score_percent: number
          subject_id: string | null
          total_questions: number
          user_id: string
        }
        Insert: {
          correct_answers?: number
          created_at?: string
          details?: Json
          duration_seconds?: number
          id?: string
          scope_id?: string | null
          scope_type?: string
          score_percent?: number
          subject_id?: string | null
          total_questions?: number
          user_id: string
        }
        Update: {
          correct_answers?: number
          created_at?: string
          details?: Json
          duration_seconds?: number
          id?: string
          scope_id?: string | null
          scope_type?: string
          score_percent?: number
          subject_id?: string | null
          total_questions?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_attempts_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      student_subjects: {
        Row: {
          created_at: string
          id: string
          subject_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          subject_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          subject_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_subjects_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      study_plans: {
        Row: {
          created_at: string
          daily_minutes: number
          exam_date: string | null
          id: string
          is_active: boolean
          name: string
          preferred_days: string[]
          target_date: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          daily_minutes?: number
          exam_date?: string | null
          id?: string
          is_active?: boolean
          name?: string
          preferred_days?: string[]
          target_date?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          daily_minutes?: number
          exam_date?: string | null
          id?: string
          is_active?: boolean
          name?: string
          preferred_days?: string[]
          target_date?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      study_tasks: {
        Row: {
          completed_at: string | null
          created_at: string
          estimated_minutes: number
          id: string
          plan_id: string
          priority: number
          scheduled_date: string
          subject_id: string | null
          task_type: Database["public"]["Enums"]["task_type"]
          title: string
          topic_id: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          estimated_minutes?: number
          id?: string
          plan_id: string
          priority?: number
          scheduled_date: string
          subject_id?: string | null
          task_type?: Database["public"]["Enums"]["task_type"]
          title: string
          topic_id?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          estimated_minutes?: number
          id?: string
          plan_id?: string
          priority?: number
          scheduled_date?: string
          subject_id?: string | null
          task_type?: Database["public"]["Enums"]["task_type"]
          title?: string
          topic_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "study_tasks_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "study_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "study_tasks_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "study_tasks_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      subjects: {
        Row: {
          class_id: string
          code: string
          created_at: string
          description: string | null
          id: string
          name: string
          status: boolean
          updated_at: string
        }
        Insert: {
          class_id: string
          code: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          status?: boolean
          updated_at?: string
        }
        Update: {
          class_id?: string
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          status?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subjects_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      topic_progress: {
        Row: {
          created_at: string
          id: string
          last_viewed_at: string
          lesson_completed: boolean
          notes_completed: boolean
          study_seconds: number
          topic_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_viewed_at?: string
          lesson_completed?: boolean
          notes_completed?: boolean
          study_seconds?: number
          topic_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          last_viewed_at?: string
          lesson_completed?: boolean
          notes_completed?: boolean
          study_seconds?: number
          topic_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "topic_progress_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      topics: {
        Row: {
          chapter_id: string
          created_at: string
          description: string | null
          id: string
          name: string
          status: boolean
          topic_number: number
          updated_at: string
        }
        Insert: {
          chapter_id: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          status?: boolean
          topic_number: number
          updated_at?: string
        }
        Update: {
          chapter_id?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          status?: boolean
          topic_number?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "topics_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      videos: {
        Row: {
          created_at: string
          description: string | null
          duration_seconds: number | null
          id: string
          source_label: string | null
          status: boolean
          title: string
          topic_id: string
          transcript: string | null
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration_seconds?: number | null
          id?: string
          source_label?: string | null
          status?: boolean
          title: string
          topic_id: string
          transcript?: string | null
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration_seconds?: number | null
          id?: string
          source_label?: string | null
          status?: boolean
          title?: string
          topic_id?: string
          transcript?: string | null
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "videos_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      difficulty_level: "easy" | "medium" | "hard"
      flashcard_state: "new" | "review" | "known"
      question_type: "mcq" | "short" | "long" | "conceptual" | "numerical"
      task_type: "lesson" | "practice" | "quiz" | "revision" | "mock_test"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      difficulty_level: ["easy", "medium", "hard"],
      flashcard_state: ["new", "review", "known"],
      question_type: ["mcq", "short", "long", "conceptual", "numerical"],
      task_type: ["lesson", "practice", "quiz", "revision", "mock_test"],
    },
  },
} as const
