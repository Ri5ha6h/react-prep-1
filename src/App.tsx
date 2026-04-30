import { useEffect, useState } from "react";
import { getUser, getUsers } from "./services/api";
import { UserCard } from "./components/user-card";
import { useDebounce } from "./hooks/debounce";

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("default");

  const debouncedQuery = useDebounce({ value: query });

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    try {
      if (!ignore) {
        if (!debouncedQuery) {
          void getUsers().then((data) => {
            setUsers(data);
          });
        } else {
          void getUser(debouncedQuery).then((data) => {
            setUsers(data);
          });
        }
      }
    } catch (error: any) {
      setError(error);
    } finally {
      setLoading(false);
    }

    return () => {
      ignore = true;
    };
  }, [debouncedQuery]);

  const handleSort = (sortQ: string) => {
    setSort(sortQ);
    if (sortQ === "asc") {
      setUsers(users.sort((a: any, b: any) => a.name.localeCompare(b.name)));
    } else if (sortQ === "desc") {
      setUsers(users.sort((a: any, b: any) => b.name.localeCompare(a.name)));
    } else {
      setUsers(users.sort((a: any, b: any) => a.id - b.id));
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="text-lg">
      <div>
        <label htmlFor="search-user">Search User</label>
        <input
          name="search-user"
          id="search-user"
          value={query}
          className="border border-gray-300 rounded-md p-2"
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="sort-name">Sort</label>
        <select
          className="border border-gray-300 rounded-md p-2"
          name="sort"
          id="sort-name"
          value={sort}
          onChange={(e) => handleSort(e.target.value)}
        >
          <option value="default" selected>
            Default
          </option>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
      {loading && <p className="mt-3">loading...</p>}
      <div className="flex flex-wrap gap-3 mt-3">
        {users.map((user: any) => (
          // <pre>{JSON.stringify(user, null, 2)}</pre>
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
}

export default App;
