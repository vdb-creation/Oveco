#!/usr/bin/env node
/**
 * Script pour créer une page admin simple pour la production
 * en attendant la configuration complète de TinaCMS
 */

import { writeFile, mkdir, access } from 'fs/promises';
import { join } from 'path';
import { constants } from 'fs';

const adminHTML = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Admin - Oveco</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    
    .container {
      max-width: 600px;
      width: 100%;
      background: white;
      border-radius: 16px;
      padding: 40px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      text-align: center;
    }
    
    h1 {
      color: #667eea;
      margin-bottom: 16px;
      font-size: 32px;
    }
    
    p {
      color: #666;
      margin-bottom: 32px;
      line-height: 1.6;
    }
    
    .info-box {
      background: #f7f9fc;
      border-left: 4px solid #667eea;
      padding: 20px;
      margin-bottom: 32px;
      text-align: left;
      border-radius: 4px;
    }
    
    .info-box h2 {
      color: #333;
      font-size: 18px;
      margin-bottom: 12px;
    }
    
    .info-box ul {
      list-style: none;
      color: #666;
    }
    
    .info-box li {
      padding: 8px 0;
      padding-left: 24px;
      position: relative;
    }
    
    .info-box li:before {
      content: "→";
      position: absolute;
      left: 0;
      color: #667eea;
    }
    
    .actions {
      display: flex;
      gap: 16px;
      flex-direction: column;
    }
    
    .btn {
      padding: 14px 28px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s;
      display: block;
    }
    
    .btn-primary {
      background: #667eea;
      color: white;
    }
    
    .btn-primary:hover {
      background: #5568d3;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }
    
    .btn-secondary {
      background: white;
      color: #667eea;
      border: 2px solid #667eea;
    }
    
    .btn-secondary:hover {
      background: #f7f9fc;
    }
    
    @media (max-width: 640px) {
      .container {
        padding: 24px;
      }
      
      h1 {
        font-size: 24px;
      }
      
      .actions {
        flex-direction: column;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🚧 Admin en Maintenance</h1>
    <p>L'interface d'administration TinaCMS n'est pas encore configurée pour la production.</p>
    
    <div class="info-box">
      <h2>Comment activer TinaCMS en production ?</h2>
      <ul>
        <li>Créez un compte sur <strong>TinaCMS Cloud</strong></li>
        <li>Ajoutez les variables d'environnement sur Netlify</li>
        <li>L'admin sera généré automatiquement au prochain déploiement</li>
      </ul>
    </div>
    
    <div class="actions">
      <a href="/" class="btn btn-primary">Retour au site</a>
      <a href="https://tina.io/docs" target="_blank" class="btn btn-secondary">Documentation TinaCMS</a>
    </div>
  </div>
</body>
</html>`;

async function fileExists(path) {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function createAdminPage() {
  try {
    const distAdminDir = join(process.cwd(), 'dist', 'admin');
    const publicAdminDir = join(process.cwd(), 'public', 'admin');
    const distAdminFilePath = join(distAdminDir, 'index.html');
    const publicAdminFilePath = join(publicAdminDir, 'index.html');
    
    // Vérifier si les variables d'environnement TinaCMS sont configurées
    const hasTinaClientId = process.env.NEXT_PUBLIC_TINA_CLIENT_ID && 
                           process.env.NEXT_PUBLIC_TINA_CLIENT_ID !== 'local';
    const hasTinaToken = process.env.TINA_TOKEN && 
                        process.env.TINA_TOKEN !== 'local';
    
    // Vérifier si un fichier admin existe déjà (généré par tinacms build)
    // Peut être dans dist/ (après astro build) ou public/ (avant astro build)
    const distAdminExists = await fileExists(distAdminFilePath);
    const publicAdminExists = await fileExists(publicAdminFilePath);
    const adminExists = distAdminExists || publicAdminExists;
    
    // Si TinaCMS est configuré et que le fichier admin existe, ne rien faire
    if (hasTinaClientId && hasTinaToken && adminExists) {
      console.log('✅ TinaCMS est configuré et le fichier admin existe déjà. Aucune action nécessaire.');
      return;
    }
    
    // Si TinaCMS est configuré mais le fichier n'existe pas, ne pas créer de page de maintenance
    // (probablement une erreur de build, mais laissons tinacms build gérer ça)
    if (hasTinaClientId && hasTinaToken) {
      console.log('⚠️  TinaCMS est configuré mais aucun fichier admin trouvé.');
      console.log('⚠️  Vérifiez que tinacms build s\'est exécuté avec succès avant astro build.');
      return;
    }
    
    // Créer la page de maintenance seulement si TinaCMS n'est pas configuré
    await mkdir(distAdminDir, { recursive: true });
    await writeFile(distAdminFilePath, adminHTML, 'utf-8');
    
    console.log('✅ Page admin de maintenance créée dans dist/admin/index.html');
    console.log('ℹ️  Pour activer TinaCMS en production:');
    console.log('   1. Créez un compte sur https://app.tina.io/');
    console.log('   2. Ajoutez NEXT_PUBLIC_TINA_CLIENT_ID et TINA_TOKEN dans les variables d\'environnement Netlify');
  } catch (error) {
    console.error('❌ Erreur lors de la création de la page admin:', error);
    process.exit(1);
  }
}

createAdminPage();
