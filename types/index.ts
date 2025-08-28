export type Role = 'user' | 'admin';
export interface User { _id: string; name: string; email: string; role?: String; }
