enum Role {
  Administrator,
  Manager,
  Explorer,
}

export type Actor = {
  _id: string;
  name: string;
  surename: string;
  email: string;
  phone?: string;
  adress?: string;
  role: Role;
  password: string;
};
