import type { Component } from "solid-js";
import type { IWSData } from "../../utils/types";
import { For, createSignal, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import { useLocation } from "@solidjs/router";
import { createReconnectingWS, WSMessage } from "@solid-primitives/websocket";

const Room: Component = () => {
    const roomID = useLocation().pathname.split("/")[2];

    const [roundIndex, setRoundIndex] = createSignal(1); // TODO: Increment each round!!!
    const [answers, setAnswers] = createStore<WSMessage[]>([]);
    const [cards, setCards] = createStore<number[]>([]);

    const ws = createReconnectingWS(
        `wss://socketsbay.com/wss/v2/1/${import.meta.env.VITE_WS_API_KEY}/`
    );

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
        }
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

    onMount(() => generateRandomCards(roundIndex()));

    return (
        <>
            <h1>Room {roomID}</h1>
            <For each={answers}>{(answer) => <p>{answer.toString()}</p>}</For>
            <For each={cards}>
                {(card) => (
                    <button
                        value={card.toString()}
                        onClick={[handleCardSelect, card]}
                        class="w-[100px] h-[100px] border border-white rounded-md"
                    >
                        {card}
                    </button>
                )}
            </For>
        </>
    );
};

export default Room;
