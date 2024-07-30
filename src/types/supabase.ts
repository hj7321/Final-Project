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
      Accounts: {
        Row: {
          consumer_id: string
          created_at: string
          id: string
          is_complete: boolean
          pro_id: string
          request_post_id: string
        }
        Insert: {
          consumer_id?: string
          created_at?: string
          id?: string
          is_complete?: boolean
          pro_id?: string
          request_post_id?: string
        }
        Update: {
          consumer_id?: string
          created_at?: string
          id?: string
          is_complete?: boolean
          pro_id?: string
          request_post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "Accounts_consumer_id_fkey"
            columns: ["consumer_id"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Accounts_pro_id_fkey"
            columns: ["pro_id"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Accounts_request_post_id_fkey"
            columns: ["request_post_id"]
            isOneToOne: false
            referencedRelation: "Request Posts"
            referencedColumns: ["id"]
          },
        ]
      }
      Chat: {
        Row: {
          chat_room_id: string
          consumer_id: string
          content: string
          created_at: string | null
          id: string
          post_id: string | null
          pro_id: string
        }
        Insert: {
          chat_room_id?: string
          consumer_id: string
          content: string
          created_at?: string | null
          id?: string
          post_id?: string | null
          pro_id: string
        }
        Update: {
          chat_room_id?: string
          consumer_id?: string
          content?: string
          created_at?: string | null
          id?: string
          post_id?: string | null
          pro_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "Chat_consumer_id_fkey"
            columns: ["consumer_id"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Chat_pro_id_fkey"
            columns: ["pro_id"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
        ]
      }
      "Community Comments": {
        Row: {
          community_post_id: string
          contents: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          community_post_id?: string
          contents: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Update: {
          community_post_id?: string
          contents?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "Community Comments_community_post_id_fkey"
            columns: ["community_post_id"]
            isOneToOne: true
            referencedRelation: "Community Posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Community Comments_community_post_id_fkey1"
            columns: ["community_post_id"]
            isOneToOne: true
            referencedRelation: "Community Posts"
            referencedColumns: ["id"]
          },
        ]
      }
      "Community Likes": {
        Row: {
          comment_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          comment_id: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Update: {
          comment_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "Community Likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
        ]
      }
      "Community Posts": {
        Row: {
          content: string
          created_at: string
          id: string
          lang_category: string[] | null
          post_category: string
          post_img: string[] | null
          title: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          lang_category?: string[] | null
          post_category: string
          post_img?: string[] | null
          title: string
          user_id?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          lang_category?: string[] | null
          post_category?: string
          post_img?: string[] | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "Community Posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
        ]
      }
      Portfolio: {
        Row: {
          content: string
          created_at: string
          end_date: string | null
          id: string
          lang_category: string | null
          portfolio_img: string[] | null
          start_date: string | null
          title: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          end_date?: string | null
          id?: string
          lang_category?: string | null
          portfolio_img?: string[] | null
          start_date?: string | null
          title: string
          user_id?: string
        }
        Update: {
          content?: string
          created_at?: string
          end_date?: string | null
          id?: string
          lang_category?: string | null
          portfolio_img?: string[] | null
          start_date?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "Portfolio_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
        ]
      }
      "Request Posts": {
        Row: {
          content: string
          created_at: string
          id: string
          lang_category: string[]
          post_img: string[]
          price: number
          title: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          lang_category: string[]
          post_img: string[]
          price: number
          title: string
          user_id?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          lang_category?: string[]
          post_img?: string[]
          price?: number
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      "Request Reviews": {
        Row: {
          contents: string
          created_at: string
          id: string
          request_post_id: string
          stars: number
          user_id: string
        }
        Insert: {
          contents: string
          created_at?: string
          id?: string
          request_post_id?: string
          stars: number
          user_id?: string
        }
        Update: {
          contents?: string
          created_at?: string
          id?: string
          request_post_id?: string
          stars?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "Request Reviews_request_post_id_fkey"
            columns: ["request_post_id"]
            isOneToOne: true
            referencedRelation: "Request Posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Request Reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      Users: {
        Row: {
          birth: string | null
          created_at: string
          email: string
          id: string
          is_pro: boolean | null
          name: string | null
          nickname: string
          profile_img: string | null
        }
        Insert: {
          birth?: string | null
          created_at?: string
          email: string
          id?: string
          is_pro?: boolean | null
          name?: string | null
          nickname: string
          profile_img?: string | null
        }
        Update: {
          birth?: string | null
          created_at?: string
          email?: string
          id?: string
          is_pro?: boolean | null
          name?: string | null
          nickname?: string
          profile_img?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
