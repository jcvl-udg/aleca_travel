export type UserRole = "CLIENT" | "AGENT" | "ADMIN";

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  points: number;
  passportStamps: string[];
}

export const MOCK_USERS: Record<string, UserSession> = {
  client: {
    id: "usr_101",
    name: "Alejandro VIP",
    email: "client@aleca.travel",
    role: "CLIENT",
    points: 2400,
    passportStamps: ["asia", "caribbean", "europe"],
  },
  agent: {
    id: "usr_202",
    name: "Agente Asesor",
    email: "agent@aleca.travel",
    role: "AGENT",
    points: 0,
    passportStamps: [],
  },
};