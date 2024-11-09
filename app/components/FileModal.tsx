import {
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from '@nextui-org/modal';
import { Image } from '@nextui-org/image';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import {
    saveFileDetails,
    deleteFileFromStorage,
} from '@/config/firebaseConfig';
import { toast } from 'react-toastify';
import { CopyIcon, PlusIcon } from '@/components/icons';

interface FileModalProps {
    isOpen: boolean;
    onOpenChange: () => void;
    id: string;
    fileName: string;
    fileSize: string;
    fileType: string;
    fileURL: string;
    sharedBy: string;
}

const FileModal: React.FC<FileModalProps> = ({
    isOpen,
    onOpenChange,
    id,
    fileName,
    fileSize,
    fileType,
    fileURL,
    sharedBy,
}) => {
    const fileLink = `${window.location.origin}/preview?fileId=${id}`;

    const handleCopyLink = async () => {
        const fileDetails = {
            id: id, // Assuming the file ID is the last part of the URL
            name: fileName,
            size: parseFloat(fileSize),
            contentType: fileType,
            path: fileURL,
            sharedBy: sharedBy,
        };
        await saveFileDetails(fileDetails);
        navigator.clipboard.writeText(fileLink);
        toast.success('Link copied to clipboard');
    };

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement="top-center"
            className="w-full md:w-1/2 lg:w-1/3 mt-24"
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            <p className="text-sm capitalize font-bold">
                                Shared by {sharedBy}
                            </p>
                            <div className="flex gap-4">
                                <small className="text-default-500">
                                    {fileSize}
                                </small>
                                <small className="text-default-500">
                                    {fileType}
                                </small>
                            </div>
                            <h4 className="font-bold text-large">{fileName}</h4>
                        </ModalHeader>
                        <ModalBody>
                            <div className="flex flex-col items-center justify-center gap-5 py-2 px-1">
                                <Image
                                    isZoomed
                                    alt="File preview"
                                    className="object-cover rounded-xl"
                                    src={fileURL}
                                    width={270}
                                />
                                <div className="flex gap-3 flex-col w-full">
                                    <Button
                                        color="primary"
                                        variant="shadow"
                                        onClick={() =>
                                            window.open(fileURL, '_blank')
                                        }
                                    >
                                        View File
                                    </Button>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            readOnly
                                            value={fileLink}
                                            className="w-full"
                                        />
                                        <Button
                                            isIconOnly
                                            color="primary"
                                            variant="ghost"
                                            onClick={handleCopyLink}
                                        >
                                            <CopyIcon />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </ModalBody>
                        <ModalFooter></ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

interface DeleteModalProps {
    isOpen: boolean;
    onOpenChange: () => void;
    fileName: string;
    onDeleteConfirm: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
    isOpen,
    onOpenChange,
    fileName,
    onDeleteConfirm,
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement="top-center"
            className="w-full md:w-1/2 lg:w-1/3 mt-24"
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            <h4 className="font-bold text-large">
                                Delete File
                            </h4>
                        </ModalHeader>
                        <ModalBody>
                            <div className="flex flex-col items-center justify-center gap-5 py-2 px-1">
                                <p>
                                    Are you sure you want to delete {fileName}?
                                </p>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                color="danger"
                                onClick={() => {
                                    onDeleteConfirm();
                                    onClose();
                                }}
                            >
                                Delete
                            </Button>
                            <Button color="default" onClick={onClose}>
                                Cancel
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export { FileModal, DeleteModal };
