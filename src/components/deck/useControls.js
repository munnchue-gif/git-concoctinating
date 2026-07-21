import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";

export default function useControls() {
  const [controls, setControls] = useState(null);

  useEffect(() => {
    base44.entities.ForgeControl.list("created_date", 200).then(setControls);
    const unsubscribe = base44.entities.ForgeControl.subscribe((event) => {
      setControls((prev) => {
        if (!prev) return prev;
        if (event.type === "create") return prev.some((c) => c.id === event.data.id) ? prev : [...prev, event.data];
        if (event.type === "update") return prev.map((c) => (c.id === event.data.id ? event.data : c));
        if (event.type === "delete") return prev.filter((c) => c.id !== event.data.id);
        return prev;
      });
    });
    return unsubscribe;
  }, []);

  const setValue = async (control, value) => {
    setControls((prev) => prev.map((c) => (c.id === control.id ? { ...c, value } : c)));
    await base44.entities.ForgeControl.update(control.id, { value });
  };

  const create = async (data) => base44.entities.ForgeControl.create(data);

  const remove = async (control) => {
    setControls((prev) => prev.filter((c) => c.id !== control.id));
    await base44.entities.ForgeControl.delete(control.id);
  };

  return { controls, setValue, create, remove };
}