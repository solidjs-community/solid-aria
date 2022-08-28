import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync
} from "fs";
import { extname, join } from "path";
import { syncIntl } from "../package.json";
import prettier from "prettier";
import ts, { ImportDeclaration, Statement } from "typescript";
import { execSync } from "child_process";

const tmpDir = join(__dirname, "tmp");
const licensePath = join(__dirname, "LICENSE.template.md");

rmSync(tmpDir, { force: true, recursive: true });

try {
  if (!existsSync(licensePath)) {
    throw new Error("License placeholder must be present");
  }

  mkdirSync(tmpDir);

  execSync("git clone --depth 1 git@github.com:adobe/react-spectrum.git .", {
    cwd: join(__dirname, "tmp"),
    stdio: "inherit"
  });

  Object.entries(syncIntl).forEach(([localPkgName, reactAriaPkgName]) => {
    const localPkgDir = join("packages", localPkgName);
    const remotePkgDir = join(tmpDir, "packages", "@react-aria", reactAriaPkgName);

    const remoteIntlDir = join(remotePkgDir, "intl");
    const localIntlDir = join(localPkgDir, "intl");

    if (existsSync(remoteIntlDir)) {
      const files = readdirSync(remoteIntlDir);
      const onlyIntlFiles = files.filter(el => el && extname(el) === ".json");

      console.log(`Copying intl files from @react-aria/${remotePkgDir}`);

      if (existsSync(localIntlDir)) {
        rmSync(localIntlDir, { force: true, recursive: true });
      } else {
        mkdirSync(localIntlDir);
      }

      onlyIntlFiles.forEach(intlFile => {
        cpSync(join(remoteIntlDir, intlFile), join(localIntlDir, intlFile), {
          force: true,
          recursive: true
        });
      });

      console.info(`Copying intl files from ${remotePkgDir}`);


      createIntlExportFile(localIntlDir);

      console.info(`Created index.ts for ${localPkgName}`);


    } else {
      console.info(`Skipping ${remoteIntlDir} since intl folder does not exists`);
    }

    rmSync(tmpDir, { force: true, recursive: true });
  });
} catch (e) {
  rmSync(tmpDir, { force: true, recursive: true });
  console.error(e);
  process.exit(0);
}


function createIntlExportFile(dir: string) {
  const sourceFile = join(dir, "index.ts");
  const files = readdirSync(dir);
  const intlFiles = files.filter(el => el && extname(el) === ".json");

  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
  const imports = intlFiles.map(file => createImport(file));

  const file = ts.factory.createSourceFile(
    [
      createLicense(),
      createNewLine(),
      ...imports,
      createNewLine(),
      createIntlExportDefault()
    ],
    ts.factory.createToken(1),
    0
  );

  const source = printer.printFile(file);
  const formattedSource = prettier.format(source, { parser: "typescript" });

  writeFileSync(sourceFile, formattedSource);

  function createLicense(): Statement {
    const licenseTemplate = readFileSync(licensePath, { encoding: "utf-8" });
    return ts.factory.createIdentifier(licenseTemplate) as unknown as Statement;
  }

  function createNewLine(): Statement {
    return ts.factory.createIdentifier("\n") as unknown as Statement;
  }

  function createIntlExportDefault() {
    const properties = imports.map(createExportPropertyAssignment);
    const literal = ts.factory.createObjectLiteralExpression(properties, true);
    return ts.factory.createExportDefault(literal);
  }

  function createExportPropertyAssignment(declaration: ImportDeclaration, index: number) {
    const key = ts.factory.createStringLiteral(intlFiles[index].replace(".json", ""), false);
    const value = ts.factory.createIdentifier(declaration.importClause?.name?.text ?? "");
    return ts.factory.createPropertyAssignment(key, value);
  }

  function createImport(fileName: string) {
    const namedImport = fileName.replace("-", "").replace(".json", "");

    return ts.factory.createImportDeclaration(
      undefined,
      undefined,
      ts.factory.createImportClause(false, ts.factory.createIdentifier(namedImport), undefined),
      ts.factory.createStringLiteral(`./${fileName}`)
    );
  }

}

