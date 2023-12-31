import type { Component } from "solid-js";

const App: Component = ({ children }: { children: Element }) => {
    return (
        <main class="flex items-center justify-center flex-col w-screen min-h-screen p-4 bg-black text-white">
            {children}
        </main>
    );
};

export default App;
