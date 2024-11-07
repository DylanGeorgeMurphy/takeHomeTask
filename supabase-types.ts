export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      Children: {
        Row: {
          family_id: number | null
          id: number
          name: string | null
        }
        Insert: {
          family_id?: number | null
          id?: number
          name?: string | null
        }
        Update: {
          family_id?: number | null
          id?: number
          name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Children_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "Family"
            referencedColumns: ["id"]
          },
        ]
      }
      Family: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      Files: {
        Row: {
          family_id: number
          file_id: string
          id: number
        }
        Insert: {
          family_id: number
          file_id: string
          id?: number
        }
        Update: {
          family_id?: number
          file_id?: string
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "Files_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "Family"
            referencedColumns: ["id"]
          },
        ]
      }
      Notes: {
        Row: {
          content: string
          family_id: number | null
          id: number
          title: string
        }
        Insert: {
          content: string
          family_id?: number | null
          id?: number
          title: string
        }
        Update: {
          content?: string
          family_id?: number | null
          id?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "Notes_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "Family"
            referencedColumns: ["id"]
          },
        ]
      }
      Parents: {
        Row: {
          family_id: number | null
          id: number
          name: string
        }
        Insert: {
          family_id?: number | null
          id?: number
          name: string
        }
        Update: {
          family_id?: number | null
          id?: number
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "Parents_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "Family"
            referencedColumns: ["id"]
          },
        ]
      }
      WorkerFamilyRelationship: {
        Row: {
          family_id: number
          id: number
          worker_id: number
        }
        Insert: {
          family_id: number
          id?: number
          worker_id: number
        }
        Update: {
          family_id?: number
          id?: number
          worker_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "WorkerFamilyRelationship_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "Family"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "WorkerFamilyRelationship_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "Workers"
            referencedColumns: ["id"]
          },
        ]
      }
      Workers: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
