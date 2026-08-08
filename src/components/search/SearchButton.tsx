import { Search } from 'lucide-react';
import { useTranslation } from '../../i18n';

interface SearchButtonProps {
  onClick: () => void;
  className?: string;
  iconClassName?: string;
}

export default function SearchButton({ onClick, className = '', iconClassName = '' }: SearchButtonProps) {
  const { t } = useTranslation();
  return (
    <button
      onClick={onClick}
      className={`cursor-pointer relative p-2 ${className} transition-colors duration-300 focus:outline-hidden`}
      aria-label={t('search.open')}
    >
      <Search size={22} strokeWidth={1.5} className={iconClassName} />
    </button>
  );
}
