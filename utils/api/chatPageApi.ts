import instance from "./axios";

export const getConnections = async () => {
  const { data } = await instance.get("/connections/pending");
  return data;
};
