import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

let speechRecognition: SpeechRecognition | null = null;
export function NewNoteCard({ onNoteCreated }) {
  const [shouldShowOnBoarding, setShouldShowOnBoarding] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [content, setContent] = useState("");
  const handleStartTextArea = () => {
    setShouldShowOnBoarding(false);
  };

  const handleClickedAddNote = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value);
    if (event.target.value == "") {
      setShouldShowOnBoarding(true);
    }
  };

  const handleSaveNote = (event: FormEvent) => {
    event.preventDefault();

    //passando o conteudo pra função de criar notas que veio do props
    if (content == "") {
      toast.error("Digite algo!");
      return;
    }
    onNoteCreated(content);

    setShouldShowOnBoarding(true);
    setContent("");
    toast.success("Nota criada com sucesso!");
  };

  const handleStartingRecording = () => {
    const isSpeechRecognitionApiAvailable =
      "SpeechRecognition" in window || "webkitSpeechRecognition" in window;

    if (!isSpeechRecognitionApiAvailable) {
      alert("Infelizmente seu navegador não suporta a api de gravação");
      return;
    }

    setIsRecording(true);
    setShouldShowOnBoarding(false);
    const SpeechRecognitionApi =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    speechRecognition = new SpeechRecognitionApi();

    speechRecognition.lang = "pt-BR";
    speechRecognition.continuous = true;
    speechRecognition.maxAlternatives = 1;
    speechRecognition.interimResults = true;

    speechRecognition.onresult = (event) => {
      const transcription = Array.from(event.results).reduce((text, result) => {
        return text + result[0].transcript;
      }, "");
      setContent(transcription);
    };

    speechRecognition.onerror = (event) => {
      console.error(event);
    };

    speechRecognition.start();
  };
  const handleStopRecording = () => {
    setIsRecording(false);

    if (speechRecognition !== null) {
      speechRecognition.stop();
    }
  };
  return (
    <Dialog.Root>
      <Dialog.Trigger
        onClick={handleClickedAddNote}
        className="rounded-nd flex flex-col gap-3 text-left bg-slate-700 p-5 hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400 outline-none"
      >
        <span className="text-small font-medium text-slate-200">
          Adicionar nota
        </span>
        <p className="text-small leading-6 text-slate-400 text-sm">
          Grave uma nota em áudio que será convertida para texto
          automaticamente.
        </p>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="inset-0 fixed bg-black/60" />
        <Dialog.Content className="outline-none fixed inset-0 md:inset-auto overflow-hidden md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 flex flex-col md:rounded-md">
          <Dialog.Close className="absolute top-0 right-0 p-1.5 text-slate-400 bg-slate-800 hover:text-slate-100">
            <X className="size-5" />
          </Dialog.Close>
          <form className="flex h-full flex-col">
            <div className="flex flex-1 flex-col gap-3 p-5">
              <span className="text-small font-medium text-slate-300">
                Adicionar nota
              </span>
              {shouldShowOnBoarding ? (
                <p className="text-small leading-6 text-slate-400 text-sm">
                  Comece{" "}
                  <button
                    onClick={handleStartingRecording}
                    className="font-medium text-lime-400 hover:underline "
                    type="button"
                  >
                    gravando uma nota
                  </button>{" "}
                  em audio ou se preferir{" "}
                  <button
                    className="font-medium text-lime-400 hover:underline "
                    onClick={handleStartTextArea}
                  >
                    utilize apenas texto
                  </button>
                </p>
              ) : (
                <textarea
                  autoFocus
                  className="text-small leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none"
                  onChange={handleClickedAddNote}
                  value={content}
                />
              )}
            </div>

            {isRecording ? (
              <button
                type="button"
                onClick={handleStopRecording}
                className="flex items-center justify-center gap-2 bg-slate-900 w-full text-slate-300 py-4 text-center text-small outline-none font-medium hover:text-slate-100"
              >
                <div className="size-3 rounded-full bg-red-500 animate-pulse"></div>
                Gravando (clique p/ interromper)
              </button>
            ) : (
              <button
                onClick={handleSaveNote}
                type="button"
                className=" bg-lime-400 w-full text-lime-950 py-4 text-center text-small outline-none font-medium hover:bg-lime-500"
              >
                Salvar nota
              </button>
            )}
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
