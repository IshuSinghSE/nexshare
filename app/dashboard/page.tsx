/* eslint-disable */
'use client';
import React, { useEffect, useState } from 'react';
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    SortDescriptor,
} from '@nextui-org/table';

import { columns, statusOptions } from '@/config/data';
import { capitalize } from '@/config/utils';
import {
    ChevronDownIcon,
    PauseIcon,
    PlusIcon,
    RefreshIcon,
    SearchIcon,
    VerticalDotsIcon,
} from '@/components/icons';
import { User } from '@nextui-org/user';
import { Chip } from '@nextui-org/chip';
import {
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
} from '@nextui-org/dropdown';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { Pagination } from '@nextui-org/pagination';
import Link from 'next/link';
import {
    formatFileSize,
    formatDate,
    getFilesList,
    deleteFileFromStorage,
    saveFileDetails,
} from '@/config/firebaseConfig';
import { useUser } from '@/context/UserContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import FileModal from '../components/FileModal';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface FileType {
    id: string;
    name: string;
    size: number;
    contentType: string;
    created: string;
    modified: string;
    path: string;
    type: string;
    status: string;
}

const statusColorMap: Record<string, 'success' | 'danger' | 'warning'> = {
    active: 'success',
    paused: 'danger',
    vacation: 'warning',
};

const INITIAL_VISIBLE_COLUMNS = [
    'name',
    'size',
    'filetype',
    'status',
    'actions',
];

