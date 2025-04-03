import fs from "fs";
import path from "path";

const filePath = path.resolve("src/hooks/useSyncUserWithBackend.ts");

fs.access(filePath, fs.constants.F_OK, (err) => {
  if (err) {
    console.error(`❌ El archivo NO existe en: ${filePath}`);
  } else {
    console.log(`✅ El archivo EXISTE en: ${filePath}`);
  }
});
