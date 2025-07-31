import { FixedSizeList as List } from 'react-window';
import BlogCard from './BlogCard';
import { Article } from '@/lib/store';

interface VirtualizedArticleListProps {
  articles: Article[];
  height: number;
}

export default function VirtualizedArticleList({ articles, height }: VirtualizedArticleListProps) {
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style} className="p-2">
      <BlogCard {...articles[index]} />
    </div>
  );

  return (
    <List
      height={height}
      itemCount={articles.length}
      itemSize={400}
      width="100%"
    >
      {Row}
    </List>
  );
} 