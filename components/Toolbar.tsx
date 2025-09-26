
import React from 'react';
import { EraserIcon, PaintBrushIcon, ClearIcon } from './icons';

interface ToolbarProps {
    color: string;
    setColor: (color: string) => void;
    size: number;
    setSize: (size: number) => void;
    isErasing: boolean;
    setIsErasing: (isErasing: boolean) => void;
    clearCanvas: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ color, setColor, size, setSize, isErasing, setIsErasing, clearCanvas }) => {
    return (
        <div className="bg-white px-3 sm:px-4 py-2 rounded-full shadow-lg flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
            {/* Brush/Eraser Toggle */}
            <div className="flex items-center bg-gray-100 rounded-full p-0.5 sm:p-1">
                <button
                    onClick={() => setIsErasing(false)}
                    className={`p-2 rounded-full transition-colors ${!isErasing ? 'bg-blue-500 text-white shadow' : 'text-gray-600 hover:bg-gray-200'}`}
                    title="Brush"
                    aria-pressed={!isErasing}
                >
                    <PaintBrushIcon className="w-5 h-5" />
                </button>
                <button
                    onClick={() => setIsErasing(true)}
                    className={`p-2 rounded-full transition-colors ${isErasing ? 'bg-blue-500 text-white shadow' : 'text-gray-600 hover:bg-gray-200'}`}
                    title="Eraser"
                    aria-pressed={isErasing}
                >
                    <EraserIcon className="w-5 h-5" />
                </button>
            </div>

            <div className="w-px h-8 bg-gray-200 hidden sm:block" />

            {/* Color Picker */}
            <div className="flex items-center" title="Brush Color">
                <label htmlFor="brushColor" className="sr-only">Color</label>
                <div 
                    className="w-8 h-8 rounded-full border-2 border-gray-200 relative cursor-pointer" 
                    style={{backgroundColor: color}}
                >
                    <input
                        type="color"
                        id="brushColor"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                </div>
            </div>
            
            <div className="w-px h-8 bg-gray-200 hidden sm:block" />

            {/* Brush Size */}
            <div className="flex items-center gap-2">
                <label htmlFor="brushSize" className="sr-only">Size</label>
                <input
                    type="range"
                    id="brushSize"
                    min="1"
                    max="50"
                    value={size}
                    onChange={(e) => setSize(Number(e.target.value))}
                    className="w-20 sm:w-28 md:w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    aria-label="Brush Size"
                    title="Brush Size"
                />
                <span className="text-sm text-gray-600 font-medium w-10 text-left">{size}px</span>
            </div>

            <div className="w-px h-8 bg-gray-200 hidden sm:block" />
            
            {/* Clear Button */}
            <button
                onClick={clearCanvas}
                className="flex items-center justify-center gap-1.5 py-2 px-3 sm:px-4 bg-red-500 text-white font-semibold rounded-full hover:bg-red-600 transition-colors"
                title="Clear Canvas"
            >
                <ClearIcon className="w-5 h-5" />
                <span className="hidden sm:inline">Clear</span>
            </button>
        </div>
    );
};

export default Toolbar;
