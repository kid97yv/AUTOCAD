// @types/filereader.d.ts
declare module 'filereader' {
    export default class FileReader {
        readAsText(file: File): void;
        addEventListener(event: string, callback: (event: ProgressEvent<FileReader>) => void): void;
    }
}