/**
 * Usage:
 *   npx ts-node scripts/generate-module.ts auth
 *
 * This will create:
 *   src/modules/auth/auth.service.ts
 *   src/modules/auth/auth.controller.ts
 *   src/modules/auth/auth.route.ts
 * and inject it into src/modules/index.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const moduleName = process.argv[2];

if (!moduleName) {
  console.error('❌ Please provide a module name. Example: npx ts-node scripts/generate-module.ts auth');
  process.exit(1);
}

// 📂 Always resolve from project root
const modulesDir = path.join(process.cwd(), 'src', 'modules');
const moduleDir = path.join(modulesDir, moduleName);

// Capitalize for class names
const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

// Ensure modules dir exists
if (!fs.existsSync(modulesDir)) {
  fs.mkdirSync(modulesDir, { recursive: true });
}

// Create module folder
if (!fs.existsSync(moduleDir)) {
  fs.mkdirSync(moduleDir, { recursive: true });
  console.log(`📂 Created folder: ${moduleDir}`);
} else {
  console.log(`⚠️ Folder ${moduleDir} already exists`);
}

// --- Templates ---
const serviceTemplate = `// ${moduleName}.service.ts
class ${capitalize(moduleName)}Service {
  async example() {
    return "${moduleName} service working!";
  }
}

export default new ${capitalize(moduleName)}Service();
`;

const controllerTemplate = `// ${moduleName}.controller.ts
import { Request, Response } from 'express';
import ${moduleName}Service from './${moduleName}.service';

class ${capitalize(moduleName)}Controller {
  async example(req: Request, res: Response) {
    const result = await ${moduleName}Service.example();
    res.json({ message: result });
  }
}

export default new ${capitalize(moduleName)}Controller();
`;

const routeTemplate = `// ${moduleName}.route.ts
import { Router } from 'express';
import ${moduleName}Controller from './${moduleName}.controller';

const router = Router();

// Example route -> GET /api/v1/${moduleName}
router.get('/', (req, res) => ${moduleName}Controller.example(req, res));

export default router;
`;

// --- Write files ---
fs.writeFileSync(path.join(moduleDir, `${moduleName}.service.ts`), serviceTemplate);
fs.writeFileSync(path.join(moduleDir, `${moduleName}.controller.ts`), controllerTemplate);
fs.writeFileSync(path.join(moduleDir, `${moduleName}.route.ts`), routeTemplate);

console.log(`✅ Created ${moduleName} module files`);

// --- Inject into src/modules/index.ts ---
const indexFile = path.join(modulesDir, 'index.ts');
let indexContent = '';

if (fs.existsSync(indexFile)) {
  indexContent = fs.readFileSync(indexFile, 'utf-8');
} else {
  // Create fresh index.ts if missing
  indexContent = `import { Router } from 'express';

const router = Router();

export default router;
`;
}

// Lines to inject
const importLine = `import ${moduleName}Routes from './${moduleName}/${moduleName}.route';`;
const useLine = `router.use('/${moduleName}', ${moduleName}Routes);`;

// Add import
if (!indexContent.includes(importLine)) {
  indexContent = indexContent.replace(
    "import { Router } from 'express';",
    `import { Router } from 'express';\n${importLine}`
  );
}

// Add router.use
if (!indexContent.includes(useLine)) {
  indexContent = indexContent.replace(
    'export default router;',
    `  ${useLine}\n\nexport default router;`
  );
}

// Save updated index.ts
fs.writeFileSync(indexFile, indexContent, 'utf-8');
console.log(`🔗 Updated src/modules/index.ts to include /${moduleName}`);
