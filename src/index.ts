import * as core from '@actions/core'
import 'cross-fetch/polyfill';
import { createClient, Secret } from "@scaleway/sdk";
import { extractAlias, getSecretValue } from "./utils";

export async function run(): Promise<void> {
  try {
    const client = createClient({
      accessKey: core.getInput("access-key"),
      secretKey: core.getInput("secret-key"),
      defaultProjectId: core.getInput("default-project-id"),
      defaultOrganizationId: core.getInput("default-organization-id"),
      defaultRegion: core.getInput("default-region"),
      defaultZone: core.getInput("default-zone"),
    });

    const api = new Secret.v1alpha1.API(client);

    const secretConfigInputs: string[] = [
      ...new Set(core.getMultilineInput("secret-names")),
    ];

    for (let secretConf of secretConfigInputs) {
      const [envName, secretName] = extractAlias(secretConf);

      try {
        const secretValue = await getSecretValue(api, secretName);
        core.setSecret(secretValue);
        core.debug(
          `Injecting secret ${secretName} as environment variable '${envName}'.`
        );
        core.exportVariable(envName, secretValue);
      } catch (error) {
        core.setFailed(
          `Failed to fetch secret: '${secretName}'. Error: ${error}.`
        );
      }
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
  }
}

run();
