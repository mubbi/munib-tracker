import { useExternalCommandProcessor } from "@/hooks/use-external-command-processor";

/** Mounts the external command drain loop (Siri, watch, assistant). */
export function ExternalCommandProcessor(): null {
  useExternalCommandProcessor();
  return null;
}
