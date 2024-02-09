import { ChangeEvent, useState } from "react";
import logoNlwExpert from "./assets/logo-nlw-expert.svg";
import { NewNoteCard } from "./components/NewNoteCard";
import { NoteCard } from "./components/NoteCard";

interface Note {
  id: string;
  date: Date;
  content: string;
}

export function App() {
  const [search, setSearch] = useState("");
  const [notes, setNotes] = useState<Note[]>(() => {
    const notesOnStorage = localStorage.getItem("notes");

    if (notesOnStorage) {
      return JSON.parse(notesOnStorage);
    }
    return [];
  });

  const onNoteCreated = (content: string) => {
    const newNote = {
      id: crypto.randomUUID(),
      date: new Date(),
      content,
    };

    const notesArray = [newNote, ...notes];

    setNotes(notesArray);

    localStorage.setItem("notes", JSON.stringify(notesArray));
  };

  const onNoteDeleted = (id: string) => {
    const notesArray = notes.filter((note) => note.id != id);

    setNotes(notesArray);

    localStorage.setItem("notes", JSON.stringify(notesArray));
  };

  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    const query = event.target.value;

    setSearch(query);
  }

  {
    /**Filtrando para aparecer somente os objetos que incluem o que u usuario digitou */
  }
  const filteredNotes =
    search !== ""
      ? notes.filter((note) =>
          note.content.toLowerCase().includes(search.toLowerCase())
        )
      : notes;

  return (
    <div className="mx-auto max-w-6xl my-12 space-y-6 px-5">
      <img src={logoNlwExpert} alt="Nlw Expert" />
      <form onSubmit={(e) => e.preventDefault()} className="w-full">
        <input
          className="w-full bg-transparent text-3xl font-semibold tracking-tighter outline-none placeholder:text-slate-500"
          type="text"
          placeholder="Busque em suas notas..."
          onChange={handleSearch}
        />
      </form>

      <div className="h-px bg-slate-700" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]">
        <NewNoteCard onNoteCreated={onNoteCreated} />

        {/*Está mapeando os elementos que incluem oq digitou */}
        {filteredNotes.map((note) => {
          return (
            <NoteCard note={note} key={note.id} onNoteDeleted={onNoteDeleted} />
          );
        })}
      </div>
    </div>
  );
}
