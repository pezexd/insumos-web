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
      control: {
        Row: {
          created_at: string
          date: string
          id: number
          quantity: number
          supply_id: number
          type: Database["public"]["Enums"]["control_type"]
        }
        Insert: {
          created_at?: string
          date?: string
          id?: number
          quantity: number
          supply_id: number
          type: Database["public"]["Enums"]["control_type"]
        }
        Update: {
          created_at?: string
          date?: string
          id?: number
          quantity?: number
          supply_id?: number
          type?: Database["public"]["Enums"]["control_type"]
        }
        Relationships: [
          {
            foreignKeyName: "control_supply_id_fkey"
            columns: ["supply_id"]
            isOneToOne: false
            referencedRelation: "supplies"
            referencedColumns: ["supply_id"]
          },
        ]
      }
      deliveries: {
        Row: {
          created_at: string
          delivery_date: string | null
          delivery_id: number
          delivery_quantity: number | null
          maintenance_id: number | null
          observations: string | null
          status: Database["public"]["Enums"]["statuses"] | null
          supply_id: number | null
        }
        Insert: {
          created_at?: string
          delivery_date?: string | null
          delivery_id?: number
          delivery_quantity?: number | null
          maintenance_id?: number | null
          observations?: string | null
          status?: Database["public"]["Enums"]["statuses"] | null
          supply_id?: number | null
        }
        Update: {
          created_at?: string
          delivery_date?: string | null
          delivery_id?: number
          delivery_quantity?: number | null
          maintenance_id?: number | null
          observations?: string | null
          status?: Database["public"]["Enums"]["statuses"] | null
          supply_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "deliveries_maintenance_id_fkey"
            columns: ["maintenance_id"]
            isOneToOne: false
            referencedRelation: "maintenance_personnel"
            referencedColumns: ["maintenance_id"]
          },
          {
            foreignKeyName: "deliveries_supply_id_fkey"
            columns: ["supply_id"]
            isOneToOne: false
            referencedRelation: "supplies"
            referencedColumns: ["supply_id"]
          },
        ]
      }
      maintenance_personnel: {
        Row: {
          assignment_area: string | null
          created_at: string
          full_name: string | null
          maintenance_id: number
        }
        Insert: {
          assignment_area?: string | null
          created_at?: string
          full_name?: string | null
          maintenance_id?: number
        }
        Update: {
          assignment_area?: string | null
          created_at?: string
          full_name?: string | null
          maintenance_id?: number
        }
        Relationships: []
      }
      replenishments: {
        Row: {
          created_at: string
          resupply_date: string | null
          resupply_id: number
          resupply_quantity: number | null
          supply_id: number | null
        }
        Insert: {
          created_at?: string
          resupply_date?: string | null
          resupply_id?: number
          resupply_quantity?: number | null
          supply_id?: number | null
        }
        Update: {
          created_at?: string
          resupply_date?: string | null
          resupply_id?: number
          resupply_quantity?: number | null
          supply_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "replenishments_supply_id_fkey"
            columns: ["supply_id"]
            isOneToOne: false
            referencedRelation: "supplies"
            referencedColumns: ["supply_id"]
          },
        ]
      }
      supplies: {
        Row: {
          created_at: string
          current_stock: number | null
          name: string | null
          supply_id: number
          unit_of_measure:
            | Database["public"]["Enums"]["measurement_types"]
            | null
        }
        Insert: {
          created_at?: string
          current_stock?: number | null
          name?: string | null
          supply_id?: number
          unit_of_measure?:
            | Database["public"]["Enums"]["measurement_types"]
            | null
        }
        Update: {
          created_at?: string
          current_stock?: number | null
          name?: string | null
          supply_id?: number
          unit_of_measure?:
            | Database["public"]["Enums"]["measurement_types"]
            | null
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
      control_type: "supply" | "give"
      measurement_types: "kilo(s)" | "litro(s)" | "unidade(s)"
      statuses: "pending" | "completed"
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
