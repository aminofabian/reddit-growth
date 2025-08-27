import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export const SearchBar = ({ onSearch, isLoading }: SearchBarProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  return (
    <div style={{ width: "100%", maxWidth: "32rem", margin: "0 auto" }}>
      <form onSubmit={handleSubmit} style={{ position: "relative" }}>
        <Input
          type="text"
          placeholder="Search for subreddits..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
          style={{
            width: "100%",
            height: "3.5rem",
            paddingLeft: "3rem",
            paddingRight: "6rem",
            fontSize: "1rem",
            borderRadius: "0.75rem",
            border: "2px solid #ccc",
          }}
        />
        <Search
          style={{
            position: "absolute",
            left: "0.75rem",
            top: "50%",
            transform: "translateY(-50%)",
            width: "1.25rem",
            height: "1.25rem",
            color: "#888",
          }}
        />
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          style={{
            position: "absolute",
            right: "0.5rem",
            top: "50%",
            transform: "translateY(-50%)",
            height: "2.5rem",
            padding: "0 1rem",
            backgroundColor: "#ef4444",
            color: "#fff",
            border: "none",
            borderRadius: "0.5rem",
            cursor: isLoading || !query.trim() ? "not-allowed" : "pointer",
            display: "flex", // Use flexbox for alignment
            alignItems: "center", // Align items vertically
            justifyContent: "center", // Center items horizontally
          }}
        >
          {isLoading ? (
            <>
              <Loader2 style={{ width: "1rem", height: "1rem", marginRight: "0.5rem", animation: "spin 1s linear infinite" }} />
              Searching...
            </>
          ) : (
            "Search"
          )}
        </button>
      </form>
    </div>
  );
};
