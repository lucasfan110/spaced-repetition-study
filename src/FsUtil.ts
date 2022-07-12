import { invoke } from "@tauri-apps/api/tauri";

export async function renameDir(from: string, to: string) {
    await invoke("rename_dir", {
        from,
        to,
    });
}

export async function isDir(dir: string): Promise<boolean> {
    return await invoke<boolean>("is_dir", { dir });
}

export default {
    renameDir,
    isDir,
};
