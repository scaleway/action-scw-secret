import assert from 'assert';
import { transformToValidEnvName, splitNameAndPath, Secret, extractAlias } from "./utils"

describe("transform to validate env name", () => {
    type testCase = {
        input: string;
        envName: string;
    }

    const testCases: testCase[] = [
        {
            input: "foo",
            envName: "FOO"
        },
        {
            input: "foo_bar",
            envName: "FOO_BAR"
        },
        {
            input: "0foo",
            envName: "_0FOO"
        }
    ]

    testCases.forEach((tc) => {
        it(tc.input, () => {
            const got = transformToValidEnvName(tc.input)
            assert.equal(got, tc.envName)
        })
    })
})

describe("split name and path", () => {
    type testCase = {
        ref: string;
        name: string;
        path: string;
    }

    const testCases: testCase[] = [
        {
            ref: "/foo",
            name: "foo",
            path: "/"
        },
        {
            ref: "/foo/bar",
            name: "bar",
            path: "/foo"
        },
    ]

    testCases.forEach((tc) => {
        it(tc.ref, () => {
            const [name, path] = splitNameAndPath(tc.ref)
            assert.equal(name, tc.name)
            assert.equal(path, tc.path)
        })
    })
})

describe("extract alias", () => {
    type testCase = {
        input: string;
        alias: string;
        secret: Secret;
    }

    const testCases: testCase[] = [
        {
            input: "my_secret",
            alias: "MY_SECRET",
            secret: {
                name: "my_secret",
                path: "/"
            }
        },
        {
            input: "MY_SECOND_SECRET,my-other-secret",
            alias: "MY_SECOND_SECRET",
            secret: {
                name: "my-other-secret",
                path: "/"
            }
        },
        {
            input: "/foo/my-secret",
            alias: "MY_SECRET",
            secret: {
                name: "my-secret",
                path: "/foo"
            }
        },
        {
            input: "MY_SECOND_SECRET,/foo/my-secret",
            alias: "MY_SECOND_SECRET",
            secret: {
                name: "my-secret",
                path: "/foo"
            }
        },
    ]

    testCases.forEach((tc) => {
        it(tc.input, () => {
            const [alias, secret] = extractAlias(tc.input)
            assert.equal(alias, tc.alias)
            assert.deepEqual(secret, tc.secret)
        })
    })
})
