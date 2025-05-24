import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function Reordering({ songs, onDelete, onNavigate, onDragEnd }) {
    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="songs">
                {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-4">
                        {songs.map((song, index) => (
                            <Draggable key={song.id} draggableId={String(song.id)} index={index}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        onClick={() => onNavigate(song.id)}
                                        className={`flex items-start justify-between p-4 bg-white border rounded-lg shadow-md cursor-pointer transition ${snapshot.isDragging ? "bg-blue-100 shadow-lg" : ""
                                            }`}
                                    >
                                        <div>
                                            <h3 className="text-purple-600 font-semibold">{song.title}</h3>
                                            <p className="text-gray-600">Artist: {song.artist}</p>
                                            <p className="text-gray-600">Genre: {song.genre}</p>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDelete(song.id);
                                            }}
                                            className="text-red-500 hover:text-red-700 font-semibold"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
}
