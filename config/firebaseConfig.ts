// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
    deleteObject,
    list,
} from 'firebase/storage';
import { UploadTask, getMetadata } from 'firebase/storage';
import { toast } from 'react-toastify';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export function formatFileSize(size: number): string {
    if (size < 1024) return size + ' B';
    const i = Math.floor(Math.log(size) / Math.log(1024));
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    return (size / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
}

export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        return 'Today';
    } else if (diffDays === 1) {
        return 'Yesterday';
    } else if (diffDays < 7) {
        return `${diffDays} days ago`;
    } else if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else if (diffDays < 365) {
        const months = Math.floor(diffDays / 30);
        return `${months} month${months > 1 ? 's' : ''} ago`;
    } else {
        const years = Math.floor(diffDays / 365);
        return `${years} year${years > 1 ? 's' : ''} ago`;
    }
}

export function formatFileType(type: string): string {
    if (type.includes('svg+xml')) {
        return 'svg';
    }
    return type ? type.split('/')[1] : '';
}

export function uploadFiles(
    file: File,
    folder: string,
    onProgress: (progress: number) => void,
    onError: (error: Error) => void,
    onComplete: (downloadURL: string) => void
) {
    const storage = getStorage();
    const storageRef = ref(storage, 'nexshare/' + `${folder}/` + file.name);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
        'state_changed',
        (snapshot) => {
            const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress(progress);
        },
        (error) => {
            onError(error);
        },
        () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                toast.success('File uploaded successfully!');
                onComplete(downloadURL);
            });
        }
    );

    return uploadTask;
}

export function downloadFile(
    filePath: string,
    onComplete: (url: string) => void,
    onError: (error: Error) => void
) {
    const storage = getStorage();
    const storageRef = ref(storage, filePath);

    getDownloadURL(storageRef)
        .then((url) => {
            onComplete(url);
        })
        .catch((error) => {
            onError(error);
        });
}

export function pauseUpload(uploadTask: UploadTask) {
    uploadTask.pause();
}

export function resumeUpload(uploadTask: UploadTask) {
    uploadTask.resume();
}

export function cancelUpload(uploadTask: UploadTask) {
    uploadTask.cancel();
}

export function deleteFile(filePath: string) {
    const storage = getStorage();
    const storageRef = ref(storage, filePath);

    deleteObject(storageRef)
        .then(() => {
            toast.success('File deleted successfully!');
        })
        .catch((error) => {
            toast.error('Error deleting file');
        });
}

export async function deleteFileFromStorage(filePath: string, fileId: string) {
    const storage = getStorage();
    const storageRef = ref(storage, filePath);

    try {
        await deleteObject(storageRef);
        // toast.success('File deleted successfully from storage!');

        // Delete file details from Firestore
        const db = getFirestore(app);
        await deleteDoc(doc(db, 'files', fileId));
        toast.success('File deleted successfully!');
    } catch (error) {
        toast.error('Error deleting file');
        console.error('Error deleting file:', error);
    }
}

let fileListCache: Array<{
    id: string;
    name: string;
    size: number;
    contentType: string;
    created: string;
    modified: string;
    path: string;
    type: string;
    status: string;
}> | null = null;

export async function getFileMetadata(filePath: string) {
    const storage = getStorage();
    const fileRef = ref(storage, filePath);

    try {
        const metadata = await getMetadata(fileRef);
        const downloadURL = await getDownloadURL(fileRef);
        const fileMetadata = {
            id: metadata.generation,
            name: metadata.name,
            size: metadata.size,
            contentType: metadata.contentType,
            created: metadata.timeCreated,
            modified: metadata.updated,
            path: downloadURL,
            type: metadata.contentType ? 'file' : 'folder',
            status: 'restricted',
        };
        console.log('File Metadata:', fileMetadata);
        return fileMetadata;
    } catch (error) {
        console.error('Error fetching file metadata:', error);
        throw error;
    }
}

export async function getFilesList(userfolder: string) {
    if (fileListCache) {
        return fileListCache;
    }

    const storage = getStorage();
    const listRef = ref(storage, 'nexshare/' + userfolder);

    const firstPage = await list(listRef, { maxResults: 100 });
    const fileslist: Array<{
        id: string;
        name: string;
        size: number; // Store size as a number
        contentType: string;
        created: string;
        modified: string;
        path: string;
        type: string;
        status: string;
    }> = [];

    const metadataPromises = firstPage.items.map(async (itemRef) => {
        const metadata = await getMetadata(itemRef);
        const downloadURL = await getDownloadURL(itemRef);
        const type = metadata.contentType ? 'file' : 'folder';
        fileslist.push({
            id: metadata.generation,
            name: metadata.name,
            size: metadata.size, // Store size as a number
            contentType: formatFileType(metadata.contentType ?? 'unknown'),
            created: metadata.timeCreated,
            modified: metadata.updated,
            path: downloadURL, // Use download URL with access token
            type: type,
            status: 'restricted',
        });
    });

    await Promise.all(metadataPromises);

    if (firstPage.nextPageToken) {
        const secondPage = await list(listRef, {
            maxResults: 100,
            pageToken: firstPage.nextPageToken,
        });
        // Process second page if needed
    }

    fileListCache = fileslist;
    console.log(fileslist);
    return fileslist;
}

import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
    deleteDoc,
} from 'firebase/firestore';
import { FileDetailType, FileType } from '@/types';
// ...existing code...

const db = getFirestore(app);

export const saveFileDetails = async (file: FileDetailType) => {
    try {
        await setDoc(doc(db, 'files', file.id), file);
    } catch (error) {
        console.error('Error saving file details:', error);
    }
};

export const deleteFileDetails = async (fileId: string) => {
    try {
        await deleteDoc(doc(db, 'files', fileId));
    } catch (error) {
        console.error('Error saving file details:', error);
    }
};

export const getFileDetails = async (fileId: string) => {
    try {
        const docRef = doc(db, 'files', fileId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            console.log('No such document!');
        }
    } catch (error) {
        console.error('Error getting file details:', error);
    }
};
