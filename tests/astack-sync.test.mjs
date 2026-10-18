import { expect, test } from "bun:test";
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { syncComponent, parseSubstitutions } from "../tools/sync.mjs";

for (const scenario of ["overlap", "removed-upstream"]) {
  test(`automatic sync preserves all files on ${scenario}`, () => {
    const root = mkdtempSync(join(tmpdir(), "astack-sync-"));
    try {
      for (const name of ["old", "next", "local"]) mkdirSync(join(root, name));
      const put = (dir, name, text) => writeFileSync(join(root, dir, name), text);
      put("old", "policy.md", "old\n");
      put("local", "policy.md", "apple adaptation\n");
      if (scenario === "overlap") put("next", "policy.md", "upstream change\n");
      put("old", "clean.md", "before\n");
      put("local", "clean.md", "before\n");
      put("next", "clean.md", "after\n");
      const report = syncComponent({
        oldDir: join(root, "old"), newDir: join(root, "next"), localDir: join(root, "local"),
        rules: [], denylist: [], failOnConflict: true,
      });
      expect(report.conflicts).toHaveLength(1);
      expect(readFileSync(join(root, "local/policy.md"), "utf8")).toBe("apple adaptation\n");
      expect(readFileSync(join(root, "local/clean.md"), "utf8")).toBe("before\n");
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
}

function renamedFixture(run) {
  const root = mkdtempSync(join(tmpdir(), "astack-sync-rename-"));
  const upstream = "skills/setup-pstack/SKILL.md";
  const local = "skills/setup-astack/SKILL.md";
  const put = (dir, path, text) => {
    const file = join(root, dir, path);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, text);
  };
  try {
    for (const name of ["old", "next", "local"]) mkdirSync(join(root, name));
    const options = {
      oldDir: join(root, "old"), newDir: join(root, "next"), localDir: join(root, "local"),
      rules: [], pathRenames: { "skills/setup-pstack": "skills/setup-astack" },
    };
    run({ root, upstream, local, put, options });
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

test("sync updates renamed skills, scopes substitutions to upstream paths, and derives local paths", () => {
  renamedFixture(({ root, upstream, local, put, options }) => {
    put("old", upstream, "pstack before\n");
    put("next", upstream, "pstack after\n");
    put("local", local, `${local}\nastack before\n`);
    options.rules = parseSubstitutions({ substitutions: [{
      pattern: "pstack", replacement: "astack", files: "^skills/setup-pstack/", rationale: "Local branding",
    }], denylist: [] }).substitutions;
    options.derive = (rel, text) => `${rel}\n${text}`;
    const dry = syncComponent({ ...options, dryRun: true });
    expect(dry.written).toEqual([{ kind: "updated", rel: local }]);
    expect(readFileSync(join(root, "local", local), "utf8")).toBe(`${local}\nastack before\n`);
    const report = syncComponent(options);
    expect(report.written).toEqual(dry.written);
    expect(readFileSync(join(root, "local", local), "utf8")).toBe(`${local}\nastack after\n`);
    expect(existsSync(join(root, "local/skills/setup-pstack"))).toBe(false);
  });
});

test("sync deletes the mapped local file when upstream removes it", () => {
  renamedFixture(({ root, upstream, local, put, options }) => {
    put("old", upstream, "before\n");
    put("local", local, "before\n");
    expect(syncComponent({ ...options, dryRun: true }).deleted).toEqual([local]);
    expect(existsSync(join(root, "local", local))).toBe(true);
    expect(syncComponent(options).deleted).toEqual([local]);
    expect(existsSync(join(root, "local", local))).toBe(false);
  });
});

test("sync uses mapped paths in the fork registry", () => {
  renamedFixture(({ upstream, local, put, options }) => {
    put("old", upstream, "before\n");
    put("next", upstream, "before\n");
    put("local", local, "local policy\n");
    const report = syncComponent({ ...options, forks: new Map([[local, {}]]) });
    expect(report.forked.map(({ rel }) => rel)).toEqual([local]);
    expect(report.undeclared).toEqual([]);
    expect(report.stale).toEqual([]);
  });
});

for (const collision of ["same-file", "ancestor-file", "local-ancestor-file"]) {
  test(`sync rejects ${collision} rename collisions before writing`, () => {
    renamedFixture(({ root, upstream, local, put, options }) => {
      put("old", "clean.md", "before\n");
      put("next", "clean.md", "after\n");
      put("local", "clean.md", "before\n");
      put("next", upstream, "new\n");
      if (collision === "same-file") put("next", local, "collision\n");
      else put(collision === "local-ancestor-file" ? "local" : "next", "skills/setup-astack", "collision\n");
      expect(() => syncComponent(options)).toThrow("collision");
      expect(readFileSync(join(root, "local/clean.md"), "utf8")).toBe("before\n");
      expect(existsSync(join(root, "local", upstream))).toBe(false);
    });
  });
}

for (const unsafe of ["../outside", "/absolute", "skills/../outside", "skills//empty", "C:\\outside", "."]) {
  test(`sync rejects unsafe rename path ${unsafe}`, () => {
    renamedFixture(({ options }) => {
      expect(() => syncComponent({ ...options, pathRenames: { "skills/setup-pstack": unsafe } })).toThrow("unsafe relative path");
      expect(() => syncComponent({ ...options, pathRenames: { [unsafe]: "skills/setup-astack" } })).toThrow("unsafe relative path");
    });
  });
}
