export interface IWSData {
    id:
        | "answer"
        | "card"
        | "joinRoom"
        | "leaveRoom"
        | "start"
        | "winGame"
        | "loseGame";
    message: string;
}
