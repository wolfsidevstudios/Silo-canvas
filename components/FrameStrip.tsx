import React from 'react';
import { PlusIcon, TrashIcon, DuplicateIcon } from './icons';

interface FrameStripProps {
    frames: string[];
    currentFrameIndex: number;
    onSelectFrame: (index: number) => void;
    onAddFrame: () => void;
    onDuplicateFrame: () => void;
    onDeleteFrame: (index: number) => void;
}

const FrameStrip: React.FC<FrameStripProps> = ({ frames, currentFrameIndex, onSelectFrame, onAddFrame, onDuplicateFrame, onDeleteFrame }) => {
    return (
        <div className="w-full max-w-7xl mt-6 bg-white p-3 rounded-xl shadow-lg">
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {frames.map((frame, index) => (
                    <div
                        key={index}
                        onClick={() => onSelectFrame(index)}
                        className="relative flex-shrink-0 group cursor-pointer"
                    >
                        <div className={`w-28 h-16 rounded-lg bg-gray-200 overflow-hidden border-4 transition-colors ${currentFrameIndex === index ? 'border-blue-500' : 'border-transparent'}`}>
                            <img src={frame} alt={`Frame ${index + 1}`} className="w-full h-full object-cover" />
                        </div>
                        <span className="absolute top-1 left-2 text-xs font-bold text-white bg-black bg-opacity-50 px-1.5 py-0.5 rounded-full">
                            {index + 1}
                        </span>
                        {frames.length > 1 && (
                             <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteFrame(index);
                                }}
                                className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Delete Frame"
                            >
                                <TrashIcon className="w-4 h-4" />
                            </button>
                        )}
                       
                    </div>
                ))}
                 <div className="flex flex-col gap-1.5 flex-shrink-0">
                    <button
                        onClick={onAddFrame}
                        className="w-28 py-1.5 text-sm bg-blue-500 text-white rounded-full flex items-center justify-center gap-1.5 hover:bg-blue-600 transition-colors"
                        title="Add New Frame"
                    >
                        <PlusIcon className="w-4 h-4" />
                        <span>Add</span>
                    </button>
                    <button
                        onClick={onDuplicateFrame}
                        className="w-28 py-1.5 text-sm bg-green-500 text-white rounded-full flex items-center justify-center gap-1.5 hover:bg-green-600 transition-colors"
                        title="Duplicate Frame"
                    >
                        <DuplicateIcon className="w-4 h-4" />
                        <span>Duplicate</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FrameStrip;