const DashboardPage = () => {
    const [filterValue, setFilterValue] = React.useState<string>('');
    const [selectedKeys, setSelectedKeys] = React.useState<Set<string>>(
        new Set([])
    );
    const [visibleColumns, setVisibleColumns] = React.useState<Set<string>>(
        new Set(INITIAL_VISIBLE_COLUMNS)
    );
    const [statusFilter, setStatusFilter] = React.useState<
        string | Set<string>
    >('all');
    const [rowsPerPage, setRowsPerPage] = React.useState<number>(10);
    const [sortDescriptor, setSortDescriptor] = React.useState<{
        column: string;
        direction: 'ascending' | 'descending';
    }>({
        column: 'size',
        direction: 'ascending',
    });
    const [page, setPage] = React.useState<number>(1);
    const [files, setFiles] = React.useState<FileType[]>([]);
    const { user } = useUser();
    const [loading, setLoading] = React.useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<FileType | null>(null);

    const fileCache = React.useRef<FileType[]>([]);

    const refreshFileList = async () => {
        try {
            const data = await getFilesList(user?.uid);
            fileCache.current = data;
            setFiles(data);
        } catch (error) {
            console.error('Error refreshing file list:', error);
        }
    };

    const loadMoreFiles = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const data = await getFilesList(user?.uid);
            fileCache.current = [...fileCache.current, ...data];
            setFiles(fileCache.current);
        } catch (error) {
            console.error('Error loading more files:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            refreshFileList();
        }
    }, [user]);

    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop !==
                document.documentElement.offsetHeight
            )
                return;
            loadMoreFiles();
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loading]);

    const users = files.map((file) => ({
        ...file,
    }));

    const pages = Math.ceil(users.length / rowsPerPage);

    const hasSearchFilter = Boolean(filterValue);

    const headerColumns = React.useMemo(() => {
        if (visibleColumns.size === columns.length - 1) return columns;

        return columns.filter((column) =>
            Array.from(visibleColumns).includes(column.uid)
        );
    }, [visibleColumns]);

    const filteredItems = React.useMemo(() => {
        let filteredUsers = [...users];

        if (hasSearchFilter) {
            filteredUsers = filteredUsers.filter((file) =>
                file.name.toLowerCase().includes(filterValue.toLowerCase())
            );
        }
        if (
            statusFilter !== 'all' &&
            Array.from(statusFilter).length !== statusOptions.length
        ) {
            filteredUsers = filteredUsers.filter((file) =>
                Array.from(statusFilter).includes(file.status)
            );
        }

        return filteredUsers;
    }, [users, filterValue, statusFilter, hasSearchFilter]);

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);

    const sortedItems = React.useMemo(() => {
        return [...items].sort((a, b) => {
            const first = a[sortDescriptor.column as keyof FileType];
            const second = b[sortDescriptor.column as keyof FileType];
            const cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === 'descending' ? -cmp : cmp;
        });
    }, [sortDescriptor, items]);

    const handleShareClick = async (file: FileType) => {
        setSelectedFile(file);
        setIsModalOpen(true);

        // Update file status to active
        const updatedFile = {
            ...file,
            status: 'active',
            sharedBy: user?.displayName || 'Unknown',
        };
        try {
            await saveFileDetails(updatedFile);
            refreshFileList();
        } catch (error) {
            console.error('Error updating file status:', error);
        }
    };

    const handleDeleteClick = async (file: FileType) => {
        if (confirm(`Are you sure you want to delete ${file.name}?`)) {
            try {
                await deleteFileFromStorage(file.path, file.id);
                refreshFileList();
            } catch (error) {
                console.error('Error deleting file:', error);
            }
        }
    };

    const renderCell = React.useCallback(
        (file: FileType, columnKey: string) => {
            const cellValue = file[columnKey as keyof FileType];

            switch (columnKey) {
                case 'name':
                    return (
                        <User
                            avatarProps={{
                                radius: 'full',
                                size: 'sm',
                                src: file.path,
                            }}
                            classNames={{
                                description: 'text-default-500',
                            }}
                            description={formatDate(file.modified)}
                            name={cellValue as string}
                        >
                            {formatDate(file.modified)}
                        </User>
                    );
                case 'size':
                    return (
                        <div className="flex flex-col">
                            <p className="text-bold text-small">
                                {formatFileSize(file.size)}{' '}
                                {/* Format size for display */}
                            </p>
                        </div>
                    );
                case 'filetype':
                    return (
                        <div className="flex flex-col">
                            <p className="text-bold text-small">
                                {cellValue as string}
                            </p>
                            <p className="text-bold text-tiny text-default-500">
                                {file.contentType}
                            </p>
                        </div>
                    );
                case 'status':
                    return (
                        <Chip
                            className="capitalize border-none gap-1 text-default-600"
                            color={statusColorMap[file.status]}
                            size="sm"
                            variant="dot"
                        >
                            {cellValue as string}
                        </Chip>
                    );
                case 'actions':
                    return (
                        <div className="relative flex justify-end items-center gap-2">
                            <Dropdown className="bg-background border-1 border-default-200">
                                <DropdownTrigger>
                                    <Button
                                        isIconOnly
                                        radius="full"
                                        size="sm"
                                        variant="light"
                                    >
                                        <VerticalDotsIcon className="text-default-400" />
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu>
                                    <DropdownItem
                                        onClick={() =>
                                            window.open(file.path, '_blank')
                                        }
                                    >
                                        View
                                    </DropdownItem>
                                    {/* <DropdownItem>Edit</DropdownItem> */}
                                    <DropdownItem
                                        onClick={() => handleShareClick(file)}
                                    >
                                        Share
                                    </DropdownItem>
                                    <DropdownItem
                                        onClick={() => handleDeleteClick(file)}
                                    >
                                        Delete
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                    );
                case 'created':
                case 'modified':
                    return formatDate(cellValue as string); // Format date for display
                default:
                    return cellValue as string;
            }
        },
        []
    );

    const onRowsPerPageChange = React.useCallback(
        (e: React.ChangeEvent<HTMLSelectElement>) => {
            setRowsPerPage(Number(e.target.value));
            setPage(1);
        },
        []
    );

    const onSearchChange = React.useCallback((value: string) => {
        if (value) {
            setFilterValue(value);
            setPage(1);
        } else {
            setFilterValue('');
        }
    }, []);

    const handleColumnSelectionChange = (keys: Set<string>) => {
        if (!keys.has('name')) {
            keys.add('name');
        }
        setVisibleColumns(keys);
    };

    const topContent = React.useMemo(() => {
        return (
            <div className="flex flex-col gap-4">
                <ToastContainer autoClose={5000} position="top-center" />
                <div className="flex justify-between gap-3 items-end">
                    <Input
                        isClearable
                        classNames={{
                            base: 'w-full sm:max-w-[44%] bg-default-100',
                            inputWrapper: 'border-1',
                        }}
                        placeholder="Search by name..."
                        size="sm"
                        startContent={
                            <SearchIcon className="text-default-300" />
                        }
                        value={filterValue}
                        variant="bordered"
                        onClear={() => setFilterValue('')}
                        onValueChange={onSearchChange}
                    />
                    <div className="flex gap-3">
                        <Button
                            isIconOnly
                            size="sm"
                            variant="flat"
                            onClick={() => refreshFileList()}
                        >
                            <RefreshIcon size={20} />
                        </Button>

                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button
                                    endContent={
                                        <ChevronDownIcon className="text-small" />
                                    }
                                    size="sm"
                                    variant="flat"
                                >
                                    Status
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={statusFilter}
                                selectionMode="multiple"
                                onSelectionChange={(keys) =>
                                    setStatusFilter(keys as Set<string>)
                                }
                            >
                                {statusOptions.map((status) => (
                                    <DropdownItem
                                        key={status.uid}
                                        className="capitalize"
                                    >
                                        {capitalize(status.name)}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button
                                    endContent={
                                        <ChevronDownIcon className="text-small" />
                                    }
                                    size="sm"
                                    variant="flat"
                                >
                                    Columns
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={visibleColumns}
                                selectionMode="multiple"
                                onSelectionChange={(keys) =>
                                    handleColumnSelectionChange(
                                        keys as Set<string>
                                    )
                                }
                            >
                                {columns.map((column) => (
                                    <DropdownItem
                                        key={column.uid}
                                        className="capitalize"
                                    >
                                        {capitalize(column.name)}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                        <Link href="/upload">
                            <Button
                                className="bg-foreground text-background"
                                endContent={<PlusIcon />}
                                size="sm"
                            >
                                Add New
                            </Button>
                        </Link>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">
                        Total {users.length} users
                    </span>
                    <label className="flex items-center text-default-400 text-small">
                        Rows per page:
                        <select
                            className="bg-transparent outline-none text-default-400 text-small"
                            onChange={onRowsPerPageChange}
                        >
                            <option value="10">10</option>
                            <option value="15">15</option>
                            <option value="20">20</option>
                        </select>
                    </label>
                </div>
            </div>
        );
    }, [
        filterValue,
        statusFilter,
        visibleColumns,
        onSearchChange,
        onRowsPerPageChange,
        users.length,
        hasSearchFilter,
    ]);

    const bottomContent = React.useMemo(() => {
        return (
            <div className="py-2 px-2 flex justify-between items-center">
                <Pagination
                    showControls
                    classNames={{
                        cursor: 'bg-foreground text-background',
                    }}
                    color="default"
                    isDisabled={hasSearchFilter}
                    page={page}
                    total={pages}
                    variant="light"
                    onChange={setPage}
                />
                <span className="text-small text-default-400">
                    {selectedKeys.size === items.length
                        ? 'All items selected'
                        : `${selectedKeys.size} of ${items.length} selected`}
                </span>
            </div>
        );
    }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

    const classNames = React.useMemo(
        () => ({
            wrapper: ['max-h-[382px]', 'max-w-3xl'],
            th: [
                'bg-transparent',
                'text-default-500',
                'border-b',
                'border-divider',
            ],
            td: [
                // changing the rows border radius
                // first
                'group-data-[first=true]:first:before:rounded-none',
                'group-data-[first=true]:last:before:rounded-none',
                // middle
                'group-data-[middle=true]:before:rounded-none',
                // last
                'group-data-[last=true]:first:before:rounded-none',
                'group-data-[last=true]:last:before:rounded-none',
            ],
        }),
        []
    );

    return (
        <>
            <Table
                isCompact
                removeWrapper
                aria-label="Example table with custom cells, pagination and sorting"
                bottomContent={bottomContent}
                bottomContentPlacement="outside"
                checkboxesProps={{
                    classNames: {
                        wrapper:
                            'after:bg-foreground after:text-background text-background',
                    },
                }}
                classNames={classNames}
                selectedKeys={selectedKeys}
                selectionMode="multiple"
                sortDescriptor={sortDescriptor}
                topContent={topContent}
                topContentPlacement="outside"
                onSelectionChange={(keys) =>
                    setSelectedKeys(
                        'all' === keys
                            ? new Set(items.map((i) => i.id.toString()))
                            : (keys as Set<string>)
                    )
                }
                onSortChange={(descriptor: SortDescriptor) => {
                    if (
                        descriptor.column &&
                        typeof descriptor.column === 'string'
                    ) {
                        setSortDescriptor({
                            column: descriptor.column,
                            direction: descriptor.direction ?? 'ascending',
                        });
                    }
                }}
            >
                <TableHeader columns={headerColumns}>
                    {(column) => (
                        <TableColumn
                            key={column.uid}
                            align={
                                column.uid === 'actions' ? 'center' : 'start'
                            }
                            allowsSorting={column.sortable}
                        >
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody
                    emptyContent={'No files yet, Upload files to share.'}
                    items={sortedItems}
                >
                    {(item) => (
                        <TableRow key={item.id}>
                            {(columnKey) => (
                                <TableCell key={columnKey}>
                                    {renderCell(item, columnKey as string)}
                                </TableCell>
                            )}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            {selectedFile && (
                <FileModal
                    isOpen={isModalOpen}
                    onOpenChange={() => setIsModalOpen(false)}
                    id={selectedFile.id}
                    fileName={selectedFile.name}
                    fileSize={formatFileSize(selectedFile.size)}
                    fileType={selectedFile.contentType}
                    fileURL={selectedFile.path}
                    sharedBy={user?.displayName || 'Unknown'}
                />
            )}
        </>
    );
};

export default function Dashboard() {
    return (
        <ProtectedRoute>
            <DashboardPage />
        </ProtectedRoute>
    );
}
/* eslint-enable */
