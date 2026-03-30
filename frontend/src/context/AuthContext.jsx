import { createContext, useContext, useState } from "react";

// ─── Initial Users ────────────────────────────────────────────────────────────
const INITIAL_USERS = [
  {
    id:         1,
    username:   "junelle123",
    password:   "admin123",
    role:       "admin",
    name:       "Junelle Dinglasan",
    initials:   "JD",
    memberId:   null,
    isOfficial: true,
  },
  {
    id:         2,
    username:   "staff01",
    password:   "staff123",
    role:       "staff",
    name:       "Staff User",
    initials:   "S",
    memberId:   null,
    isOfficial: true,
  },
  {
    id:         3,
    username:   "maria0123",
    password:   "member123",
    role:       "member",
    name:       "Maria Santos",
    initials:   "MS",
    memberId:   "LEAF-100-05",
    status:     "Active",
    isOfficial: true,
  },
];

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(INITIAL_USERS);

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("leaf_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // ─── Login ────────────────────────────────────────────────────────────────
  const login = (username, password) => {
    const found = users.find(
      u => u.username === username.trim() && u.password === password
    );
    if (!found) {
      return { success: false, message: "Invalid username or password." };
    }
    const { password: _, ...safeUser } = found;
    setUser(safeUser);
    localStorage.setItem("leaf_user", JSON.stringify(safeUser));
    return { success: true, role: safeUser.role };
  };

  // ─── Logout ───────────────────────────────────────────────────────────────
  const logout = () => {
    setUser(null);
    localStorage.removeItem("leaf_user");
  };

  // ─── Add Staff (admin only) ───────────────────────────────────────────────
  // Admin ang gagawa ng staff account — Name, Username, Password lang
  const addStaff = ({ name, username, password }) => {
    // Check kung may existing na username
    const exists = users.find(u => u.username === username.trim());
    if (exists) {
      return { success: false, message: "Username already exists." };
    }

    const initials = name
      .split(" ")
      .map(w => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

    const newStaff = {
      id:         users.length + 1,
      username:   username.trim(),
      password:   password,
      role:       "staff",
      name:       name.trim(),
      initials:   initials,
      memberId:   null,
      isOfficial: true,
    };

    setUsers(prev => [...prev, newStaff]);
    return { success: true, staff: newStaff };
  };

  // ─── Edit Staff (admin only) ──────────────────────────────────────────────
  // Admin pwede mag-edit ng staff name at username
  const editStaff = (id, { name, username }) => {
    // Check kung may ibang user na may same username
    const exists = users.find(u => u.username === username.trim() && u.id !== id);
    if (exists) {
      return { success: false, message: "Username already taken." };
    }

    const initials = name
      .split(" ")
      .map(w => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

    setUsers(prev => prev.map(u =>
      u.id === id
        ? { ...u, name: name.trim(), username: username.trim(), initials }
        : u
    ));
    return { success: true };
  };

  // ─── Reset Staff Password (admin only) ───────────────────────────────────
  const resetStaffPassword = (id, newPassword) => {
    setUsers(prev => prev.map(u =>
      u.id === id ? { ...u, password: newPassword } : u
    ));
    return { success: true };
  };

  // ─── Get Staff List (admin only) ─────────────────────────────────────────
  const getStaffList = () => {
    return users.filter(u => u.role === "staff");
  };

  // ─── Register Member (online self-registration) ───────────────────────────
  const registerMember = ({ firstname, lastname, middlename, username, password }) => {
    const exists = users.find(u => u.username === username.trim());
    if (exists) {
      return { success: false, message: "Username already exists." };
    }

    const newUser = {
      id:         users.length + 1,
      username:   username.trim(),
      password:   password,
      role:       "member",
      name:       `${firstname} ${lastname}`,
      initials:   `${firstname[0]}${lastname[0]}`.toUpperCase(),
      memberId:   null,
      status:     "Pending",
      isOfficial: false, // non-official — limited access
    };

    setUsers(prev => [...prev, newUser]);
    return { success: true };
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      addStaff,
      editStaff,
      resetStaffPassword,
      getStaffList,
      registerMember,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}