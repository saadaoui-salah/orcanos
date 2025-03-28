import { api } from "./axiosClient";

export const login = (data) => {
  if (data?.password && data?.username) {
    const auth = `${data?.username}:${data?.password}`;
    api.post(
      "/QW_Login",
      {},
      {
        headers: {
          Authorization: `Bearer ${btoa(auth)}`,
        },
      }
    );
  }
};
