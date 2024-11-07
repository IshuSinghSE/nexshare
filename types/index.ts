import { SVGProps } from 'react';

export type IconSvgProps = SVGProps<SVGSVGElement> & {
    size?: number;
};

export interface FileType {
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

export interface FileDetailType {
    id: string;
    name: string;
    size: number;
    contentType: string;
    path: string;
    sharedBy: string;
}
