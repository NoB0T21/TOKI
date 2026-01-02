'use client'
import React from 'react'
import * as Slider from '@radix-ui/react-slider';
import { useState, useRef, useEffect } from 'react';
import { getSongs } from '@/utils/clientAction';
import {motion} from 'motion/react'
import { Playbtn } from '../Icons';
import { useDebounce } from '@/hooks/useDebounce';

const RangeSlider = ({
  min = 0,
  max = 100,
  value,
  reg,
  onChange
}: {
  min?: number;
  max?: number;
  value: [number, number];
  reg:number,
  onChange: (val: [number, number]) => void;
}) => {
  const MAX_LENGTH = reg;
  return (
    <Slider.Root
      className="relative flex items-center w-full h-5 touch-none select-none"
      min={min}
      max={max}
      step={1}
      value={value}
      onValueChange={(v) => {
        const [start, end] = v;
        const clampedEnd = Math.min(start + MAX_LENGTH, end);
        const clampedStart = Math.max(end - MAX_LENGTH, start);

        if (end - start <= MAX_LENGTH) {
          onChange([start, end]);
        } else {
          // Determine which thumb moved
          const prevStart = value[0];
          const prevEnd = value[1];
          const movedStart = start !== prevStart;
          const movedEnd = end !== prevEnd;

          if (movedStart) {
            onChange([start, clampedEnd]);
          } else if (movedEnd) {
            onChange([clampedStart, end]);
          } else {
            onChange([start, end]);
          }
        }
      }}
    >
      <Slider.Track className="relative rounded-full h-5 grow">
        <div className='absolute flex items-center w-full h-full'>
            {Array.from({ length: max/3 }).map((_, index) => (
                <div className={`bg-[#818384] mr-[1px] rounded-xl w-[3px] ${index%2===0 || index%3===0?  'h-full':'h-1/2' }`} key={index}></div>
            ))}
        </div>
        <Slider.Range 
            className="absolute bg-[#1e99ea83] rounded-full h-full"
        />
      </Slider.Track>
      <Slider.Thumb className="block bg-white border border-[#3e4a57] rounded-md w-1.5 h-7" />
      <Slider.Thumb className="block bg-white border border-[#3e4a57] rounded-md w-1.5 h-7" />
    </Slider.Root>
  );
};


type Track = {
  _id: string;
  title: string;
  artist: string;
  previewUrl: string;
  duration: number;
};

const MusicSelect = ({ onSelect,reg }: {reg:number, onSelect: (track: Track & { start: number, end: number }) => void }) => {
    const [query, setQuery] = useState('');
    const debouncedQuery = useDebounce(query, 500)
  const [results, setResults] = useState<Track[]>([]);
  const [active, setActive] = useState<Track|null>(null);
  const [range, setRange] = useState<[number,number]>([0,reg]);
  const audioRef = useRef<HTMLAudioElement>(null);

  // 1. Search
  const doSearch = async () => {
    const  data  = await getSongs({query})
    setResults(data.songs);
  };

  // 2. When user picks a track, init slider
  const pick = (t: Track) => {
    setActive(t);
    setRange([0, Math.min(reg, t.duration)]);   // default 15-second clip
  };

  // 3. Sync preview playback with slider
  useEffect(() => {
    if (!audioRef.current || !active) return;
    const a = audioRef.current;
    a.currentTime = range[0];
    a.play().catch(() => { /* autoplay block */ });
    const onTime = () => {
      if (a.currentTime >= range[1]) {
        a.pause();
      }
    };
    a.addEventListener('timeupdate', onTime);
    return () => a.removeEventListener('timeupdate', onTime);
  }, [active, range]);

  useEffect(() => {
    if (debouncedQuery.trim()) {
      doSearch();
    }
  }, [debouncedQuery]);

  return (
    <div>
      {/* Search Bar */}
      <div className="flex max-w-100 mb-4">
        <input
          className="flex-grow p-2 border-[#3e4a57] border-1 rounded-md"
          placeholder="Search music..."
          value={query}
          onChange={e => {setQuery(e.target.value)}}
        />
      </div>

      {/* Results List */}
      <ul className="space-y-2">
        {results.length===0?'':results.map(t => (
          <li key={t._id} className="flex max-w-100 justify-between items-center text-sm">
            <div className='flex flex-col text-[#b0bec5]'>
                <span>{t.title}</span>
                <span className='text-xs'>by {t.artist}</span>   
            </div>
            <motion.button 
                className="flex items-center gap-1 bg-[#1a1e23] px-3 py-1 border-[#3e4a57] border-1 rounded-md w-19 text-xs" 
                onClick={() => pick(t)}
                type='button'
                style={{
                    ...(active?._id===t._id&&{backgroundImage: 'linear-gradient(270deg, #00c9ff, #2afadf, #4facfe, #6f86d6, #8e44ad,#6f86d6,#4facfe,#2afadf,#00c9ff)',
                    backgroundSize: '600% 600%',})
                }}
                animate={{
                    backgroundPosition: ['0% 50%', '100% 50%'],
                }}
                transition={{
                    left: { type: 'spring', stiffness: 300, damping: 30 },
                    width: { type: 'spring', stiffness: 300, damping: 30 },
                    backgroundPosition: {
                    duration: 8,
                    ease: 'linear',
                    repeat: Infinity,
                    },
                }}
            >
              <Playbtn/> PLay 
            </motion.button>
          </li>
        ))}
      </ul>

      {/* show slider + audio */}
      {active && (
        <div className="bg-[#1a1e23] mt-6 p-4 border border-[#3e4a57] rounded-xl">
          <h4 className="mb-2 font-semibold text-[#b0bec5]">
            <i>{active.title}</i>
          </h4>

          {/* Range Slider for start/end (in seconds) */}
          <RangeSlider
            min={0}
            max={active?.duration}
            value={range}
            reg={reg}
            onChange={(r) => setRange(r)}
            />
          <div className="flex justify-between mt-1 text-[#b0bec5] text-sm">
            <span>Start: {`${String(Math.floor(range[0]/60)).padStart(1,'0')}:${String(Math.floor(range[0]%60)).padStart(2,'0')}`}</span>
            <span>End: {`${String(Math.floor(range[1]/60)).padStart(1,'0')}:${String(Math.floor(range[1] % 60)).padStart(2, '0')}`}</span>
          </div>

          {/* Hidden audio for preview */}
          <audio ref={audioRef} src={active.previewUrl} />

          {/* Confirm Selection */}
          <motion.button
          whileTap={{scale:0.8}}
            className="bg-yellow-500 mt-4 px-2 py-1 rounded text-white"
            type='button'
            onClick={() => {onSelect({ ...active, start: range[0], end: range[1] });setResults([]);setActive(null)}}
          >
            Add Song
          </motion.button>
        </div>
      )}
    </div>
  )
}

export default MusicSelect
