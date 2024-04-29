export enum ROLE {
  USER = 0,
  ASSISTANT = 1,
  SYSTEM = 2,
}

export type CommonMessage = {
  role: ROLE;
  message: string;
  args: Record<string, string>;
};
