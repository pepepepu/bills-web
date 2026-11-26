import { useEffect, useState } from "react";
import type { HouseMember } from "../interfaces/finance";
import { listMembers } from "../services/houseServices";

let cache: HouseMember[] | null = null;

/** Membros da casa (para "quem pagou" e "devedor"). */
export function useMembers() {
  const [members, setMembers] = useState<HouseMember[]>(cache ?? []);

  useEffect(() => {
    if (cache) return;
    listMembers()
      .then((data) => {
        cache = data;
        setMembers(data);
      })
      .catch(() => setMembers([]));
  }, []);

  return members;
}
