enum Role {
  Administrator,
  Manager,
  Explorer,
}

export type Actor = {
  name: string;
  surename: string;
  email: string;
  phone?: string;
  adress?: string;
  role: Role;
};
