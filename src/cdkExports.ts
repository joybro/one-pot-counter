import cdkExports from "./cdk-exports.json";

if (
    !cdkExports["OnePot-Counter-APIStack"] ||
    !cdkExports["OnePot-Counter-AuthenticationStack"]
) {
    throw new Error(
        `Unable to find the backend stack in cdk-exports.json.
        This is likely because the backend stack has not been deployed yet.`
    );
}

const ApiStack = cdkExports["OnePot-Counter-APIStack"];
const AuthenticationStack = cdkExports["OnePot-Counter-AuthenticationStack"];

export { ApiStack, AuthenticationStack };
