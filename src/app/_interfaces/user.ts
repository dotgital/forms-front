export interface User {
  jwt: string;
  user: {
      id: string;
      username: string;
      email: string;
      fullName: string;
      blocked: boolean;
      role: {
          type: string;
      };
      avatar: [{
          url: string;
      }]
  };
}
