import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { RequestCreator } from "../Request/RequestCreator";

const path = "/api/config";
type FeatureFlags = Record<string, boolean>;

interface FeatureFlagsContextType {
  flags: FeatureFlags;
  loading: boolean;
  error?: string;
}

const FeatureFlagsContext = createContext<FeatureFlagsContextType>({
  flags: {},
  loading: true,
  error: undefined,
});

export const useFeatureFlags = () => useContext(FeatureFlagsContext);

interface FeatureFlagsProviderProps {
  children: ReactNode;
}

export const FeatureFlagsProvider: React.FC<FeatureFlagsProviderProps> = ({
  children,
}) => {
  const [flags, setFlags] = useState<FeatureFlags>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  const fetchFlags = async (): Promise<void> => {
    const api = new RequestCreator();
    const result = await api.get<FeatureFlags>(path);

    if (!result.success) {
      setError(result.errorMessage);
      setLoading(false);
    }

    setFlags(result.data ?? {});
    setLoading(false);
  };

  useEffect(() => {
    fetchFlags();
  }, []);

  return (
    <FeatureFlagsContext.Provider value={{ flags, loading }}>
      {children}
    </FeatureFlagsContext.Provider>
  );
};
