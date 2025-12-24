import Image from "next/image";

interface Article {
  id: number;
  title: string;
  category: string;
  author: string;
  date: string;
  image: string;
}

export default function ArticleCard({ article }: { article: Article }) {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition group">
      <div className="relative w-full h-48">
        <Image
          src={article.image}
          alt={article.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <span className="text-xs text-gray-500 font-medium">
          {article.category}
        </span>
        <h3 className="text-xs md:text-sm font-semibold mt-2 text-gray-900 leading-tight transition-colors duration-300 line-clamp-1 group-hover:line-clamp-none">
          {article.title}
        </h3>
        <p className="text-xs text-gray-400 mt-2">
          {article.author} • {article.date}
        </p>
      </div>
    </div>
  );
}
