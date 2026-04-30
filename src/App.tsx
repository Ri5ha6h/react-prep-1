import { useEffect, useMemo, useState } from "react";
import { getUsers, type User } from "./services/api";
import { UserCard } from "./components/user-card";
import { useDebounce } from "./hooks/debounce";

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState<string>("");
  const [sort, setSort] = useState<string>("default");

  const debouncedQuery = useDebounce({ value: query });

  const visibleUsers = useMemo(() => {
    const q = debouncedQuery.toLowerCase().trim();

    const filtered = users.filter(
      (user) => user.name.toLowerCase().includes(q) || user.email.toLowerCase().includes(q),
    );

    return [...filtered].sort((a, b) => {
      if (sort === "asc") return a.name.localeCompare(b.name);
      if (sort === "desc") return b.name.localeCompare(a.name);
      return a.id - b.id;
    });
  }, [users, debouncedQuery, sort]);

  useEffect(() => {
    let ignore = false;

    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getUsers();

        if (!ignore) {
          setUsers(data);
        }
      } catch (error) {
        if (!ignore) {
          setError(error instanceof Error ? error.message : "Something went wrong");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    void fetchUsers();

    return () => {
      ignore = true;
    };
  }, []);

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
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="default">Default</option>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
      {loading && <p className="mt-3">loading...</p>}
      {!loading && visibleUsers.length === 0 && <p>No users found</p>}
      <div className="flex flex-wrap gap-3 mt-3">
        {visibleUsers.map((user: User) => (
          // <pre>{JSON.stringify(user, null, 2)}</pre>
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
}

export default App;
