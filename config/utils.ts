// Initialize Firebase

export function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function extractFilePath(downloadURL: string): string {
    const url = new URL(downloadURL);
    const path = url.pathname.split('/o/')[1].split('?alt=media')[0];
    return decodeURIComponent(path);
}
