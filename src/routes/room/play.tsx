import type { Component } from "solid-js";
import type { IWSData } from "../../utils/types";
import { For, Show, createEffect, createSignal, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import { WSMessage } from "@solid-primitives/websocket";
import type { ReconnectingWebSocket } from "@solid-primitives/websocket";
import { useNavigate } from "@solidjs/router";

interface IProps {
    ws: ReconnectingWebSocket;
    playerCount: number;
    isAdmin: boolean;
    setIsPlaying: (isPlaying: boolean) => void;
}

const Play: Component<IProps> = ({
    ws,
    playerCount,
    isAdmin,
    setIsPlaying,
}) => {
    const navigate = useNavigate();
    const [roundIndex, setRoundIndex] = createSignal(1);
    const [answers, setAnswers] = createStore<WSMessage[]>([]);
    const [cards, setCards] = createStore<number[]>([]);
    const [enableNextRound, setEnableNextRound] = createSignal(false);

    onMount(() => generateRandomCards(roundIndex()));

    createEffect(() => {
        // Check if answers are in order

        if (answers.length >= 2) {
            // Only need to check the last 2 answers since effect is run whenever answer is updated
            const latestAns = Number(answers[answers.length - 1]);
            const prevAns = Number(answers[answers.length - 2]);

            if (latestAns < prevAns) {
                const data: IWSData = {
                    id: "loseGame",
                    message: "",
                };

                ws.send(JSON.stringify(data));

                navigate("/lose");
            }
        }
    });

    createEffect(() => {
        // Check if can go to next round

        if (isAdmin && answers.length === playerCount * roundIndex())
            setEnableNextRound(true);
    });

    const handleCardSelect = (value: number) => {
        // Remove selected card from deck
        setCards((cards) => cards.filter((card) => card !== value));

        // Update local answers array
        setAnswers(answers.length, value.toString());

        // Update others' answers array
        const data: IWSData = {
            id: "answer",
            message: value.toString(),
        };
        ws.send(JSON.stringify(data));
    };

    const generateRandomCards = (numberOfCards: number) => {
        if (numberOfCards === 0) return;

        for (let i = 0; i < numberOfCards; i++) {
            let randomCard = 1 + Math.floor(Math.random() * 100);

            while (cards.includes(randomCard)) {
                randomCard = 1 + Math.floor(Math.random() * 100);
            }
            setCards(cards.length, randomCard);
        }

        // Notify other players of your deck to prevent duplicate cards
        const data: IWSData = {
            id: "card",
            message: JSON.stringify(cards),
        };
        ws.send(JSON.stringify(data));
    };

    const handleWinCondition = () => {
        setAnswers([]);
        setRoundIndex(roundIndex() + 1);
        generateRandomCards(roundIndex());
    };

    const goToNextRound = () => {
        // Disable Next Round button
        setEnableNextRound(false);

        // Notify other players of round win
        const data: IWSData = {
            id: "winGame",
            message: "",
        };
        ws.send(JSON.stringify(data));

        handleWinCondition();
    };

    ws.addEventListener("message", (ev) => {
        const data: IWSData = JSON.parse(ev.data);
        switch (data.id) {
            case "answer":
                setAnswers(answers.length, data.message);
                break;
            case "card":
                // Handle duplicate cards
                for (const other of JSON.parse(data.message)) {
                    if (cards.includes(other))
                        // Remove duplicate cards
                        setCards((cards) =>
                            cards.filter((card) => card !== other)
                        );
                }

                // Replace duplicate cards
                generateRandomCards(roundIndex() - cards.length);
                break;
            case "loseGame":
                navigate("/lose");
                break;
            case "winGame":
                handleWinCondition();
                break;
        }
    });

    return (
        <>
            <div class="flex items-center justify-center flex-row gap-x-2 gap-y-2 mb-4">
                <For each={answers}>
                    {(answer) => <p>{answer.toString()}</p>}
                </For>
            </div>
            <div class="flex items-center justify-center flex-row gap-x-2 gap-y-2 w-[400px] flex-wrap">
                <For each={cards}>
                    {(card) => (
                        <button
                            value={card.toString()}
                            onClick={[handleCardSelect, card]}
                            class="w-[100px] h-[100px] border border-white rounded-md text-center bg-white text-black transition-colors hover:bg-black hover:text-white"
                        >
                            {card}
                        </button>
                    )}
                </For>
            </div>
            <Show when={enableNextRound()}>
                <button
                    onClick={() => goToNextRound()}
                    class="bg-white text-black border border-white rounded-md py-1 px-4 mt-4 transition-colors hover:bg-black hover:text-white"
                >
                    Next Round
                </button>
            </Show>
        </>
    );
};

export default Play;
