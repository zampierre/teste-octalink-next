import Image from "next/image";
import Link from "next/link"; // Importando o componente Link do Next.js

export default function Apology() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-2xl font-bold text-center">Desculpas</h1>
        <p className="text-center">
          Olá! Infelizmente, não consegui implementar o código em Angular que
          esperava. No entanto, gostaria de compartilhar meu conhecimento em{" "}
          <strong>Next.js</strong>.
        </p>
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Link
            href="/inicial"
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
          >
            Ir para o teste
          </Link>
        </div>
      </main>
    </div>
  );
}
