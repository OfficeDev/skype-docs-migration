declare module jCafe {
    export interface AudioService {
        transfer: Command<(sipuri: string) => Promise<void>>;
    }
}