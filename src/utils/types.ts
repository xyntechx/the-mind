export interface IWSData {
    id: "answer" | "card" | "joinRoom" | "leaveRoom" | "winGame" | "loseGame";
    message: string;
}
