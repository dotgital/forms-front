export interface User {
  jwt: string;
  user: {
      id: string;
      username: string;
      email: string;
      fullName: string;
      blocked: boolean;
      role: {
          name: string;
      };
      avatar: [{
          url: string;
      }]
  };
}
