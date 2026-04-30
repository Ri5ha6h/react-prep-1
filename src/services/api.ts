export const getUsers = async () => {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
};

export const getUser = async (query: string) => {
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/users?q=${query}`);
    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
};
