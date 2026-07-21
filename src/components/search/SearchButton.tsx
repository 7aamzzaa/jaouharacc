import { Search } from 'lucide-react';

interface SearchButtonProps {
  onClick: () => void;
}

export default function SearchButton({ onClick }: SearchButtonProps) {
  return (
    <button
      onClick={onClick}
      className="cursor-pointer relative p-2 text-stone-700 hover:text-champagne-500 transition-colors duration-300 focus:outline-hidden"
      aria-label="Search products"
    >
      <Search size={22} strokeWidth={1.5} />
    </button>
  );
}
