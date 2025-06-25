"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "../hooks/use-toast";
import { log } from "console";

export type User = {
  id: string;
  name: string;
  email: string;
  profilePicture?: string; // Optional profile picture URL
  role: "user" | "admin";
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAdmin: boolean;
  updateProfilePicture: (imageUrl: string) => Promise<void>;
  updateProfileName: (name: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Check if the user is logged in on initial load
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      console.log(
        "Fetching profile with token:",
        token ? "Token exists" : "No token"
      );
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:8080/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch profile");
        }

        const profile = await res.json();
        console.log("Profile response from server:", profile);
        const userProfile = profile.user;
        setUser(userProfile);
        localStorage.setItem("user", JSON.stringify(userProfile));
        console.log("Set user to:", userProfile);
      } catch (error) {
        console.error("Auto-login failed:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  //login function -this would call an API for login
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await res.json();
      const token = data.token;
      console.log("Login response:", data);
      console.log("Token received:", token ? "Token exists" : "No token");
      // ✅ เก็บ token ไว้ใน localStorage
      localStorage.setItem("token", token);

      // ✅ ดึงข้อมูลโปรไฟล์ผู้ใช้
      const profileRes = await fetch("http://localhost:8080/api/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!profileRes.ok) {
        throw new Error("Failed to fetch user profile");
      }

      const profile = await profileRes.json();
      console.log("Profile response:", profile);

      const userProfile = profile.user;
      setUser(userProfile);
      localStorage.setItem("user", JSON.stringify(userProfile));

      toast({
        title: "Login successful",
        description: `Welcome back, ${userProfile.name}!`,
      });

      if (profile.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Mock register function
  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        throw new Error("Registration failed");
      }

      const data = await res.json();
      const token = data.token;
      const profile = data.user;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(profile));
      setUser(profile);

      toast({
        title: "Registration successful",
        description: `Welcome, ${name}!`,
      });

      router.push("/");
    } catch (error) {
      console.error("Registration failed:", error);
      toast({
        title: "Registration failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    router.push("/");
  };

  // Protected routes handling
  useEffect(() => {
    if (!isLoading) {
      // Admin routes protection
      if (pathname?.startsWith("/admin") && (!user || user.role !== "admin")) {
        router.push("/login");
        toast({
          title: "Access denied",
          description: "You need admin privileges to access this page.",
          variant: "destructive",
        });
      }

      // User account protection
      if (pathname?.startsWith("/account") && !user) {
        router.push("/login");
        toast({
          title: "Authentication required",
          description: "Please log in to access your account.",
          variant: "destructive",
        });
      }
    }
  }, [pathname, user, isLoading, router]);

  // Update profile picture function
  const updateProfilePicture = async (imageUrl: string) => {
    if (user) {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8080/api/profile/picture", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ profilePicture: imageUrl }),
        });

        if (!res.ok) {
          throw new Error("Failed to update profile picture");
        }

        const data = await res.json();
        const updatedUser = data.user;
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        toast({
          title: "Profile picture updated",
          description: "Your profile picture has been updated successfully.",
        });
      } catch (error) {
        console.error("Error updating profile picture:", error);
        toast({
          title: "Update failed",
          description: "Failed to update profile picture. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  // Update profile name function
  const updateProfileName = async (name: string) => {
    if (user) {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8080/api/profile/name", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name }),
        });

        if (!res.ok) {
          throw new Error("Failed to update profile name");
        }

        const data = await res.json();
        const updatedUser = data.user;
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        toast({
          title: "Profile name updated",
          description: "Your profile name has been updated successfully.",
        });
      } catch (error) {
        console.error("Error updating profile name:", error);
        toast({
          title: "Update failed",
          description: "Failed to update profile name. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isLoading,
        isAdmin: user?.role === "admin" || false,
        updateProfilePicture,
        updateProfileName,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
