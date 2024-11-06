'use client';
import { Card, CardHeader, CardBody } from '@nextui-org/card';
import { Image } from '@nextui-org/image';
import { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Progress } from '@nextui-org/progress';
import { Button } from '@nextui-org/button';
import { CancelIcon, PauseIcon } from '@/components/icons';
// import { FaTrash, FaStop } from 'react-icons/fa';

export default function UploadPage() {
    const [isDragging, setIsDragging] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [uploadProgress, setUploadProgress] = useState<number[]>([]);
    const [abortControllers, setAbortControllers] = useState<AbortController[]>(
        []
    );

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
        setUploadProgress((prevProgress) => [
            ...prevProgress,
            ...acceptedFiles.map(() => 0),
        ]);
        setAbortControllers((prevControllers) => [
            ...prevControllers,
            ...acceptedFiles.map(() => new AbortController()),
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
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
        setUploadProgress((prevProgress) =>
            prevProgress.filter((_, i) => i !== index)
        );
        setAbortControllers((prevControllers) =>
            prevControllers.filter((_, i) => i !== index)
        );
    };

    const handleStopUpload = (index: number) => {
        abortControllers[index].abort();
        setUploadProgress((prevProgress) =>
            prevProgress.map((progress, i) => (i === index ? 0 : progress))
        );
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setUploadProgress((prevProgress) =>
                prevProgress.map((progress) =>
                    progress >= 100 ? 100 : progress + 10
                )
            );
        }, 500);

        return () => clearInterval(interval);
    }, []);

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    return (
        <Card className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8/12">
            <CardBody className="overflow-visible p-8">
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
                <div className="mt-4 w-full">
                    {files.map((file, index) => (
                        <div key={index} className="border-b border-gray-200">
                            <div className="flex flex-row items-center justify-between p-2 ">
                                <div className="flex items-center">
                                    <div className="mr-4">
                                        <Image
                                            alt={file.name}
                                            src={URL.createObjectURL(file)}
                                            width={50}
                                            height={50}
                                            className="object-cover rounded"
                                        />
                                    </div>
                                    <div>
                                        {uploadProgress[index] < 100 ? (
                                            <p className="text-md text-gray-700 font-bold">
                                                Uploading{' ... '}
                                            </p>
                                        ) : (
                                            <>
                                                <p className="font-bold">
                                                    {file.name}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {(file.size / 1024).toFixed(
                                                        2
                                                    )}{' '}
                                                    KB
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {file.type}
                                                </p>
                                            </>
                                        )}
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
                                    {uploadProgress[index] < 100 && (
                                        <Button
                                            isIconOnly
                                            variant="flat"
                                            color="warning"
                                            onClick={() => handleStopUpload(index)}
                                        >
                                            <PauseIcon />
                                        </Button>
                                    )}
                                </div>
                            </div>
                            {uploadProgress[index] < 100 && (
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
            </CardBody>
        </Card>
    );
}
