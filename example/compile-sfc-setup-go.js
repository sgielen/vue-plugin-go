const fs = require('fs');
const { parse, compileTemplate, compileScript, compileStyle } = require('@vue/compiler-sfc');
const ts = require('typescript');
const { spawn } = require('child_process');

const filePath = './MyComponent.vue';
const templateOutputPath = './MyComponent.template.js';
const goOutputPath = './MyComponent.go';
const scriptOutputPath = './MyComponent.js';
const styleOutputPath = './MyComponentStyle.css';

// Load the SFC file
const fileContent = fs.readFileSync(filePath, 'utf-8');

// Parse the SFC
const { descriptor } = parse(fileContent);

// Check if it's really Go script setup
const scriptSetup = descriptor.scriptSetup
if (!scriptSetup || scriptSetup.lang != "go") {
  throw new Error('is not Go script setup')
}

// Compile the template
const templateResult = compileTemplate({
  source: descriptor.template.content,
  id: 'MyComponent',
});
fs.writeFileSync(templateOutputPath, templateResult.code);
console.log(`Javascript template written to ${templateOutputPath}`);

// Transpile Go to JavaScript
// TODO: id -> name?
const goScript = `package main;\n` + scriptSetup.content
fs.writeFileSync(goOutputPath, goScript);
console.log(`Raw Go written to ${goOutputPath}`);
spawn('bash', ['-c', 'GOOS=js GOARCH=wasm go build -o MyComponent.wasm'], { stdio: 'inherit' })
spawn('bash', ['-c', 'cp "$(go env GOROOT)/misc/wasm/wasm_exec.js" .'], { stdio: 'inherit' })
console.log(`Compiled WASM written to MyComponent.wasm`);

// Write the compiled script to MyComponent.js
//const jsScript = ``;
//fs.writeFileSync(scriptOutputPath, jsScript);
console.log(`Compiled Script written to ${scriptOutputPath}`);

// Compile the styles
descriptor.styles.forEach((style, i) => {
  const styleResult = compileStyle({
    source: style.content,
    id: 'MyComponent',
    scoped: style.scoped,
  });

  // Write the compiled CSS to MyComponentStyle.css
  fs.writeFileSync(styleOutputPath, styleResult.code);
  console.log(`Compiled Style written to ${styleOutputPath}`);
});

