<?php
function oveco_manifest_path(): string {
  return get_stylesheet_directory() . '/dist/manifest.json';
}
function oveco_manifest_url(string $asset): ?string {
  $manifest_file = oveco_manifest_path();
  if (file_exists($manifest_file)) {
    $manifest = json_decode(file_get_contents($manifest_file), true);
    if (isset($manifest[$asset]['file'])) {
      return get_stylesheet_directory_uri() . '/dist/' . $manifest[$asset]['file'];
    }
  }
  return null;
}

