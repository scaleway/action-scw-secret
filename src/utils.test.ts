import { describe, expect, jest, test } from "@jest/globals";
import type { Secretv1beta1 } from "@scaleway/sdk-secret";
import {
  transformToValidEnvName,
  splitNameAndPath,
  Secret,
  extractAlias,
  getSecretValue,
} from "./utils";

describe("transform to validate env name", () => {
  type testCase = {
    input: string;
    envName: string;
  };

  const testCases: testCase[] = [
    {
      input: "foo",
      envName: "FOO",
    },
    {
      input: "foo_bar",
      envName: "FOO_BAR",
    },
    {
      input: "0foo",
      envName: "_0FOO",
    },
  ];

  testCases.forEach((tc) => {
    test(tc.input, () => {
      const got = transformToValidEnvName(tc.input);
      expect(got).toBe(tc.envName);
    });
  });
});

describe("split name and path", () => {
  type testCase = {
    ref: string;
    name: string;
    path: string;
  };

  const testCases: testCase[] = [
    {
      ref: "/foo",
      name: "foo",
      path: "/",
    },
    {
      ref: "/foo/bar",
      name: "bar",
      path: "/foo",
    },
  ];

  testCases.forEach((tc) => {
    test(tc.ref, () => {
      const [name, path] = splitNameAndPath(tc.ref);
      expect(name).toBe(tc.name);
      expect(path).toBe(tc.path);
    });
  });
});

describe("extract alias", () => {
  type testCase = {
    input: string;
    alias: string;
    secret: Secret;
  };

  const testCases: testCase[] = [
    {
      input: "my_secret",
      alias: "MY_SECRET",
      secret: {
        name: "my_secret",
        path: "/",
      },
    },
    {
      input: "MY_SECOND_SECRET,my-other-secret",
      alias: "MY_SECOND_SECRET",
      secret: {
        name: "my-other-secret",
        path: "/",
      },
    },
    {
      input: "/foo/my-secret",
      alias: "MY_SECRET",
      secret: {
        name: "my-secret",
        path: "/foo",
      },
    },
    {
      input: "MY_SECOND_SECRET,/foo/my-secret",
      alias: "MY_SECOND_SECRET",
      secret: {
        name: "my-secret",
        path: "/foo",
      },
    },
  ];

  testCases.forEach((tc) => {
    test(tc.input, () => {
      const [alias, secret] = extractAlias(tc.input);
      expect(alias).toBe(tc.alias);
      expect(secret).toEqual(tc.secret);
    });
  });
});

describe("get secret value", () => {
  test("accesses the secret by path without listing", async () => {
    const accessSecretVersionByPath = jest
      .fn<Secretv1beta1.API["accessSecretVersionByPath"]>()
      .mockResolvedValue({
        data: Buffer.from("s3cr3t-value", "binary").toString("base64"),
      } as Awaited<
        ReturnType<Secretv1beta1.API["accessSecretVersionByPath"]>
      >);
    const listSecrets = jest.fn();

    const api = {
      accessSecretVersionByPath,
      listSecrets,
    } as unknown as Secretv1beta1.API;

    const secret: Secret = { name: "my-secret", path: "/foo" };
    const value = await getSecretValue(api, secret, "project-id");

    expect(value).toBe("s3cr3t-value");
    // The secret is fetched by path/name, so no `list secret` permission is needed.
    expect(listSecrets).not.toHaveBeenCalled();
    expect(accessSecretVersionByPath).toHaveBeenCalledWith({
      secretName: "my-secret",
      secretPath: "/foo",
      revision: "latest_enabled",
      projectId: "project-id",
    });
  });
});
