'use client';
import { Card, CardHeader, CardBody } from '@nextui-org/card';
import { Image } from '@nextui-org/image';
import { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Progress } from '@nextui-org/progress';
import { Button } from '@nextui-org/button';
import {
    CancelIcon,
    PauseIcon,
    ShareIcon,
    CheckIcon,
} from '@/components/icons'; // Ensure these imports are correct
import {
    formatFileSize,
    formatFileType,
    getFileMetadata,
    saveFileDetails,
    uploadFiles,
} from '@/config/firebaseConfig';
import { ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUser } from '@/context/UserContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import FileModal from '@/app/components/FileModal';
import { useDisclosure } from '@nextui-org/modal';
import { extractFilePath } from '@/config/utils';
import { FileType } from '@/types';

const UploadPage = () => {
    const [isDragging, setIsDragging] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [fileURLs, setFileURLs] = useState<string[]>([]);
    const [fileData, setFileData] = useState<
        {
            id: string;
            name: string;
            size: number;
            contentType?: string;
            created: string;
            modified: string;
            path: string;
            type: string;
            status: string;
        }[]
    >([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<FileType | null>(null);

    const [uploadProgress, setUploadProgress] = useState<number[]>([]);
    const [abortControllers, setAbortControllers] = useState<AbortController[]>(
        []
    );
    const [isLoading, setIsLoading] = useState(false);
    const [showCheckIcon, setShowCheckIcon] = useState<boolean[]>([]); // State to manage visibility of check icons
    const [checkIconOpacity, setCheckIconOpacity] = useState<number[]>([]); // State to manage opacity of check icons
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const newFileURLs = acceptedFiles.map((file) =>
            URL.createObjectURL(file)
        );
        setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
        setFileURLs((prevURLs) => [...prevURLs, ...newFileURLs]);
        setUploadProgress((prevProgress) => [
            ...prevProgress,
            ...acceptedFiles.map(() => 0),
        ]);
        setAbortControllers((prevControllers) => [
            ...prevControllers,
            ...acceptedFiles.map(() => new AbortController()),
        ]);
        setShowCheckIcon((prevShow) => [
            ...prevShow,
            ...acceptedFiles.map(() => false),
        ]);
        setCheckIconOpacity((prevOpacity) => [
            ...prevOpacity,
            ...acceptedFiles.map(() => 1),
        ]);
        setIsDragging(false);
    }, []);

    const onDragOver = useCallback(() => {
        setIsDragging(true);
    }, []);

    const onDragLeave = useCallback(() => {
        setIsDragging(false);
    }, []);

    const handleDelete = (index: number) => {
        URL.revokeObjectURL(fileURLs[index]);
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
        setFileURLs((prevURLs) => prevURLs.filter((_, i) => i !== index));
        setUploadProgress((prevProgress) =>
            prevProgress.filter((_, i) => i !== index)
        );
        setAbortControllers((prevControllers) =>
            prevControllers.filter((_, i) => i !== index)
        );
        setShowCheckIcon((prevShow) => prevShow.filter((_, i) => i !== index));
        setCheckIconOpacity((prevOpacity) =>
            prevOpacity.filter((_, i) => i !== index)
        );
    };

    const handleStopUpload = (index: number) => {
        abortControllers[index].abort();
        setUploadProgress((prevProgress) =>
            prevProgress.map((progress, i) => (i === index ? 0 : progress))
        );
    };

    useEffect(() => {
        return () => {
            fileURLs.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [fileURLs]);

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    const { user } = useUser();

    const handleUpload = async () => {
        setIsLoading(true);
        const uploadPromises = files.map(
            (file, index) =>
                new Promise<void>((resolve, reject) => {
                    uploadFiles(
                        file,
                        user.uid,
                        (progress: number) => {
                            setUploadProgress((prevProgress) =>
                                prevProgress.map((p, i) =>
                                    i === index ? progress : p
                                )
                            );
                        },
                        (error: Error) => {
                            console.error(error);
                            reject(error);
                        },
                        (downloadURL: string) => {
                            console.log(extractFilePath(downloadURL));
                            getFileMetadata(extractFilePath(downloadURL))
                                .then((metadata) => {
                                    console.log('File Metadata:', metadata);
                                    setFileData((prevData) => [
                                        ...prevData,
                                        metadata,
                                    ]);
                                })
                                .catch((error) => {
                                    console.error(
                                        'Error fetching file metadata:',
                                        error
                                    );
                                });
                            setFileURLs((prevURLs) =>
                                prevURLs.map((url, i) =>
                                    i === index ? downloadURL : url
                                )
                            );
                            setShowCheckIcon((prevShow) =>
                                prevShow.map((show, i) =>
                                    i === index ? true : show
                                )
                            );
                            setTimeout(() => {
                                setCheckIconOpacity((prevOpacity) =>
                                    prevOpacity.map((opacity, i) =>
                                        i === index ? 0 : opacity
                                    )
                                );
                                setTimeout(() => {
                                    setShowCheckIcon((prevShow) =>
                                        prevShow.map((show, i) =>
                                            i === index ? false : show
                                        )
                                    );
                                    resolve();
                                }, 1000); // Wait for the opacity transition to complete
                            }, 1000);
                        }
                    );
                })
        );

        try {
            await Promise.all(uploadPromises);
        } catch (error) {
            console.error('Error uploading files:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleShareClick = async (index: number) => {
        const filePath = extractFilePath(fileURLs[index]);
        try {
            const metadata = await getFileMetadata(filePath);
            console.log('File Metadata:', metadata);
            const updatedFile = {
                id: metadata.id,
                name: metadata.name,
                size: metadata.size,
                contentType: formatFileType(metadata.contentType ?? 'unknown'),
                path: metadata.path,
                sharedBy: user?.displayName || 'Unknown',
            };
            setSelectedFile({
                id: metadata.id,
                name: files[index].name,
                size: files[index].size,
                contentType: files[index].type,
                created: metadata.created,
                modified: metadata.modified,
                path: metadata.path,
                type: metadata.type,
                status: metadata.status,
            });
            await saveFileDetails(updatedFile);
            setIsModalOpen(true); // Ensure modal is opened after setting selected file
        } catch (error) {
            console.error('Error fetching file metadata:', error);
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen p-4 w-full">
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
                transition={Bounce}
            />
            <Card className="w-full max-w-4xl">
                <CardBody className="overflow-visible p-8 w-full">
                    <div
                        {...getRootProps()}
                        className={`border-dashed border-3 ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'} transition-all ease-in-out rounded-xl p-4 flex grow flex-col items-center justify-center w-full`}
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                    >
                        <input {...getInputProps()} />
                        <Image
                            alt="Card background"
                            className={`object-cover rounded-xl mt-8 ${isDragging && 'scale-105'} transition-all ease-in-out`}
                            src="/upload.png"
                            width={120}
                            height={120}
                        />
                        <CardHeader className="pb-2 pt-4 px-4 flex-col items-center">
                            <h4 className="font-bold text-large">
                                Drop your files here, or{' '}
                                <span className="text-primary">Browse</span>
                            </h4>
                            <small className="text-default-500">
                                Supports: images, video, audio, etc
                            </small>
                        </CardHeader>
                    </div>
                    <div className="mt-4 w-full overflow-y-auto">
                        {files.map((file, index) => (
                            <div
                                key={index}
                                className={`p-2 ${index !== files.length - 1 ? 'border-b border-gray-200' : ''}`}
                            >
                                <div className="flex flex-row items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="mr-4">
                                            <Image
                                                alt={file.name}
                                                src={fileURLs[index]}
                                                width={50}
                                                height={50}
                                                className="object-cover rounded"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-bold">
                                                {file.name}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {(file.size / 1024).toFixed(2)}{' '}
                                                KB
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {file.type}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            isIconOnly
                                            variant="flat"
                                            color="danger"
                                            onClick={() => handleDelete(index)}
                                        >
                                            <CancelIcon />
                                        </Button>
                                        {uploadProgress[index] < 100 &&
                                            isLoading && (
                                                <Button
                                                    isIconOnly
                                                    variant="flat"
                                                    color="warning"
                                                    onClick={() =>
                                                        handleStopUpload(index)
                                                    }
                                                >
                                                    <PauseIcon />
                                                </Button>
                                            )}
                                        {uploadProgress[index] === 100 && (
                                            <>
                                                <Button
                                                    isIconOnly
                                                    variant="flat"
                                                    color="primary"
                                                    onClick={() =>
                                                        handleShareClick(index)
                                                    }
                                                >
                                                    <ShareIcon />
                                                </Button>
                                                {showCheckIcon[index] && (
                                                    <Button
                                                        isIconOnly
                                                        variant="flat"
                                                        color="success"
                                                        className="transition-opacity duration-1000 ease-in-out"
                                                        style={{
                                                            opacity:
                                                                checkIconOpacity[
                                                                    index
                                                                ],
                                                        }}
                                                    >
                                                        <CheckIcon />
                                                    </Button>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                                {uploadProgress[index] < 100 && isLoading && (
                                    <div className="w-full flex justify-center">
                                        <Progress
                                            key={index}
                                            aria-label="Uploading..."
                                            size="sm"
                                            value={uploadProgress[index]}
                                            color={
                                                uploadProgress[index] === 100
                                                    ? 'success'
                                                    : 'primary'
                                            }
                                            showValueLabel={true}
                                            className="w-full max-w-md mb-4"
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="mt-2 w-full flex justify-center">
                        <Button
                            isLoading={isLoading}
                            isDisabled={files.length === 0}
                            onClick={handleUpload}
                            color="primary"
                            variant="shadow"
                            className="w-1/2"
                        >
                            {isLoading ? 'Uploading...' : 'Upload'}
                        </Button>
                    </div>
                </CardBody>
            </Card>
            {selectedFile && (
                <FileModal
                    isOpen={isModalOpen}
                    onOpenChange={() => setIsModalOpen(false)}
                    fileName={selectedFile.name}
                    fileSize={formatFileSize(selectedFile.size)}
                    fileType={selectedFile.type}
                    fileURL={selectedFile.path}
                    sharedBy={user?.username || 'Unknown'}
                    id={selectedFile.id}
                />
            )}
        </div>
    );
};

export default function Upload() {
    return (
        <ProtectedRoute>
            <UploadPage />
        </ProtectedRoute>
    );
}
