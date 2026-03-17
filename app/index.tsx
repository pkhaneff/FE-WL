import { Redirect } from "expo-router";
import { useAppStore } from "../src/store";

export default function Page() {
  const token = useAppStore(state => state.token);

  if (!token) {
    return <Redirect href="/auth/login" />;
  }

  return <Redirect href="/(tabs)" />;
}
