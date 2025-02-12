import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  // Navigate to /users when the component mounts
  useEffect(() => {
    router.push("/home");
  }, []);

  // Render nothing initially because we are redirecting
  return <></>;
}

// Optionally, you can indicate that this component does not use layout
Home.noLayout = true;
