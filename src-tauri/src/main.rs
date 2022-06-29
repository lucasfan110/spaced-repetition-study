#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::{fs, path::Path};

#[tauri::command]
fn rename_dir(from: &str, to: &str) -> Result<(), String> {
    fs::rename(from, to).map_err(|e| e.to_string())
}

#[tauri::command]
fn is_dir(dir: &str) -> bool {
    Path::new(dir).is_dir()
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![rename_dir, is_dir])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
