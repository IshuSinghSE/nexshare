'use client';
import { title } from '@/components/primitives';
import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardHeader, CardBody } from '@nextui-org/card';
import { Image } from '@nextui-org/image';
import { Button } from '@nextui-org/button';
import { getFileDetails } from '@/config/firebaseConfig';
import { FileDetailType } from '@/types';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PreviewPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const fileId = searchParams.get('fileId');
    const [fileDetails, setFileDetails] = useState<FileDetailType | null>(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (fileId) {
            const fetchFileDetails = async () => {
                const details = await getFileDetails(fileId as string);
                setFileDetails(details as FileDetailType);
            };
            fetchFileDetails();
        }
    }, [fileId]);

    if (!fileDetails) {
        return (
            <div className="flex flex-col justify-center items-center">
                <p className="font-semibold text-lg">Loading...</p>
            </div>
        );
    }

    const handleDownload = () => {
        if (isClient) {
            fetch(fileDetails.path, { mode: 'no-cors' })
                .then((response) => response.blob())
                .then((blob) => {
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = fileDetails.name;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);
                })
                .catch((error) =>
                    console.error('Error downloading file:', error)
                );
        }
    };

    return (
        <section className="flex flex-col items-center justify-center gap-8 py-8 md:py-8">
            <ToastContainer autoClose={5000} position="top-center" />
            <h1 className={title({ size: 'sm' })}>Preview</h1>
            <div className="inline-block max-w-xl text-center justify-center p-4 w-full">
                <Card className="py-2 w-full">
                    <CardHeader className="pb-0 pt-2 px-4 flex-col items-center gap-1">
                        <p className="text-sm capitalize font-bold">
                            Shared by {fileDetails.sharedBy}
                        </p>
                        <div className="flex gap-4">
                            <small className="text-default-500">
                                {fileDetails.size}
                            </small>
                            <small className="text-default-500">
                                {fileDetails.contentType}
                            </small>
                        </div>
                        <h4 className="font-bold text-large">
                            {fileDetails.name}
                        </h4>
                    </CardHeader>
                    <CardBody className="overflow-visible py-2 flex flex-col gap-5 items-center justify-center">
                        <Image
                            isZoomed
                            alt="File preview"
                            className="object-cover rounded-xl"
                            src={fileDetails.path}
                            width={270}
                        />
                        <div className="flex gap-3 flex-col w-full">
                            <Button
                                color="primary"
                                variant="shadow"
                                onClick={() =>
                                    isClient &&
                                    window.open(fileDetails.path, '_blank')
                                }
                            >
                                View File
                            </Button>
                            <Button
                                color="primary"
                                variant="ghost"
                                onClick={handleDownload}
                            >
                                Download
                            </Button>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </section>
    );
};

const PreviewPageWrapper = () => (
    <Suspense fallback={<div>Loading...</div>}>
        <PreviewPage />
    </Suspense>
);

export default PreviewPageWrapper;
