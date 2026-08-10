import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ExistingPatientProfile } from "../types/patient";
import {
  clearStoredPatientSession,
  fetchPatientSession,
  logoutPatientSession,
  readStoredPatientSession,
  requestPatientOtp,
  verifyPatientOtp,
  writeStoredPatientSession,
  type OtpRequestResult,
  type PatientAuthSession,
} from "../services/patientAuthService";
import { searchPatients } from "../services/patientService";
import { formatMobileForApi } from "../utils/patientValidation";

interface PatientAuthContextValue {
  session: PatientAuthSession | null;
  isSignedIn: boolean;
  ready: boolean;
  requestOtp: (mobileNumber: string) => Promise<OtpRequestResult>;
  verifyOtp: (params: {
    mobileNumber: string;
    code: string;
  }) => Promise<PatientAuthSession>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const PatientAuthContext = createContext<PatientAuthContextValue | null>(null);

async function enrichPatientFromLookup(
  patient: ExistingPatientProfile,
): Promise<ExistingPatientProfile> {
  try {
    const results = await searchPatients({
      mobileNumber: patient.mobileNumber,
      nic: patient.nic,
    });
    const match = results[0];
    if (!match) return patient;
    return {
      ...patient,
      ...match,
      mobileNumber: formatMobileForApi(match.mobileNumber || patient.mobileNumber),
    };
  } catch {
    return patient;
  }
}

export function PatientAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<PatientAuthSession | null>(null);
  const [ready, setReady] = useState(false);

  const refreshSession = useCallback(async () => {
    const stored = readStoredPatientSession();
    if (!stored) {
      setSession(null);
      setReady(true);
      return;
    }

    const remote = await fetchPatientSession(stored.sessionToken);
    if (!remote) {
      // Keep local session for offline/dev if token still unexpired.
      setSession(stored);
      setReady(true);
      return;
    }

    const enrichedPatient = await enrichPatientFromLookup(remote.patient);
    const next = { ...remote, patient: enrichedPatient };
    writeStoredPatientSession(next);
    setSession(next);
    setReady(true);
  }, []);

  useEffect(() => {
    void refreshSession();
  }, [refreshSession]);

  const requestOtp = useCallback(async (mobileNumber: string) => {
    return requestPatientOtp(mobileNumber);
  }, []);

  const verifyOtp = useCallback(
    async (params: { mobileNumber: string; code: string }) => {
      const result = await verifyPatientOtp(params);
      const basePatient = {
        ...result.patient,
        mobileNumber: formatMobileForApi(
          result.patient.mobileNumber || params.mobileNumber,
        ),
      };
      const enrichedPatient = await enrichPatientFromLookup(basePatient);
      const next: PatientAuthSession = {
        sessionToken: result.sessionToken,
        expiresAt: result.expiresAt,
        mobileNumber: enrichedPatient.mobileNumber,
        patient: enrichedPatient,
      };
      writeStoredPatientSession(next);
      setSession(next);
      return next;
    },
    [],
  );

  const signOut = useCallback(async () => {
    const token = session?.sessionToken;
    clearStoredPatientSession();
    setSession(null);
    if (token) await logoutPatientSession(token);
  }, [session?.sessionToken]);

  const value = useMemo(
    () => ({
      session,
      isSignedIn: Boolean(session),
      ready,
      requestOtp,
      verifyOtp,
      signOut,
      refreshSession,
    }),
    [session, ready, requestOtp, verifyOtp, signOut, refreshSession],
  );

  return (
    <PatientAuthContext.Provider value={value}>
      {children}
    </PatientAuthContext.Provider>
  );
}

export function usePatientAuth() {
  const ctx = useContext(PatientAuthContext);
  if (!ctx) {
    throw new Error("usePatientAuth must be used within PatientAuthProvider");
  }
  return ctx;
}
