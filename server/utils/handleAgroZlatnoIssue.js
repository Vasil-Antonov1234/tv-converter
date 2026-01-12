export function handleAgroZlatnoIssue(applicationIssue) {

    const regex1 = /\d{2}\.\d{2}\.\d{4}|\d{2}\-\d{2}\-\d{4}|\d{2}\.\d{2}\-\d{4}|\d{2}\-\d{2}\.\d{4}/;

    const issueString = applicationIssue.replace(regex1, "");

    const issue = issueString
        .split("")
        .filter((x) => x !== " ")
        .map(Number)
        .filter((x) => x >= 0)
        .join("");

    const result = String(issue);

    return result;
};